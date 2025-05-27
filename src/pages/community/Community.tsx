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
}

export function Community() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'title' | 'author' | 'content'>('title')
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 20

  useEffect(() => {
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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
        setPosts(data)
        setFilteredPosts(data)
      }
      setLoading(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : '게시물을 불러오는 데 실패했습니다.')
      setPosts([])
      setFilteredPosts([])
      setLoading(false)
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
  const handleNext = () => setCurrentPage(currentPage + 10 <= totalPages ? currentPage + 10 : totalPages)
  const handlePrev = () => setCurrentPage(currentPage - 10 >= 1 ? currentPage - 10 : 1)

  if (loading) return <div>로딩중...</div>
  if (error) return <div>{error}</div>

  return (
    <section className="section latest-news-area blog-list">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-title">
              <h2 className="wow fadeInUp" data-wow-delay=".4s">Community</h2>
              <p className="wow fadeInUp" data-wow-delay=".6s">서비스를 요청하고 제안을 받아보세요!</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 col-md-7 col-12">
            <div className="row">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
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
                          <a href={`/communitypost/${post.communityId}`}>{post.title}</a>
                        </h4>
                        <p className="text-sm line-clamp-2" style={{ marginBottom: '4px' }}>{post.content}</p>
                        <div className="meta-details">
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.8em', color: '#888', fontWeight: 400 }}>
                            <span><i className="lni lni-calendar"></i> {new Date(post.regDate).getMonth() + 1}월 {new Date(post.regDate).getDate()}일</span>
                            <span><i className="lni lni-tag"></i> {post.communityCategory}</span>
                            <span><i className="lni lni-heart"></i> {post.likes}</span>
                            <span><i className="lni lni-comments"></i> {post.commentCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12"><p>게시글이 없습니다.</p></div>
              )}
            </div>

            <div className="pagination left blog-grid-page mt-4">
              <ul className="pagination-list">
                <li>
                  <a href="#" onClick={handlePrev} className={currentPage === 1 ? 'disabled' : ''}>
                    <i className="lni lni-chevron-left"></i>
                  </a>
                </li>
                {generatePagination().map(page => (
                  <li key={page} className={page === currentPage ? 'active' : ''}>
                    <a href="#" onClick={e => { e.preventDefault(); handlePageChange(page) }}>{page}</a>
                  </li>
                ))}
                <li>
                  <a href="#" onClick={e => { e.preventDefault(); handleNext() }} className={currentPage + 10 > totalPages ? 'disabled' : ''}>
                    <i className="lni lni-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <aside className="col-lg-3 col-md-5 col-12">
            <div className="sidebar blog-grid-page" style={{ position: 'sticky', top: '20px' }}>
              <div className="widget search-widget" style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                <h5 className="widget-title" style={{ fontSize: '1em', marginBottom: '8px' }}>
                  <span>게시글 검색</span>
                </h5>
                <div className="search-form">
                  <select
                    value={searchType}
                    onChange={e => setSearchType(e.target.value as 'title' | 'author' | 'content')}
                    style={{
                      width: '100%',
                      padding: '4px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      marginBottom: '6px',
                      fontSize: '0.85em'
                    }}
                  >
                    <option value="title">제목</option>
                    <option value="author">작성자</option>
                    <option value="content">내용</option>
                  </select>
                  <form onSubmit={e => { e.preventDefault(); handleSearch() }}>
                    <input
                      type="text"
                      placeholder="검색어를 입력하세요."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      style={{ fontSize: '0.85em', padding: '4px' }}
                    />
                    <button type="submit" style={{ padding: '4px 8px' }}>
                      <i className="lni lni-search-alt"></i>
                    </button>
                  </form>
                </div>
              </div>

              <div className="widget popular-feeds mt-3">
                <h5 className="widget-title" style={{ fontSize: '1em', marginBottom: '8px' }}>
                  <span>인기 게시물</span>
                </h5>
                <div className="popular-feed-loop">
                  {posts
                    .sort((a, b) => (b.likes + b.commentCount) - (a.likes + a.commentCount))
                    .slice(0, 3)
                    .map(post => (
                      <div key={post.communityId} className="single-popular-feed">
                        <div className="feed-desc">
                          <h6 className="post-title">
                            <a href={`/communitypost/${post.communityId}`}>{post.title}</a>
                          </h6>
                          <div className="meta-info" style={{ display: 'flex', gap: '15px', fontSize: '0.9em', color: '#666' }}>
                            <span><i className="lni lni-calendar"></i> {new Date(post.regDate).toLocaleDateString()}</span>
                            <span><i className="lni lni-heart"></i> {post.likes}</span>
                            <span><i className="lni lni-comments"></i> {post.commentCount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
