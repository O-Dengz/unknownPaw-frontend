import {Link} from 'react-router-dom'
import {DashboardSidebar} from '../../components/features/dashboard/DashboardSidebar'
import './myPage.css'
import Header from '../../components/Layout/Header'
import {useState, useEffect} from 'react'
import {formatTimeAgo} from '../../utils/timeAgo'
import {getImageUrl} from '@/utils/getImageUrl'

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

export default function MyLikes() {
  const [likedPosts, setLikedPosts] = useState<LikedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchLikedPosts()
  }, [currentPage])

  const fetchLikedPosts = async () => {
    try {
      const token = sessionStorage.getItem('token')
      if (!token) {
        setError('로그인이 필요합니다.')
        return
      }

      const memberId = sessionStorage.getItem('mid')
      if (!memberId) {
        setError('회원 정보를 찾을 수 없습니다.')
        return
      }

      const response = await fetch(`/api/posts/likes?page=${currentPage - 1}&size=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('좋아요한 게시글이 없습니다.')
      }

      const data = await response.json()
      setLikedPosts(data.content)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveLike = async (postId: number, postType: string) => {
    try {
      const token = sessionStorage.getItem('token')
      if (!token) return

      const memberId = sessionStorage.getItem('mid')
      if (!memberId) return

      const response = await fetch(`/api/${postId}/like?memberId=${memberId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('좋아요 취소에 실패했습니다.')
      }

      // 목록에서 제거
      setLikedPosts(prev => prev.filter(post => post.postId !== postId))
    } catch (err) {
      console.error('좋아요 취소 실패:', err)
    }
  }

  return (
    <div className="page-wrapper">
      <Header />
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">좋아요한 게시글</h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <Link to="/">홈</Link>
                </li>
                <li>좋아요한 게시글</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <section className="dashboard section" style={{marginTop: '0'}}>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-12 col-12">
              <DashboardSidebar />
            </div>
            <div className="col-lg-9 col-md-12 col-12">
              <div
                className="main-content"
                style={{
                  paddingTop: '0',
                  marginTop: '0'
                }}>
                <div
                  className="dashboard-block"
                  style={{
                    padding: '25px',
                    borderRadius: '15px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    backgroundColor: '#fff'
                  }}>
                  <div className="service-list" style={{paddingTop: '0'}}>
                    <div
                      className="service-header"
                      style={{
                        marginBottom: '20px',
                        borderBottom: '2px solid #f0f0f0',
                        paddingBottom: '15px'
                      }}>
                      <h3
                        className="block-title"
                        style={{
                          fontSize: '1.5rem',
                          color: '#333',
                          fontWeight: '600',
                          margin: 0
                        }}>
                        좋아요한 게시글
                      </h3>
                    </div>

                    {loading ? (
                      <div className="text-center py-4">로딩중...</div>
                    ) : error ? (
                      <div className="text-center py-4 text-danger">{error}</div>
                    ) : likedPosts.length === 0 ? (
                      <div className="text-center py-4">좋아요한 게시글이 없습니다.</div>
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
                                  <div>
                                    <h4
                                      style={{
                                        margin: 0,
                                        fontSize: '1.1rem',
                                        fontWeight: '600'
                                      }}>
                                      {post.title}
                                    </h4>
                                    <p
                                      style={{
                                        margin: '5px 0 0',
                                        color: '#666',
                                        fontSize: '0.9rem'
                                      }}>
                                      {post.serviceCategory}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-12">
                                <div
                                  style={{
                                    color: '#666',
                                    fontSize: '0.9rem'
                                  }}>
                                  <p style={{margin: '5px 0'}}>
                                    시급: {post.hourlyRate.toLocaleString()}원
                                  </p>
                                  <p style={{margin: '5px 0'}}>
                                    위치: {post.defaultLocation}
                                  </p>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-3 col-12">
                                <div
                                  style={{
                                    color: '#666',
                                    fontSize: '0.9rem'
                                  }}>
                                  <p style={{margin: '5px 0'}}>
                                    작성일: {formatTimeAgo(post.regDate)}
                                  </p>
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
                                      backgroundColor: '#4CAF50',
                                      color: '#fff'
                                    }}>
                                    <i className="lni lni-eye"></i>
                                  </Link>
                                  <button
                                    onClick={() =>
                                      handleRemoveLike(
                                        post.postId,
                                        post.serviceCategory.toLowerCase()
                                      )
                                    }
                                    className="action-btn delete"
                                    style={{
                                      padding: '8px',
                                      borderRadius: '5px',
                                      backgroundColor: '#dc3545',
                                      color: '#fff',
                                      border: 'none',
                                      cursor: 'pointer'
                                    }}>
                                    <i className="lni lni-trash"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {totalPages > 1 && (
                      <div
                        className="pagination"
                        style={{
                          marginTop: '30px',
                          display: 'flex',
                          justifyContent: 'center'
                        }}>
                        <ul
                          className="pagination-list"
                          style={{
                            display: 'flex',
                            gap: '10px',
                            listStyle: 'none',
                            padding: 0,
                            margin: 0
                          }}>
                          {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                            <li key={page}>
                              <button
                                onClick={() => setCurrentPage(page)}
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: '5px',
                                  backgroundColor:
                                    currentPage === page ? '#4CAF50' : '#f8f9fa',
                                  color: currentPage === page ? '#fff' : '#333',
                                  border: 'none',
                                  cursor: 'pointer'
                                }}>
                                {page}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
