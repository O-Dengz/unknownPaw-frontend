// src/pages/community/Community.tsx
import React, {useState, useEffect} from 'react'
import '../../../public/assets/css/LineIcons.2.0.css'
import '../../../public/assets/css/animate.css'
import '../../../public/assets/css/bootstrap.min.css'
import '../../../public/assets/css/glightbox.min.css'
import '../../../public/assets/css/main.css'
import '../../../public/assets/css/tiny-slider.css'

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
  const totalPages = 20 // 예시로 20페이지가 있다고 가정

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    handleSearch()
  }, [searchTerm, searchType, posts])

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:8080/unknownPaw/api/community')
      const data = await response.json()
      setPosts(data)
      setFilteredPosts(data)
      setLoading(false)
    } catch (error) {
      setError('게시물을 불러오는 데 실패했습니다.')
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
          return post.authorName.toLowerCase().includes(searchTermLower) || 
                 post.authorNickname.toLowerCase().includes(searchTermLower)
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

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleNext = () => {
    if (currentPage + 10 <= totalPages) {
      setCurrentPage(currentPage + 10)
    } else {
      setCurrentPage(totalPages)
    }
  }

  const handlePrev = () => {
    if (currentPage - 10 >= 1) {
      setCurrentPage(currentPage - 10)
    } else {
      setCurrentPage(1)
    }
  }

  if (loading) return <div>로딩중...</div>
  if (error) return <div>{error}</div>

  return (
    <section className="section latest-news-area blog-list">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-title">
              <h2 className="wow fadeInUp" data-wow-delay=".4s">
                Community
              </h2>
              <p className="wow fadeInUp" data-wow-delay=".6s">
                서비스를 요청하고 제안을 받아보세요!
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 col-md-7 col-12">
            <div className="row">
              {filteredPosts.map((post) => (
                <div key={post.communityId} className="col-lg-4 col-md-6 col-12 mb-4">
                  <div className="single-news wow fadeInUp" data-wow-delay=".2s">
                    <div className="image">
                      <a href={`/communitypost/${post.communityId}`}>
                        <img
                          className="thumb object-cover h-56 w-full"
                          src={post.communityImages[0] || '/src/assets/no-img.gif'}
                          alt={post.title}
                        />
                      </a>
                    </div>
                    <div className="content-body h-56 flex flex-col justify-between">
                      <h4 className="title">
                        <a href={`/communitypost/${post.communityId}`}>{post.title}</a>
                      </h4>
                      <p className="text-sm">{post.content}</p>
                      <div className="meta-details mt-2">
                        <ul className="meta-details-top" style={{ display: 'flex', gap: '15px', marginBottom: '5px' }}>
                          <li>
                            <a href="#">{new Date(post.regDate).toLocaleDateString()}</a>
                          </li>
                          <li>
                            <a href="#">{post.communityCategory}</a>
                          </li>
                        </ul>
                        <ul className="meta-details-bottom" style={{ display: 'flex', gap: '15px' }}>
                          <li>
                            <a href="#"><i className="lni lni-heart"></i> {post.likes}</a>
                          </li>
                          <li>
                            <a href="#"><i className="lni lni-comments"></i> {post.commentCount}</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pagination left blog-grid-page mt-4">
              <ul className="pagination-list">
                <li>
                  <a
                    href="javascript:void(0)"
                    onClick={handlePrev}
                    className={currentPage === 1 ? 'disabled' : ''}>
                    <i className="lni lni-chevron-left"></i>
                  </a>
                </li>
                {generatePagination().map(page => (
                  <li key={page} className={page === currentPage ? 'active' : ''}>
                    <a href="javascript:void(0)" onClick={() => handlePageChange(page)}>
                      {page}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="javascript:void(0)"
                    onClick={handleNext}
                    className={currentPage + 10 > totalPages ? 'disabled' : ''}>
                    <i className="lni lni-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <aside className="col-lg-4 col-md-5 col-12">
            <div className="sidebar blog-grid-page">
              <div className="widget search-widget">
                <h5 className="widget-title">
                  <span>게시글 검색</span>
                </h5>
                <div className="search-form">
                  <select 
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as 'title' | 'author' | 'content')}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      marginBottom: '10px'
                    }}
                  >
                    <option value="title">제목</option>
                    <option value="author">작성자</option>
                    <option value="content">내용</option>
                  </select>
                  <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                    <input 
                      type="text" 
                      placeholder="검색어를 입력하세요." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit">
                      <i className="lni lni-search-alt"></i>
                    </button>
                  </form>
                </div>
              </div>

              <div className="widget popular-feeds mt-5">
                <h5 className="widget-title">
                  <span>인기 게시물</span>
                </h5>
                <div className="popular-feed-loop">
                  {posts
                    .sort((a, b) => {
                      const scoreA = a.likes + a.commentCount;
                      const scoreB = b.likes + b.commentCount;
                      return scoreB - scoreA;
                    })
                    .slice(0, 3)
                    .map((post) => (
                      <div key={post.communityId} className="single-popular-feed">
                        <div className="feed-desc">
                          <h6 className="post-title">
                            <a href={`/communitypost/${post.communityId}`}>{post.title}</a>
                          </h6>
                          <div className="meta-info" style={{ display: 'flex', gap: '15px', fontSize: '0.9em', color: '#666' }}>
                            <span className="time">
                              <i className="lni lni-calendar"></i>{' '}
                              {new Date(post.regDate).toLocaleDateString()}
                            </span>
                            <span className="likes">
                              <i className="lni lni-heart"></i> {post.likes}
                            </span>
                            <span className="comments">
                              <i className="lni lni-comments"></i> {post.commentCount}
                            </span>
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