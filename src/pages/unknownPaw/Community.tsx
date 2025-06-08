import React, {useState, useEffect} from 'react'
import '../../../public/assets/css/LineIcons.2.0.css'
import '../../../public/assets/css/animate.css'
import '../../../public/assets/css/bootstrap.min.css'
import '../../../public/assets/css/glightbox.min.css'
import '../../../public/assets/css/main.css'
import '../../../public/assets/css/tiny-slider.css'
import {UniversalSkeleton} from '../../components/_Skeletons/UniversalSkeleton'
import {getImageUrl} from '../../utils/getImageUrl'

// 기본 이미지 배열
const defaultImages = [
  '/src/assets/무료나눔.png',
  '/src/assets/오댕이.jpg',
  '/src/assets/피카츄 군침싹.jpg'
]

// 랜덤 이미지 선택 함수
const getRandomDefaultImage = () => {
  const randomIndex = Math.floor(Math.random() * defaultImages.length)
  return defaultImages[randomIndex]
}

// 이미지 URL 생성 함수 추가
const getCommunityImageUrl = (imageName: string) => {
  if (!imageName) return getRandomDefaultImage()
  // CommunityPost.tsx와 동일한 이미지 URL 형식 사용
  return `http://localhost:8080/unknownPaw/api/community/images/${encodeURIComponent(
    imageName
  )}`
}

// 커스텀 스타일 추가
const styles = {
  metaDetails: {
    marginTop: '10px'
  },
  metaDetailsTop: {
    display: 'flex',
    gap: '15px',
    marginBottom: '2px'
  },
  metaDetailsMiddle: {
    display: 'flex',
    gap: '15px',
    marginBottom: '5px'
  },
  metaDetailsBottom: {
    display: 'flex',
    gap: '15px'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  thumbnailImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as const,
    borderRadius: '8px'
  },
  imageContainer: {
    position: 'relative' as const,
    overflow: 'hidden',
    borderRadius: '8px',
    marginBottom: '15px'
  },
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
}

export function Community() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'title' | 'author' | 'content'>('title')

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    // 검색어가 변경될 때마다 검색 실행
    handleSearch()
  }, [searchTerm, searchType, posts])

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:8080/unknownPaw/api/community')
      const data = await response.json()
      console.log('커뮤니티 게시글 데이터:', data)
      console.log('첫 번째 게시글의 이미지:', data[0]?.communityImages)
      setPosts(data)
      setFilteredPosts(data)
      setLoading(false)
    } catch (error) {
      console.error('게시물을 불러오는 데 실패했습니다:', error)
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

  if (loading)
    return (
      <section className="section latest-news-area blog-list page-content">
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
                <UniversalSkeleton type="list" />
              </div>
            </div>
            <aside className="col-lg-4 col-md-5 col-12">
              <div className="sidebar blog-grid-page">
                <div className="widget search-widget">
                  <h5 className="widget-title">
                    <span>게시글 검색</span>
                  </h5>
                  <div className="search-form">
                    <div className="animate-pulse">
                      <div className="h-10 bg-gray-200 rounded mb-3"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="widget popular-feeds mt-5">
                  <h5 className="widget-title">
                    <span>인기 게시물</span>
                  </h5>
                  <div className="popular-feed-loop">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="single-popular-feed animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
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
  if (error) return <div>{error}</div>

  return (
    <section className="section latest-news-area blog-list page-content custom-padding">
      <div className="container">
        {/* 상단 제목 및 네비게이션 */}
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

        {/* 메인 콘텐츠 영역 */}
        <div className="row">
          {/* 게시물 영역 (왼쪽 8컬럼) */}
          <div className="col-lg-8 col-md-7 col-12">
            <div className="row">
              {filteredPosts.map(post => (
                <div key={post.communityId} className="col-lg-4 col-md-6 col-12 mb-4">
                  <div className="single-news wow fadeInUp" data-wow-delay=".2s">
                    <div className="image" style={styles.imageContainer}>
                      <a href={`/communitypost/${post.communityId}`}>
                        <img
                          className="thumb"
                          style={styles.thumbnailImage}
                          src={getCommunityImageUrl(post.communityImages[0])}
                          alt={post.title}
                          onError={e => {
                            const target = e.target as HTMLImageElement
                            console.error('이미지 로드 실패:', target.src)
                            target.src = getRandomDefaultImage()
                          }}
                        />
                      </a>
                    </div>
                    <div className="content-body">
                      <h4 className="title">
                        <a href={`/communitypost/${post.communityId}`}>{post.title}</a>
                      </h4>
                      <p>{post.content}</p>
                      <div className="meta-details" style={styles.metaDetails}>
                        <ul className="meta-details-top" style={styles.metaDetailsTop}>
                          <li>
                            <a href="#">{new Date(post.regDate).toLocaleDateString()}</a>
                          </li>
                        </ul>
                        <ul
                          className="meta-details-middle"
                          style={styles.metaDetailsMiddle}>
                          <li>
                            <a href="#">{post.communityCategory}</a>
                          </li>
                        </ul>
                        <ul
                          className="meta-details-bottom"
                          style={styles.metaDetailsBottom}>
                          <li style={styles.metaItem}>
                            <a href="#">
                              <i className="lni lni-heart"></i> {post.likes}
                            </a>
                          </li>
                          <li style={styles.metaItem}>
                            <a href="#">
                              <i className="lni lni-comments"></i> {post.commentCount}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="pagination left blog-grid-page mt-4">
              <ul className="pagination-list">
                <li>
                  <a href="javascript:void(0)">
                    <i className="lni lni-chevron-left"></i>
                  </a>
                </li>
                <li className="active">
                  <a href="javascript:void(0)">1</a>
                </li>
                <li>
                  <a href="javascript:void(0)">2</a>
                </li>
                <li>
                  <a href="javascript:void(0)">3</a>
                </li>
                <li>
                  <a href="javascript:void(0)">
                    <i className="lni lni-chevron-right"></i>
                  </a>
                </li>
              </ul>
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
  )
}
