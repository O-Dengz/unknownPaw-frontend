import {useParams} from 'react-router-dom'
import {useState, useEffect} from 'react'
import '../../../public/assets/css/LineIcons.2.0.css'
import '../../../public/assets/css/animate.css'
import '../../../public/assets/css/bootstrap.min.css'
import '../../../public/assets/css/glightbox.min.css'
import '../../../public/assets/css/main.css'
import '../../../public/assets/css/tiny-slider.css'
import './CommunityPost.css'
import Header from '../../components/Layout/Header'

interface CommunityPost {
  communityId: number
  title: string
  content: string
  likes: number
  commentCount: number
  authorName: string
  authorNickname: string
  authorProfileImage: string
  communityCategory: string
  regDate: string
  communityImages: string[]
  viewCount: number
}

export default function CommunityPost() {
  const {postId} = useParams()
  const [post, setPost] = useState<CommunityPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'title' | 'author' | 'content'>('title')

  useEffect(() => {
    fetchPost()
    fetchPosts()
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/unknownPaw/api/community/${postId}`
      )
      if (!response.ok) {
        throw new Error('게시글을 불러오는데 실패했습니다.')
      }
      const data = await response.json()
      setPost(data)
      setLoading(false)
    } catch (error) {
      setError('게시글을 불러오는데 실패했습니다.')
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:8080/unknownPaw/api/community')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('게시물을 불러오는 데 실패했습니다.')
    }
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) {
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
    // 검색 결과로 이동
    if (filtered.length > 0) {
      window.location.href = `/communitypost/${filtered[0].communityId}`
    }
  }

  if (loading) return <div>로딩중...</div>
  if (error) return <div>{error}</div>
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>

  return (
    <>
      <Header />
      <main>
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-6 col-12">
                <div className="breadcrumbs-content">
                  <h1 className="page-title">커뮤니티 게시글 상세</h1>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-12">
                <ul className="breadcrumb-nav">
                  <li>
                    <a href="/">홈</a>
                  </li>
                  <li>
                    <a href="/community">커뮤니티</a>
                  </li>
                  <li>게시글 상세</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Single Area */}
        <section className="section blog-single">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-12 col-12">
                <div className="single-inner">
                  <div className="post-thumbnils">
                    <img
                      src={post.communityImages[0] || '/src/assets/no-img.gif'}
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '400px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                  <div className="post-details">
                    <div className="detail-inner">
                      <h2 className="post-title">{post.title}</h2>
                      <div className="post-meta">
                        <div className="author-info" style={{marginBottom: '15px'}}>
                          <img
                            src={post.authorProfileImage || '/src/assets/no-img.gif'}
                            alt={post.authorNickname}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              marginRight: '10px'
                            }}
                          />
                          <span>{post.authorNickname}</span>
                        </div>
                        <ul className="custom-flex post-meta">
                          <li>
                            <i className="lni lni-calendar"></i>
                            {new Date(post.regDate).toLocaleDateString()}
                          </li>
                          <li>
                            <i className="lni lni-comments"></i>
                            댓글 {post.commentCount}개
                          </li>
                          <li>
                            <i className="lni lni-eye"></i>
                            조회수 {post.viewCount}
                          </li>
                          <li>
                            <i className="lni lni-heart"></i>
                            좋아요 {post.likes}
                          </li>
                        </ul>
                      </div>
                      <div
                        className="post-content"
                        style={{
                          marginTop: '20px',
                          lineHeight: '1.8',
                          fontSize: '1.1em'
                        }}>
                        {post.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 사이드바 영역 (오른쪽 4컬럼) */}
              <aside className="col-lg-4 col-md-5 col-12">
                <div className="sidebar blog-grid-page">
                  {/* 검색 위젯 */}
                  <div className="widget search-widget">
                    <h5 className="widget-title">
                      <span>게시글 검색</span>
                    </h5>
                    <div className="search-form">
                      <select
                        value={searchType}
                        onChange={e =>
                          setSearchType(e.target.value as 'title' | 'author' | 'content')
                        }
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          marginBottom: '10px'
                        }}>
                        <option value="title">제목</option>
                        <option value="author">작성자</option>
                        <option value="content">내용</option>
                      </select>
                      <form
                        onSubmit={e => {
                          e.preventDefault()
                          handleSearch()
                        }}>
                        <input
                          type="text"
                          placeholder="검색어를 입력하세요."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                        />
                        <button type="submit">
                          <i className="lni lni-search-alt"></i>
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* 인기글 위젯 */}
                  <div className="widget popular-feeds mt-5">
                    <h5 className="widget-title">
                      <span>인기 게시물</span>
                    </h5>
                    <div className="popular-feed-loop">
                      {posts
                        .sort((a, b) => {
                          // 좋아요와 댓글 수를 합산한 점수로 정렬
                          const scoreA = a.likes + a.commentCount
                          const scoreB = b.likes + b.commentCount
                          return scoreB - scoreA
                        })
                        .slice(0, 3)
                        .map(post => (
                          <div
                            key={post.communityId}
                            className="single-popular-feed"
                            style={styles.popularFeedItem}>
                            <div className="feed-desc">
                              <h6 className="post-title">
                                <a href={`/communitypost/${post.communityId}`}>
                                  {post.title}
                                </a>
                              </h6>
                              <div className="meta-info" style={styles.popularFeedMeta}>
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
      </main>
    </>
  )
}

// 스타일 정의
const styles = {
  popularFeedMeta: {
    display: 'flex',
    gap: '15px',
    marginTop: '5px',
    fontSize: '0.9em',
    color: '#666'
  },
  popularFeedItem: {
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee'
  }
}
