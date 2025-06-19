import {useParams, useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import '../../../public/assets/css/LineIcons.2.0.css'
import '../../../public/assets/css/animate.css'
import '../../../public/assets/css/bootstrap.min.css'
import '../../../public/assets/css/glightbox.min.css'
import '../../../public/assets/css/main.css'
import '../../../public/assets/css/tiny-slider.css'
import './CommunityPost.css'
import {getImageUrl} from '../../utils/getImageUrl'

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
  authorProfileImage: string
  communityCategory: string
  regDate: string
  communityImages: string[]
  viewCount: number
  authorId: number
}

export default function CommunityPost() {
  const {postId} = useParams()
  const [post, setPost] = useState<CommunityPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'title' | 'author' | 'content'>('title')
  const navigate = useNavigate()

  useEffect(() => {
    fetchPost()
    fetchPosts()
  }, [postId])

  const fetchPost = async () => {
    try {
      const token = sessionStorage.getItem('token')
      if (!token) {
        setError('로그인이 필요합니다.')
        window.location.href = '/login'
        return
      }

      console.log('Fetching post from:', `/api/community/posts/${postId}`)
      const response = await fetch(`/api/community/posts/${postId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        throw new Error(`게시글을 불러오는데 실패했습니다. (${response.status})`)
      }

      const data = await response.json()
      console.log('API Response:', data)
      setPost(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching post:', error)
      setError(
        error instanceof Error ? error.message : '게시글을 불러오는데 실패했습니다.'
      )
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      const token = sessionStorage.getItem('token')
      if (!token) {
        setError('로그인이 필요합니다.')
        window.location.href = '/login'
        return
      }

      console.log('Fetching posts from:', '/api/community/posts')
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
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        throw new Error(`게시물을 불러오는데 실패했습니다. (${response.status})`)
      }

      const data = await response.json()
      console.log('API Response:', data)
      if (Array.isArray(data)) {
        setPosts(data)
      } else {
        console.error('API 응답이 배열이 아닙니다:', data)
        setPosts([])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([])
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
                  <a href="/">
                    <img
                      src="/assets/images/logo/logo.png"
                      alt="UnknownPaw"
                      style={{height: '30px'}}
                    />
                  </a>
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
      <section className="section blog-single" style={{padding: '20px 0 !important'}}>
        <div className="container" style={{marginTop: '-80px'}}>
          <div className="row">
            <div className="col-12">
              <div
                className="single-inner"
                style={{
                  background: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  padding: '32px 28px',
                  marginBottom: '32px'
                }}>
                {/* 제목 */}
                <h1
                  className="post-title"
                  style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    marginBottom: '12px',
                    lineHeight: 1.3
                  }}>
                  {post.title}
                </h1>
                {/* 메타 정보 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '18px',
                    marginBottom: '18px',
                    flexWrap: 'wrap'
                  }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <img
                      src={getImageUrl(post.authorProfileImage) || '/assets/no-img.gif'}
                      alt={post.authorNickname}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid #eee'
                      }}
                    />
                    <span style={{fontWeight: 500, fontSize: '1.05em'}}>
                      {post.authorNickname}
                    </span>
                  </div>
                  <span style={{color: '#888', fontSize: '0.98em'}}>
                    <i className="lni lni-calendar"></i>{' '}
                    {new Date(post.regDate).toLocaleDateString()}
                  </span>
                  <span style={{color: '#888', fontSize: '0.98em'}}>
                    <i className="lni lni-eye"></i> {post.viewCount}
                  </span>
                  <span style={{color: '#888', fontSize: '0.98em'}}>
                    <i className="lni lni-heart"></i> {post.likes}
                  </span>
                  <span style={{color: '#888', fontSize: '0.98em'}}>
                    <i className="lni lni-comments"></i> {post.commentCount}
                  </span>
                </div>
                {/* 이미지 */}
                {post.communityImages[0] && (
                  <div style={{marginBottom: '24px'}}>
                    <img
                      src={post.communityImages[0] || getRandomImage()}
                      alt={post.title}
                      style={{
                        width: '100%',
                        maxHeight: '420px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        background: '#f8f8f8'
                      }}
                    />
                  </div>
                )}
                {/* 본문 */}
                <div
                  className="post-content"
                  style={{
                    marginTop: '10px',
                    lineHeight: '1.85',
                    fontSize: '1.13em',
                    color: '#222',
                    minHeight: '120px'
                  }}>
                  {post.content}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 버튼 컨테이너 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px' /* 버튼 사이 간격 */,
            marginTop: '20px' /* 상단 여백 */
          }}>
          <button
            onClick={() => navigate(-1)}
            className="reserve-button"
            style={{
              background: '#eee',
              color: '#333'
            }}>
            목록으로
          </button>
          {post.authorId === Number(sessionStorage.getItem('mid')) && (
            <button
              onClick={() => navigate(`/community/edit/${post.communityId}`)}
              className="reserve-button"
              style={{
                background: '#f4c150',
                color: '#fff'
              }}>
              수정하기
            </button>
          )}
        </div>
      </section>
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
