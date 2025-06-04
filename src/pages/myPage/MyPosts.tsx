import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {DashboardSidebar} from '../../components/features/dashboard/DashboardSidebar'
import {useNavigate} from 'react-router-dom'
import './myPage.css'
import {getImageUrl} from '@/utils/getImageUrl'

// 타입 정의 (그대로 사용)
interface PostItem {
  id: number
  title: string
  content: string
  regDate: string
  likes: number
  imageUrl?: string
  category?: string
  images?: {
    imageId?: number
    imagePath?: string
    path?: string
    thumbnailPath?: string
    isMain?: boolean
  }[]
}
type TabType = 'PET_OWNER' | 'PET_SITTER' | 'COMMUNITY'

interface ApiError {
  response?: {status: number; statusText: string}
  request?: any
  message?: string
}

export default function MyPosts() {
  const [activeTab, setActiveTab] = useState<TabType>('PET_OWNER')
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // 썸네일 추출 함수
  const getThumbnail = (post: PostItem) => {
    if (post.images && post.images.length > 0) {
      const img = post.images[0]
      return getImageUrl(img.thumbnailPath ?? img.path ?? img.imagePath ?? '')
    }
    if (post.imageUrl) return getImageUrl(post.imageUrl)
    return '/assets/images/default-thumbnail.jpg'
  }

  // 게시글 타입 (URL)
  const getPostType = (post: PostItem) => {
    if ((post as any).postType) return (post as any).postType
    if (activeTab === 'PET_OWNER') return 'petowner'
    if (activeTab === 'PET_SITTER') return 'petsitter'
    return 'community'
  }

  // 날짜 포맷 함수 (YYYY.MM.DD)
  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
      d.getDate()
    ).padStart(2, '0')}`
  }

  // 데이터 가져오기
  const fetchPosts = async (type: TabType) => {
    try {
      setLoading(true)
      setError('')
      const memberString = sessionStorage.getItem('member')
      const token = sessionStorage.getItem('token')
      const member = memberString ? JSON.parse(memberString) : null
      const mid = member?.mid
      if (!mid || !token) throw new Error('로그인이 필요합니다.')

      const urlMap: Record<TabType, string> = {
        PET_OWNER: `/api/posts/petowner/${mid}`,
        PET_SITTER: `/api/posts/petsitter/${mid}`,
        COMMUNITY: `/api/community/${mid}`
      }

      const res = await axios.get(urlMap[type], {
        headers: {Authorization: `Bearer ${token}`}
      })

      // postId 만 있고 id 필드가 없는 경우 보완
      setPosts(
        (res.data as any[])
          .map(p => ({
            ...p,
            id: p.id ?? p.postId
          }))
          .sort((a, b) => new Date(b.regDate).getTime() - new Date(a.regDate).getTime()) // ⭐️ 최신순 정렬 추가!
      )
    } catch (err) {
      const apiErr = err as ApiError
      if (apiErr.response)
        setError(
          `불러오기 실패 (${apiErr.response.status}: ${apiErr.response.statusText})`
        )
      else if (apiErr.request) setError('서버에 연결할 수 없습니다.')
      else setError(err instanceof Error ? err.message : '알 수 없는 오류 발생')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(activeTab)
  }, [activeTab])

  return (
    <div className="page-wrapper">
      {/* --- Breadcrumb --------------------------------------------------- */}
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="page-title">내가 쓴 글</h1>
            </div>
            <div className="col-lg-6">
              <ul className="breadcrumb-nav">
                <li>
                  <a href="/">홈</a>
                </li>
                <li>내가 쓴 글</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* --- 본문 --------------------------------------------------------- */}
      <section className="dashboard section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <DashboardSidebar />
            </div>

            <div className="col-lg-9">
              <div className="profile-settings">
                <div className="profile-settings-block settings-box">
                  {/* 탭 버튼 */}
                  <div className="settings-tabs mb-4">
                    {(['PET_OWNER', 'PET_SITTER', 'COMMUNITY'] as TabType[]).map(tab => (
                      <button
                        key={tab}
                        className={`link-button ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}>
                        {tab === 'PET_OWNER'
                          ? '펫오너'
                          : tab === 'PET_SITTER'
                          ? '펫시터'
                          : '커뮤니티'}
                      </button>
                    ))}
                  </div>

                  {/* 목록 */}
                  {loading ? (
                    <p>불러오는 중...</p>
                  ) : error ? (
                    <p className="text-danger">{error}</p>
                  ) : posts.length === 0 ? (
                    <p>작성한 글이 없습니다.</p>
                  ) : (
                    posts.map(post => {
                      const thumb = getThumbnail(post)
                      return (
                        <div
                          key={post.id}
                          className="post-card p-3 border rounded mb-3 shadow-sm d-flex gap-3 align-items-center"
                          style={{cursor: 'pointer', transition: 'background 0.2s'}}
                          onClick={() =>
                            navigate(`/posts/${getPostType(post)}/read/${post.id}`)
                          }
                          tabIndex={0}
                          onKeyPress={e => {
                            if (e.key === 'Enter') {
                              navigate(`/posts/${getPostType(post)}/read/${post.id}`)
                            }
                          }}>
                          <img
                            src={thumb}
                            alt={post.title}
                            style={{
                              width: 120,
                              height: 80,
                              objectFit: 'cover',
                              flexShrink: 0
                            }}
                          />

                          <div style={{flex: 1, minWidth: 0}}>
                            <h5 className="mb-1" style={{fontWeight: 600}}>
                              {post.title}
                            </h5>
                            {/* 글 내용 한 줄 요약, ...처리 */}
                            <div
                              className="text-muted"
                              style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontSize: '0.98rem',
                                marginBottom: '5px',
                                maxWidth: '100%'
                              }}>
                              {post.content}
                            </div>
                            <div
                              style={{
                                fontSize: '0.92rem',
                                color: '#888',
                                marginBottom: 2
                              }}>
                              {formatDate(post.regDate)}
                              <span style={{marginLeft: 16}}>
                                좋아요 ❤️: {post.likes}
                              </span>
                              {post.category && (
                                <span style={{marginLeft: 16}}>
                                  카테고리: {post.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
