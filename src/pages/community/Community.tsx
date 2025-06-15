// src/pages/community/Community.tsx
import React, {useState, useEffect} from 'react'
import '../../../public/assets/css/LineIcons.2.0.css'
import '../../../public/assets/css/animate.css'
import '../../../public/assets/css/bootstrap.min.css'
import '../../../public/assets/css/glightbox.min.css'
import '../../../public/assets/css/main.css'
import '../../../public/assets/css/tiny-slider.css'

// 랜덤 이미지 목록
const randomImages = [
  '/src/assets/무료나눔.png',
  '/src/assets/오댕이.jpg',
  '/src/assets/피카츄 군침싹.jpg',
  '/src/assets/no-img.gif'
]

// 랜덤 이미지 선택 함수
const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * randomImages.length)
  return randomImages[randomIndex]
}

interface CommunityPost {
  communityId: number
  title: string
  content: string
  likes: number
  commentCount: number
  authorName: string
  authorNickname: string
  communityCategory: string
  regDate: string
  communityImages: string[]
  isLiked?: boolean
}

export function Community() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'title' | 'author' | 'content'>('title')
  const [currentPage, setCurrentPage] = useState(1)
  const [memberId, setMemberId] = useState<number | null>(null)
  const totalPages = 20
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [sortBy, setSortBy] = useState<'regDate' | 'likes'>('regDate')
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC')

  useEffect(() => {
    const memberData = sessionStorage.getItem('member')
    if (memberData) {
      const parsed = JSON.parse(memberData)
      setMemberId(parsed.mid)
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    if (posts.length > 0) {
      handleSearch()
    }
  }, [searchTerm, searchType, posts])

  const fetchPosts = async () => {
    try {
      const token = sessionStorage.getItem('token')
      if (!token) {
        setError('로그인이 필요합니다.')
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/community/posts', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`게시물을 불러오는데 실패했습니다. (${response.status})`)
      }

      const data = await response.json()

      if (!Array.isArray(data)) {
        setPosts([])
        setFilteredPosts([])
        setError('데이터 형식이 올바르지 않습니다.')
      } else {
        // 각 게시물의 좋아요 상태 확인
        const postsWithLikeStatus = await Promise.all(
          data.map(async post => {
            if (memberId) {
              const likeResponse = await fetch(
                `/api/community/posts/${post.communityId}/liked?memberId=${memberId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                }
              )
              if (likeResponse.ok) {
                const likeData = await likeResponse.json()
                return {...post, isLiked: likeData.liked}
              }
            }
            return {...post, isLiked: false}
          })
        )
        setPosts(postsWithLikeStatus)
        setFilteredPosts(postsWithLikeStatus)
      }
      setLoading(false)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : '게시물을 불러오는 데 실패했습니다.'
      )
      setPosts([])
      setFilteredPosts([])
      setLoading(false)
    }
  }

  const handleLike = async (postId: number) => {
    if (!memberId) {
      alert('로그인이 필요합니다.')
      return
    }

    try {
      const token = sessionStorage.getItem('token')
      const post = posts.find(p => p.communityId === postId)
      if (!post) return

      const endpoint = post.isLiked ? 'unlike' : 'like'
      const method = post.isLiked ? 'DELETE' : 'POST'

      const response = await fetch(
        `/api/community/posts/${postId}/${endpoint}?memberId=${memberId}`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        // 좋아요 상태 업데이트
        const updatedPosts = posts.map(p => {
          if (p.communityId === postId) {
            return {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1
            }
          }
          return p
        })
        setPosts(updatedPosts)
        setFilteredPosts(updatedPosts)
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error)
      alert('좋아요 처리 중 오류가 발생했습니다.')
    }
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredPosts(posts)
      return
    }

    const searchTermLower = searchTerm.toLowerCase()
    const filtered = posts.filter(post => {
      switch (searchType) {
        case 'title':
          return post.title.toLowerCase().includes(searchTermLower)
        case 'author':
          return (
            post.authorName.toLowerCase().includes(searchTermLower) ||
            post.authorNickname.toLowerCase().includes(searchTermLower)
          )
        case 'content':
          return post.content.toLowerCase().includes(searchTermLower)
        default:
          return true
      }
    })
    setFilteredPosts(filtered)
  }

  const generatePagination = () => {
    const pages = []
    let startPage = Math.floor((currentPage - 1) / 10) * 10 + 1
    let endPage = Math.min(startPage + 9, totalPages)
    for (let i = startPage; i <= endPage; i++) pages.push(i)
    return pages
  }

  const handlePageChange = (page: number) => setCurrentPage(page)
  const handleNext = () =>
    setCurrentPage(currentPage + 10 <= totalPages ? currentPage + 10 : totalPages)
  const handlePrev = () => setCurrentPage(currentPage - 10 >= 1 ? currentPage - 10 : 1)

  const handleSortChange = (
    newSortBy: 'regDate' | 'likes',
    newSortOrder: 'ASC' | 'DESC'
  ) => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
  }

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'regDate') {
      return sortOrder === 'DESC'
        ? new Date(b.regDate).getTime() - new Date(a.regDate).getTime()
        : new Date(a.regDate).getTime() - new Date(b.regDate).getTime()
    } else {
      return sortOrder === 'DESC' ? b.likes - a.likes : a.likes - b.likes
    }
  })

  if (loading) return <div>로딩중...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="pet-owner-page">
      <section className="items-grid section custom-padding page-content">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="po-section-title">
                <h2>시끌벅적</h2>
                <p>반려동물과 함께하는 일상을 공유해보세요!</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="search-bar-container">
                <div className="search-input-group">
                  <select
                    className="search-select"
                    value={searchType}
                    onChange={e =>
                      setSearchType(e.target.value as 'title' | 'author' | 'content')
                    }>
                    <option value="title">제목</option>
                    <option value="author">작성자</option>
                    <option value="content">내용</option>
                  </select>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="검색어를 입력하세요..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSearch()}
                  />
                  <button className="search-button" onClick={handleSearch}>
                    검색
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-3 align-items-center">
            <div className="col-md-6 col-12">
              <div className="view-options">
                <button
                  className={`view-button ${viewMode === 'card' ? 'active' : ''}`}
                  onClick={() => setViewMode('card')}
                  style={{
                    padding: '8px 16px',
                    marginRight: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: viewMode === 'card' ? '#32ade6' : 'white',
                    color: viewMode === 'card' ? 'white' : '#333',
                    cursor: 'pointer'
                  }}>
                  <i className="lni lni-grid-alt"></i> 카드형
                </button>
                <button
                  className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: viewMode === 'list' ? '#32ade6' : 'white',
                    color: viewMode === 'list' ? 'white' : '#333',
                    cursor: 'pointer'
                  }}>
                  <i className="lni lni-list"></i> 목록형
                </button>
              </div>
            </div>
            <div className="col-md-6 col-12 text-md-end text-start">
              <div className="sort-options">
                <button
                  className={`sort-button ${
                    sortBy === 'regDate' && sortOrder === 'DESC' ? 'active' : ''
                  }`}
                  onClick={() => handleSortChange('regDate', 'DESC')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0 5px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color:
                      sortBy === 'regDate' && sortOrder === 'DESC' ? '#f1a852' : '#555',
                    fontWeight:
                      sortBy === 'regDate' && sortOrder === 'DESC' ? 'bold' : 'normal'
                  }}>
                  최신순
                </button>
                <span className="separator" style={{margin: '0 5px', color: '#ccc'}}>
                  |
                </span>
                <button
                  className={`sort-button ${
                    sortBy === 'likes' && sortOrder === 'DESC' ? 'active' : ''
                  }`}
                  onClick={() => handleSortChange('likes', 'DESC')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0 5px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: sortBy === 'likes' && sortOrder === 'DESC' ? '#f1a852' : '#555',
                    fontWeight:
                      sortBy === 'likes' && sortOrder === 'DESC' ? 'bold' : 'normal'
                  }}>
                  좋아요순
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8 col-md-7 col-12">
              <div className="row">
                {sortedPosts.length > 0 ? (
                  sortedPosts.map(post =>
                    viewMode === 'card' ? (
                      <div key={post.communityId} className="col-lg-4 col-md-6 col-12 mb-4">
                        <div className="single-news wow fadeInUp" data-wow-delay=".2s">
                          <div className="image">
                            <a href={`/communitypost/${post.communityId}`}>
                              <img
                                className="thumb object-cover h-40 w-full"
                                src={post.communityImages[0] || getRandomImage()}
                                alt={post.title}
                              />
                            </a>
                          </div>
                          <div className="content-body p-3">
                            <h4 className="title mb-1 text-base">
                              <a href={`/communitypost/${post.communityId}`}>
                                {post.title}
                              </a>
                            </h4>
                            <p
                              className="text-sm line-clamp-2"
                              style={{marginBottom: '4px'}}>
                              {post.content}
                            </p>
                            <div className="meta-details">
                              <div
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: '8px',
                                  fontSize: '0.8em',
                                  color: '#888',
                                  fontWeight: 400
                                }}>
                                <span>
                                  <i className="lni lni-calendar"></i>{' '}
                                  {new Date(post.regDate).getMonth() + 1}월{' '}
                                  {new Date(post.regDate).getDate()}일
                                </span>
                                <span>
                                  <i className="lni lni-tag"></i> {post.communityCategory}
                                </span>
                                <span
                                  onClick={() => handleLike(post.communityId)}
                                  style={{cursor: 'pointer'}}>
                                  <i
                                    className={`lni lni-heart ${
                                      post.isLiked ? 'text-red-500' : ''
                                    }`}></i>{' '}
                                  {post.likes}
                                </span>
                                <span>
                                  <i className="lni lni-comments"></i> {post.commentCount}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div key={post.communityId} className="col-12 mb-2">
                        <div
                          className="single-news wow fadeInUp"
                          data-wow-delay=".2s"
                          style={{
                            padding: '12px 15px',
                            border: '1px solid #eee',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            transition: 'all 0.2s ease',
                            height: '100%',
                            minHeight: '60px'
                          }}>
                          <div
                            style={{
                              flex: '1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '10px'
                            }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                flex: '1'
                              }}>
                              <h4
                                className="title mb-0"
                                style={{
                                  fontSize: '1rem',
                                  fontWeight: '500',
                                  margin: 0,
                                  flex: '1',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                <a
                                  href={`/communitypost/${post.communityId}`}
                                  style={{
                                    color: '#333',
                                    textDecoration: 'none'
                                  }}>
                                  {post.title}
                                </a>
                              </h4>
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '12px',
                                  fontSize: '0.85em',
                                  color: '#666',
                                  alignItems: 'center',
                                  whiteSpace: 'nowrap'
                                }}>
                                <span>
                                  <i className="lni lni-user"></i> {post.authorNickname}
                                </span>
                                <span>
                                  <i className="lni lni-calendar"></i>{' '}
                                  {new Date(post.regDate).toLocaleDateString()}
                                </span>
                                <span>
                                  <i className="lni lni-tag"></i> {post.communityCategory}
                                </span>
                                <span
                                  onClick={() => handleLike(post.communityId)}
                                  style={{cursor: 'pointer'}}>
                                  <i
                                    className={`lni lni-heart ${
                                      post.isLiked ? 'text-red-500' : ''
                                    }`}></i>{' '}
                                  {post.likes}
                                </span>
                                <span>
                                  <i className="lni lni-comments"></i> {post.commentCount}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="col-12">
                    <p>게시글이 없습니다.</p>
                  </div>
                )}
              </div>

              <div className="pagination left blog-grid-page mt-4">
                <ul className="pagination-list">
                  <li>
                    <a
                      href="#"
                      onClick={handlePrev}
                      className={currentPage === 1 ? 'disabled' : ''}>
                      <i className="lni lni-chevron-left"></i>
                    </a>
                  </li>
                  {generatePagination().map(page => (
                    <li key={page} className={page === currentPage ? 'active' : ''}>
                      <a
                        href="#"
                        onClick={e => {
                          e.preventDefault()
                          handlePageChange(page)
                        }}>
                        {page}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href="#"
                      onClick={e => {
                        e.preventDefault()
                        handleNext()
                      }}
                      className={currentPage + 10 > totalPages ? 'disabled' : ''}>
                      <i className="lni lni-chevron-right"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
