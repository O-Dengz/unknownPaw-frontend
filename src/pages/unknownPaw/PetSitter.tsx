import React, {useEffect, useState} from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import {Pagination} from '../../components/Pagination'
import {formatTimeAgo} from '../../utils/timeAgo'
import dogImg from '../../../public/assets/images/pet/empty-dog.jpg' // 실제 이미지 경로에 맞게 수정
import ScrollToTopButton from '../../components/ScrollToTopButton'
import PawRating from '../../components/PawRating'
import {getImageUrl} from '@/utils/getImageUrl'

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
  email?: string
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
      // sortOrder는 sortBy와 함께 항상 추가
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
        console.error('No token found in sessionStorage. User is not logged in.')
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

      // 정렬 파라미터 추가
      if (pageRequest.sortBy) {
        // 'sort=필드명,정렬방식' 형식으로 파라미터 이름을 'sort'로 변경
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
          if (data.content) {
            setPosts(prevPosts => [...data.content] as Post[])
          }
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
  }, [pageRequest])

  const handlePageChange = (page: number) => {
    setPageRequest(prev => ({...prev, page}))
  }
  const handleSortChange = (sortBy: string, sortOrder: 'ASC' | 'DESC') => {
    // 정렬 기준 변경 시 첫 페이지로 이동
    setPageRequest(prev => ({
      ...prev,
      page: 0,
      sortBy: sortBy,
      sortOrder: sortOrder
    }))
  }

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>{error}</div>

  // 검색 결과 없음 안내
  !loading && posts?.length === 0 && (pageRequest.keyword || pageRequest.type)

  return (
    <div className="pet-owner-page">
      {/* */}
      <ScrollToTopButton />
      <section className="items-grid section custom-padding">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <h2 className="wow fadeInUp" data-wow-delay=".4s">
                  Pet Sitter
                </h2>
                <p className="wow fadeInUp" data-wow-delay=".6s">
                  서비스를 제안하고 산책 제안을 받아보세요!
                </p>
              </div>
            </div>
          </div>
          {/* 검색 바 */}
          <div className="row mb-4">
            <div className="col-18">
              <div className="search-bar-wrap">
                <select
                  className="search-select"
                  value={searchType}
                  onChange={e =>
                    setSearchType(e.target.value as 'title' | 'content' | 'author')
                  }
                  style={{marginRight: '10px'}}>
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
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setPageRequest(prev => ({
                        ...prev,
                        page: 0,
                        keyword: searchKeyword,
                        type: searchType
                      }))
                    }
                  }}
                />
                <button
                  className="search-btn"
                  onClick={() => {
                    setPageRequest(prev => ({
                      ...prev,
                      page: 0,
                      keyword: searchKeyword,
                      type: searchType
                    }))
                  }}
                  type="button">
                  <i className="lni lni-search"></i>
                </button>
                {searchKeyword && (
                  <button
                    className={`clear-btn visible`}
                    onClick={handleClearSearch}
                    type="button">
                    <i className="lni lni-close"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* 정렬 기능 추후 추가 (좋아요 순, 최신 순  현재는 최신순으로 정렬됨)*/}
          {/* 아이템 개수 / 정렬 조건  */}
          <div className="row mb-3 align-items-center">
            {' '}
            {/* 세로 중앙 정렬 */}
            <div className="col-md-6 col-12">
              {/* 총 게시물 개수 표시 */}
              {pageInfo?.totalElements !== undefined && (
                <p className="total-items-count" style={{fontSize: '1rem', margin: 0}}>
                  총{' '}
                  <strong style={{color: '#F1A852'}}>
                    {pageInfo.totalElements.toLocaleString()}
                  </strong>{' '}
                  건
                </p>
              )}
            </div>
            <div className="col-md-6 col-12 text-md-end text-start">
              {' '}
              {/* 모바일에서는 왼쪽, md 이상에서 오른쪽 정렬 */}
              {/* 정렬 버튼 영역 */}
              <div className="sort-options">
                {/* 최신순 */}
                <button
                  className={`sort-button ${
                    pageRequest.sortBy === 'regDate' && pageRequest.sortOrder === 'DESC'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => handleSortChange('regDate', 'DESC')}>
                  최신순
                </button>
                <span className="separator">|</span>
                {/* 좋아요순 - 백엔드에서 'likes' 필드로 정렬 지원해야 함 */}
                <button
                  className={`sort-button ${
                    pageRequest.sortBy === 'likes' && pageRequest.sortOrder === 'DESC'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => handleSortChange('likes', 'DESC')}>
                  좋아요순
                </button>
                <span className="separator">|</span>
                {/* 낮은 가격순 */}
                <button
                  className={`sort-button ${
                    pageRequest.sortBy === 'hourlyRate' && pageRequest.sortOrder === 'ASC'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => handleSortChange('hourlyRate', 'ASC')}>
                  낮은 가격순
                </button>
                <span className="separator">|</span>
                {/* 높은 가격순 */}
                <button
                  className={`sort-button ${
                    pageRequest.sortBy === 'hourlyRate' &&
                    pageRequest.sortOrder === 'DESC'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => handleSortChange('hourlyRate', 'DESC')}>
                  높은 가격순
                </button>
              </div>
            </div>
          </div>

          <div className="single-head">
            <div className="row">
              {!loading && posts?.length > 0 ? (
                posts?.map((post, index) => (
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
                          {/* 예약하기 별도 */}
                          <p className="sale">예약하기</p>
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
                          {/* 발바닥 지수 */}
                          <ul className="paw-rating">
                            <li>
                              <PawRating rating={post.member?.pawRate || 0} />
                              {/* <PawRating rating={3.1} /> */}
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
              ) : !loading && posts?.length === 0 ? (
                <div className="col-12 text-center p-4">
                  <h5 className="mb-3">🔍 검색 결과가 없습니다.</h5>
                  <p className="text-muted">다른 키워드로 다시 시도해보세요.</p>
                  <button
                    onClick={handleClearSearch}
                    className="btn btn-outline-primary mt-3">
                    ← 이전 페이지로 돌아가기
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {pageInfo && !loading && (
            <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
          )}
        </div>
      </section>
      {/* */}
    </div>
  )
}
