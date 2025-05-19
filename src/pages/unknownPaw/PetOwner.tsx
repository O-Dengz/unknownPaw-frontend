import React, {useEffect, useState} from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import {Pagination} from '../../components/Pagination'
import {formatTimeAgo} from '../../utils/timeAgo'
import ScrollToTopButton from '../../components/ScrollToTopButton'
import PawRating from '../../components/PawRating'

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
  image?: {
    imageId: number
    imagePath: string
    isMain: boolean
  }[]
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

interface SpringPageResponse {
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

export function PetOwner() {
  const navigate = useNavigate()
  const location = useLocation()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pageInfo, setPageInfo] = useState<SpringPageResponse | null>(null)
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
      let apiUrl = `http://localhost:8080/unknownPaw/api/posts/petowner/list?page=${pageParam}&size=${pageRequest.size}`

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
            const errorText = await response.text()
            if (response.status === 401 || response.status === 403) {
              sessionStorage.removeItem('token')
              navigate('/login')
              throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
            }
            throw new Error(`서버 오류: ${errorText || response.status}`)
          }
          return response.json()
        })
        .then((data: SpringPageResponse) => {
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
  }, [pageRequest, navigate])

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

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="pet-owner-page">
      <ScrollToTopButton />
      <section className="items-grid section custom-padding">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <h2 className="wow fadeInUp" data-wow-delay=".4s">
                  Pet Owner
                </h2>
                <p className="wow fadeInUp" data-wow-delay=".6s">
                  서비스를 요청하고 제안을 받아보세요!
                </p>
              </div>
            </div>
          </div>
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
          <div className="row mb-3 align-items-center">
            <div className="col-md-6 col-12">
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
              <div className="sort-options">
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
                <button
                  className={`sort-button ${
                    pageRequest.sortBy === 'hourlyRate' && pageRequest.sortOrder === 'DESC'
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
                          to={`/posts/petowner/read/${post.postId}`}
                          className="thumbnail">
                          <img
                            src={
                              post.image?.[0]?.imagePath || '/assets/images/pet/dog-2.jpg'
                            }
                            alt="#"
                          />
                        </Link>
                        <div className="author">
                          <div className="author-image">
                            <Link to={`/profile/simple/${post.member?.mid}`}>
                              <img
                                src={
                                  post.member?.profileImagePath ||
                                  '/assets/images/items-grid/author-1.jpg'
                                }
                                alt="#"
                              />
                              <span>{post.member?.nickname || 'Unknown'}</span>
                            </Link>
                          </div>
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
                          <span className="like">
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
    </div>
  )
}
