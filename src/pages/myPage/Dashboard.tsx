import {useState, useEffect} from 'react'
import {DashboardSidebar} from '../../components/features/dashboard/DashboardSidebar'
import {useUserStore} from '../../store/userStore'
import {Link} from 'react-router-dom'
import {formatTimeAgo} from '../../utils/timeAgo'
import {getImageUrl} from '../../utils/getImageUrl'

/* ────────── 남는 타입은 PetSummary 하나뿐 ────────── */
interface PetSummary {
  petId: number
  petName: string
  breed: string
  imagePath?: string | null
}

interface LikedPost {
  postId: number
  title: string
  content: string
  serviceCategory: string
  hourlyRate: number
  defaultLocation: string
  regDate: string
  images?: {
    imageId: number
    imagePath: string
    thumbnailPath?: string
    isMain: boolean
  }[]
  member?: {
    mid: number
    nickname: string
    profileImagePath?: string
    pawRate?: number
  }
}

export default function Dashboard() {
  /* zustand */
  const {user, setUser} = useUserStore()

  /* local state */
  const [pets, setPets] = useState<PetSummary[]>([])
  const [isLoading, setLoading] = useState(true)
  const [likedPosts, setLikedPosts] = useState<LikedPost[]>([])
  const [likedPostsLoading, setLikedPostsLoading] = useState(true)
  const [likedPostsError, setLikedPostsError] = useState<string | null>(null)

  /* 회원‧펫 데이터 로딩 */
  useEffect(() => {
    ;(async () => {
      if (!user) {
        const raw = sessionStorage.getItem('member')
        if (raw) {
          try {
            setUser(JSON.parse(raw))
          } catch (e) {
            console.error('[Dashboard] member 파싱 오류', e)
          }
        }
      }

      /* 펫 요약 불러오기 (필요 시) */
      const token = sessionStorage.getItem('token')
      if (token) {
        try {
          console.log('[Dashboard] 펫 정보 요청 시작')
          const res = await fetch('/api/pet/me', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          if (!res.ok) {
            console.error('[Dashboard] 펫 정보 요청 실패:', res.status, res.statusText)
            return
          }
          const data = await res.json()
          console.log('[Dashboard] 펫 정보 응답:', data)
          setPets(data)
        } catch (e) {
          console.error('[Dashboard] 펫 로딩 실패', e)
        }
      } else {
        console.error('[Dashboard] 토큰이 없습니다')
      }

      setLoading(false)
    })()
  }, [user, setUser])

  /* 좋아요한 게시글 로딩 */
  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const token = sessionStorage.getItem('token')
        if (!token) {
          setLikedPostsError('로그인이 필요합니다.')
          return
        }

        const memberId = sessionStorage.getItem('mid')
        if (!memberId) {
          setLikedPostsError('회원 정보를 찾을 수 없습니다.')
          return
        }

        const response = await fetch(`/api/posts/likes?page=0&size=3`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('좋아요한 게시글을 불러오는데 실패했습니다.')
        }

        const data = await response.json()
        setLikedPosts(data.content)
      } catch (err) {
        setLikedPostsError(
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
        )
      } finally {
        setLikedPostsLoading(false)
      }
    }

    fetchLikedPosts()
  }, [])

  if (isLoading) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{textAlign: 'center', padding: '50px'}}>
          로딩중...
        </div>
      </div>
    )
  }

  /* ======================= JSX ======================= */
  return (
    <div className="page-wrapper">
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">대시보드</h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>대시보드</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <section className="dashboard section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-12">
              <DashboardSidebar />
            </div>

            <div className="col-lg-9 col-md-8 col-12">
              <div className="main-content">
                {/* --- 예약 통계 카드 --- */}
                {/* 그대로 유지, 필요 없으면 삭제 가능 */}

                {/* --- 내 정보 & 펫 정보 --- */}
                <div className="row">
                  {/* 내 정보 */}
                  <div className="col-lg-6 col-md-12 col-12">
                    <div
                      className="dashboard-block"
                      style={{
                        padding: '25px',
                        borderRadius: '15px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        backgroundColor: '#fff',
                        height: '100%'
                      }}>
                      <h3
                        className="block-title"
                        style={{
                          fontSize: '1.5rem',
                          marginBottom: '25px',
                          color: '#333',
                          fontWeight: '600',
                          position: 'relative',
                          paddingBottom: '15px'
                        }}>
                        내 정보
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '50px',
                            height: '3px',
                            backgroundColor: '#32ade6',
                            borderRadius: '2px'
                          }}></span>
                      </h3>
                      {user ? (
                        <ul
                          className="profile-summary"
                          style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0
                          }}>
                          <li
                            style={{
                              marginBottom: '20px',
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                            <div
                              style={{
                                width: '100px',
                                color: '#666',
                                fontSize: '0.95rem',
                                fontWeight: '500'
                              }}>
                              닉네임
                            </div>
                            <div
                              style={{
                                color: '#333',
                                fontSize: '1rem'
                              }}>
                              {user.nickname}
                            </div>
                          </li>
                          <li
                            style={{
                              marginBottom: '20px',
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                            <div
                              style={{
                                width: '100px',
                                color: '#666',
                                fontSize: '0.95rem',
                                fontWeight: '500'
                              }}>
                              이메일
                            </div>
                            <div
                              style={{
                                color: '#333',
                                fontSize: '1rem'
                              }}>
                              {user.email}
                            </div>
                          </li>
                          <li
                            style={{
                              marginBottom: '20px',
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                            <div
                              style={{
                                width: '100px',
                                color: '#666',
                                fontSize: '0.95rem',
                                fontWeight: '500'
                              }}>
                              전화번호
                            </div>
                            <div
                              style={{
                                color: '#333',
                                fontSize: '1rem'
                              }}>
                              {user.phoneNumber ?? '-'}
                            </div>
                          </li>
                          <li
                            style={{
                              marginBottom: '20px',
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                            <div
                              style={{
                                width: '100px',
                                color: '#666',
                                fontSize: '0.95rem',
                                fontWeight: '500'
                              }}>
                              주소
                            </div>
                            <div
                              style={{
                                color: '#333',
                                fontSize: '1rem'
                              }}>
                              {user.address ?? '-'}
                            </div>
                          </li>
                          <li
                            style={{
                              marginBottom: '20px',
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                            <div
                              style={{
                                width: '100px',
                                color: '#666',
                                fontSize: '0.95rem',
                                fontWeight: '500'
                              }}>
                              가입일
                            </div>
                            <div
                              style={{
                                color: '#333',
                                fontSize: '1rem'
                              }}>
                              {user.regDate
                                ? new Date(user.regDate).toLocaleDateString()
                                : '-'}
                            </div>
                          </li>
                        </ul>
                      ) : (
                        <p>프로필 정보를 불러오는 중…</p>
                      )}
                    </div>
                  </div>

                  {/* 펫 정보 */}
                  <div className="col-lg-6 col-md-12 col-12">
                    <div
                      className="dashboard-block"
                      style={{
                        padding: '25px',
                        borderRadius: '15px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        backgroundColor: '#fff',
                        height: '100%'
                      }}>
                      <h3
                        className="block-title"
                        style={{
                          fontSize: '1.5rem',
                          marginBottom: '25px',
                          color: '#333',
                          fontWeight: '600',
                          position: 'relative',
                          paddingBottom: '15px'
                        }}>
                        펫 정보
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '50px',
                            height: '3px',
                            backgroundColor: '#32ade6',
                            borderRadius: '2px'
                          }}></span>
                      </h3>
                      {pets.length ? (
                        <ul
                          className="pet-summary"
                          style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                          }}>
                          {pets.map(p => (
                            <li
                              key={p.petId}
                              className="pet-item"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '15px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '12px',
                                transition: 'transform 0.2s ease',
                                cursor: 'pointer'
                              }}>
                              <img
                                src={
                                  p.imagePath
                                    ? `/api/pets/image/${p.petId}/${p.imagePath
                                        .split('/')
                                        .pop()}`
                                    : '/assets/images/pet/default-thumb.jpg'
                                }
                                alt={p.petName}
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: '3px solid #fff',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                              />
                              <div
                                className="pet-text"
                                style={{
                                  flex: 1,
                                  marginLeft: '15px'
                                }}>
                                <strong
                                  style={{
                                    display: 'block',
                                    fontSize: '1.1rem',
                                    color: '#333',
                                    marginBottom: '5px',
                                    fontWeight: '600'
                                  }}>
                                  {p.petName}
                                </strong>
                                <span
                                  style={{
                                    color: '#666',
                                    fontSize: '0.95rem'
                                  }}>
                                  {p.breed}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>등록된 반려동물이 없습니다.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* --- 좋아요한 게시글 --- */}
                <div className="row mt-4">
                  <div className="col-12">
                    <div
                      className="dashboard-block"
                      style={{
                        padding: '25px',
                        borderRadius: '15px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        backgroundColor: '#fff'
                      }}>
                      <h3
                        className="block-title"
                        style={{
                          fontSize: '1.5rem',
                          marginBottom: '25px',
                          color: '#333',
                          fontWeight: '600',
                          position: 'relative',
                          paddingBottom: '15px'
                        }}>
                        좋아요한 게시글
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '50px',
                            height: '3px',
                            backgroundColor: '#32ade6',
                            borderRadius: '2px'
                          }}></span>
                      </h3>

                      {likedPostsLoading ? (
                        <div className="text-center py-4">로딩중...</div>
                      ) : likedPostsError ? (
                        <div className="text-center py-4 text-danger">
                          {likedPostsError}
                        </div>
                      ) : likedPosts.length === 0 ? (
                        <div className="text-center py-4">
                          좋아요한 게시글이 없습니다.
                        </div>
                      ) : (
                        <div className="service-items">
                          {likedPosts.map(post => (
                            <div
                              key={post.postId}
                              className="service-item"
                              style={{
                                padding: '15px',
                                borderBottom: '1px solid #f0f0f0',
                                transition: 'background-color 0.2s ease'
                              }}>
                              <div className="row align-items-center">
                                <div className="col-lg-4 col-md-4 col-12">
                                  <div
                                    className="service-title"
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '15px'
                                    }}>
                                    <img
                                      src={
                                        post.images?.[0]?.thumbnailPath
                                          ? getImageUrl(post.images[0].thumbnailPath)
                                          : '/assets/images/pet/default-thumb.jpg'
                                      }
                                      alt={post.title}
                                      style={{
                                        width: '80px',
                                        height: '80px',
                                        objectFit: 'cover',
                                        borderRadius: '8px'
                                      }}
                                    />
                                    <div className="title-info">
                                      <h3
                                        style={{
                                          fontSize: '1.1rem',
                                          marginBottom: '5px',
                                          color: '#333'
                                        }}>
                                        <Link
                                          to={`/posts/${post.serviceCategory.toLowerCase()}/read/${
                                            post.postId
                                          }`}>
                                          {post.title}
                                        </Link>
                                      </h3>
                                      <p
                                        className="price"
                                        style={{
                                          color: '#666',
                                          fontSize: '0.9rem'
                                        }}>
                                        {post.hourlyRate.toLocaleString()}원 / 시간
                                      </p>
                                      <p
                                        style={{
                                          color: '#999',
                                          fontSize: '0.8rem',
                                          margin: 0
                                        }}>
                                        {formatTimeAgo(post.regDate)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-2 col-md-2 col-12">
                                  <div className="service-category">
                                    <span
                                      style={{
                                        padding: '5px 10px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '5px',
                                        fontSize: '0.9rem',
                                        color: '#666'
                                      }}>
                                      {post.serviceCategory}
                                    </span>
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-12">
                                  <div className="service-status">
                                    <span
                                      className="status-text"
                                      style={{
                                        color: '#666',
                                        fontSize: '0.9rem'
                                      }}>
                                      {post.defaultLocation}
                                    </span>
                                  </div>
                                </div>
                                <div className="col-lg-2 col-md-2 col-12">
                                  <div
                                    className="service-actions"
                                    style={{
                                      display: 'flex',
                                      gap: '10px',
                                      justifyContent: 'center'
                                    }}>
                                    <Link
                                      to={`/posts/${post.serviceCategory.toLowerCase()}/read/${
                                        post.postId
                                      }`}
                                      className="action-btn view"
                                      style={{
                                        padding: '8px',
                                        borderRadius: '5px',
                                        backgroundColor: '#32ade6',
                                        color: '#fff'
                                      }}>
                                      <i className="lni lni-eye"></i>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
