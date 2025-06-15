import React, {useEffect, useState} from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import {Pagination} from '../../components/Pagination'
import {formatTimeAgo} from '../../utils/timeAgo'
import ScrollToTopButton from '../../components/ScrollToTopButton'
import PawRating from '../../components/PawRating'
import {getImageUrl} from '@/utils/getImageUrl'
import { UniversalSkeleton } from '@/components/UniversalSkeleton'
import './PetOwner.css'


interface MemberResponseDTO {
  mid: number
  email: string
  nickname: string
  profileImagePath?: string
  pawRate?: number
  emailVerified?: boolean
  role?: string
  status?: string
  regDate?: string
}

interface ImageDTO {
  imageId: number
  imagePath: string
  thumbnailPath?: string
  isMain: boolean
}

interface Post {
  postId: number
  title: string
  content: string
  serviceCategory: string
  hourlyRate: number
  likes?: number
  chatCount?: number
  defaultLocation: string
  regDate: string
  images?: ImageDTO[]
  member?: MemberResponseDTO
}

interface PageRequestDTO {
  page: number
  size: number
  type?: string
  keyword?: string
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

interface PageResultDTO {
  content: Post[]
  pageable: {
    pageNumber: number
    pageSize: number
  }
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
  empty: boolean
  number: number
  size: number
}

export function PetSitter() {
  const navigate = useNavigate()
  const location = useLocation()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pageInfo, setPageInfo] = useState<PageResultDTO | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchType, setSearchType] = useState<'title' | 'content' | 'author'>('title')
  const [pageRequest, setPageRequest] = useState<PageRequestDTO>(() => {
    const searchParams = new URLSearchParams(location.search)
    const pageFromUrl = parseInt(searchParams.get('page') || '1')
    const initialPage = pageFromUrl > 0 ? pageFromUrl - 1 : 0
    const typeFromUrl = searchParams.get('type')
    const keyword = searchParams.get('keyword') || undefined
    const sortBy = searchParams.get('sortBy') || 'regDate'
    const sortOrder =
      searchParams.get('sortOrder')?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    return {
      page: initialPage,
      size: 12,
      type: typeFromUrl || undefined,
      keyword: keyword,
      sortBy: sortBy,
      sortOrder: sortOrder
    }
  })

  const handleClearSearch = () => {
    setSearchKeyword('')
    setPageRequest(prev => ({
      ...prev,
      page: 0,
      keyword: undefined,
      type: undefined
    }))
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const urlPage = pageRequest.page + 1
    searchParams.set('page', urlPage.toString())
    if (pageRequest.type) {
      searchParams.set('type', pageRequest.type)
    } else {
      searchParams.delete('type')
    }
    if (pageRequest.keyword) {
      searchParams.set('keyword', pageRequest.keyword)
    } else {
      searchParams.delete('keyword')
    }
    if (pageRequest.sortBy) {
      searchParams.set('sortBy', pageRequest.sortBy)
      searchParams.set('sortOrder', pageRequest.sortOrder || 'DESC')
    }
    navigate(`?${searchParams.toString()}`, {replace: true})
  }, [pageRequest, navigate])

  useEffect(() => {
    const fetchPosts = () => {
      setLoading(true)
      setError(null)

      const latestToken = sessionStorage.getItem('token')

      if (!latestToken) {
        setError('로그인이 필요합니다.')
        setLoading(false)
        return
      }

      const pageParam = pageRequest.page
      let apiUrl = `/api/posts/petsitter/list?page=${pageParam}&size=${pageRequest.size}`

      if (pageRequest.type) {
        apiUrl += `&type=${pageRequest.type}`
      }
      if (pageRequest.keyword) {
        apiUrl += `&keyword=${pageRequest.keyword}`
      }
      if (pageRequest.sortBy) {
        apiUrl += `&sort=${pageRequest.sortBy},${pageRequest.sortOrder || 'DESC'}`
      }

      fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${latestToken}`,
          'Content-Type': 'application/json'
        }
      })
        .then(async response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.json()
        })
        .then((data: PageResultDTO) => {
          setPosts(data.content || [])
          setPageInfo(data)
        })
        .catch(err => {
          console.error('Error fetching posts:', err)
          setError('게시글을 불러오는데 실패했습니다.')
        })
        .finally(() => {
          setLoading(false)
        })
    }

    fetchPosts()
    // 의존성 배열에 navigate 안 넣는 게 좋습니다! (불필요한 재렌더 방지)
  }, [pageRequest])

  const handlePageChange = (page: number) => {
    setPageRequest(prev => ({...prev, page}))
  }
  const handleSortChange = (sortBy: string, sortOrder: 'ASC' | 'DESC') => {
    setPageRequest(prev => ({
      ...prev,
      page: 0,
      sortBy: sortBy,
      sortOrder: sortOrder
    }))
  }

  const handleSearch = () => {
    setPageRequest(prev => ({
      ...prev,
      page: 0,
      keyword: searchKeyword,
      type: searchType
    }))
  }

  if (error)
    return (
      <div className="pet-owner-page">
        <ScrollToTopButton />
        <section className="items-grid section custom-padding page-content">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="po-section-title">
                  <h2>돌봐드려요</h2>
                  <p>서비스를 요청하고 제안을 받아보세요!</p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 po-error-message-container">
                <h5 className="po-error-title">{error}</h5>
                <p className="po-error-text">다른 키워드로 다시 시도해보세요.</p>
                <button
                  onClick={handleClearSearch}
                  className="back-to-previous-btn">
                  ← 이전 페이지로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );

  return (
    <div className="pet-owner-page">
    <ScrollToTopButton />
    <section className="items-grid section custom-padding page-content">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="po-section-title">
              <h2>돌봐드려요</h2>
              <p>서비스를 요청하고 제안을 받아보세요!</p>
            </div>
          </div>
        </div>

          {/* Search Bar */}
          <div className="search-bar-container">
            <div className="search-input-group">
              <select
                className="search-select"
                value={searchType}
                onChange={e =>
                  setSearchType(e.target.value as 'title' | 'content' | 'author')
                }>
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="author">작성자</option>
              </select>
              <input
                type="text"
                className="search-input"
                placeholder="검색어를 입력하세요"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
              />
              <button className="search-button" onClick={handleSearch}>
                검색
              </button>
            </div>
          </div>

          {/* Sorting Buttons */}
          <div className="row sorting-buttons">
            <div className="col-12">
              <button
                className={`sort-button ${pageRequest.sortBy === 'regDate' && pageRequest.sortOrder === 'DESC' ? 'active' : ''}`}
                onClick={() => handleSortChange('regDate', 'DESC')}>
                최신순
              </button>
              <button
                className={`sort-button ${pageRequest.sortBy === 'likes' ? 'active' : ''}`}
                onClick={() => handleSortChange('likes', 'DESC')}>
                인기순
              </button>
              <button
                className={`sort-button ${pageRequest.sortBy === 'price' && pageRequest.sortOrder === 'ASC' ? 'active' : ''}`}
                onClick={() => handleSortChange('price', 'ASC')}>
                낮은 가격순
              </button>
              <button
                className={`sort-button ${pageRequest.sortBy === 'price' && pageRequest.sortOrder === 'DESC' ? 'active' : ''}`}
                onClick={() => handleSortChange('price', 'DESC')}>
                높은 가격순
              </button>
            </div>
          </div>

          {/* Remove duplicate buttons section */}
          <div className="row mb-3 align-items-center">
            <div className="col-md-6 col-12">
              <div className="items-found">
                <p>
                  총 <span>{pageInfo?.totalElements || 0}</span>개의 게시글
                </p>
              </div>
            </div>
          </div>
          <div className="single-head">
            <div className="row">
              {loading ? (
                <UniversalSkeleton type="list" />
              ) : posts?.length > 0 ? (
                posts.map((post, index) => (
                  <div key={post.postId} className="col-lg-4 col-md-6 col-12">
                    <div
                      className="single-grid wow fadeInUp"
                      data-wow-delay={`.${(index + 1) * 2}s`}>
                      <div className="image">
                        <Link
                          to={`/posts/petsitter/read/${post.postId}`}
                          className="thumbnail block overflow-hidden"
                          style={{borderRadius: '10px', height: '220px', width: '100%'}}>
                          <img
                            src={
                              post.images?.[0]
                                ? getImageUrl(
                                    post.images[0].thumbnailPath ??
                                      post.images[0].imagePath
                                  )
                                : '/assets/images/pet/dog-2.jpg'
                            }
                            alt={post.title}
                            className="w-full h-full object-cover object-center"
                            style={{display: 'block'}}
                          />
                        </Link>
                        <div className="author">
                          <div className="author-image">
                            <Link to={`/profile/simple/${post.member?.mid}`}>
                              <img
                                src={
                                  post.member?.profileImagePath
                                    ? getImageUrl(post.member.profileImagePath)
                                    : '/assets/images/items-grid/author-1.jpg'
                                }
                                alt={post.member?.nickname}
                              />
                              <span>{post.member?.nickname || 'Unknown'}</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="content">
                        <div className="top-content">
                          <span className="tag">{post.serviceCategory}</span>
                          <h3 className="title">
                            <Link to={`/posts/petowner/read/${post.postId}`}>
                              {post.title}
                            </Link>
                          </h3>
                          <p className="update-time">{formatTimeAgo(post.regDate)}</p>
                          <ul className="paw-rating">
                            <li>
                              <PawRating rating={post.member?.pawRate || 0} />
                              <p>({post.member?.pawRate?.toFixed(1)})</p>
                            </li>
                          </ul>
                          <ul className="info-list">
                            <li>
                              <span>
                                <i className="lni lni-map-marker"></i>{' '}
                                {post.defaultLocation}
                              </span>
                            </li>
                            <li>
                              <span>
                                <i className="lni lni-timer"></i>{' '}
                                {new Date(post.regDate).toLocaleDateString()}
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="bottom-content">
                          <p className="price">
                            시급: <span>{post.hourlyRate.toLocaleString()}원</span>
                          </p>
                          <span className={`like ${post.likes ? 'active' : ''}`}>
                            <i className="lni lni-heart"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center p-4">
                  <h5 className="mb-3">🔍 검색 결과가 없습니다.</h5>
                  <p className="text-muted">다른 키워드로 다시 시도해보세요.</p>
                  <button
                    onClick={handleClearSearch}
                    className="btn btn-outline-primary mt-3">
                    ← 이전 페이지로 돌아가기
                  </button>
                </div>
              )}
            </div>
          </div>
          {pageInfo && !loading && (
            <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
          )}
        </div>
      </section>
    </div>
  )
}
