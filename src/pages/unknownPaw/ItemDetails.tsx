import React, {useEffect, useState} from 'react'
import {useParams, useNavigate, Link} from 'react-router-dom'
import './Post.css'
import ScrollToTopButton from '../../components/ScrollToTopButton'
import KakaoMap from './components/KakaoMap'
import ChatBox from '../../components/ChatBox'
import {getImageUrl} from '@/utils/getImageUrl'
import {ReservationModal, ReservationEditModal} from '@/components/ReservationModals'

interface MemberResponseDTO {
  mid: number
  email: string
  nickname: string
  pawRate: number
  role: string
  profileImagePath?: string
}

interface ImageDTO {
  imageId: number
  path: string
  imagePath: string
  thumbnailPath?: string
  isMain: boolean
}

interface PostDTO {
  postId: number
  title: string
  content: string
  serviceCategory: string
  hourlyRate: number
  likes: number
  chatCount: number
  defaultLocation: string
  flexibleLocation: string
  latitude: number | null
  longitude: number | null
  regDate: string
  postTypeUrlSegment?: string
  images?: ImageDTO[]
  member?: MemberResponseDTO
}

export function ItemDetails() {
  const navigate = useNavigate()
  const {postId, postType} = useParams()
  const [postDTO, setPostDTO] = useState<PostDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const myMemberId = Number(sessionStorage.getItem('mid'))
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const memberString = sessionStorage.getItem('member')
  const member = memberString ? JSON.parse(memberString) : null
  const memberId = member?.mid
  const petId = 1

  useEffect(() => {
    const fetchPost = () => {
      setLoading(true)
      setError(null)
      const latestToken = sessionStorage.getItem('token')
      if (!latestToken) {
        setError('로그인이 필요합니다.')
        setLoading(false)
        return
      }
      fetch(`/api/posts/${postType}/read/${postId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${latestToken}`,
          'Content-Type': 'application/json'
        }
      })
        .then(async response => {
          if (!response.ok) {
            const errorBody = await response.text()
            throw new Error(`HTTP error! status: ${response.status} ${errorBody}`)
          }
          const contentType = response.headers.get('Content-Type')
          if (contentType && contentType.includes('application/json')) {
            return response.json()
          } else {
            const text = await response.text()
            throw new Error('Expected JSON response but received non-JSON.')
          }
        })
        .then(data => {
          setPostDTO(data)
        })
        .catch(() => setError('게시글을 불러오는데 실패했습니다.'))
        .finally(() => setLoading(false))
    }
    if (postId && postType) fetchPost()
  }, [postId, postType])

  // 찜 상태 확인을 위한 별도의 useEffect
  useEffect(() => {
    if (postId && !loading) {
      checkIfFavorited()
    }
  }, [postId, loading])

  const checkIfFavorited = async () => {
    const token = sessionStorage.getItem('token')
    if (!token || !postId) return

    try {
      const response = await fetch(
        `/api/posts/${postType?.toLowerCase()}/${postId}/favourite/check`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      if (response.ok) {
        const data = await response.json()
        setIsFavorited(data)
      }
    } catch (error) {
      console.error('찜 여부 확인 실패:', error)
    }
  }

  const handleFavorite = async () => {
    const token = sessionStorage.getItem('token')
    if (!token || !postId) {
      alert('로그인이 필요합니다.')
      return
    }

    try {
      const method = isFavorited ? 'DELETE' : 'POST'
      const response = await fetch(
        `/api/posts/${postType?.toLowerCase()}/${postId}/favourite`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        setIsFavorited(!isFavorited)
        // 게시글 정보 업데이트
        if (postDTO) {
          setPostDTO({
            ...postDTO,
            likes: isFavorited ? postDTO.likes - 1 : postDTO.likes + 1
          })
        }
      } else {
        throw new Error('찜하기 처리에 실패했습니다.')
      }
    } catch (error) {
      console.error('찜하기 처리 실패:', error)
      alert('찜하기 처리 중 오류가 발생했습니다.')
    }
  }

  // 🟡 항상 동일한 레이아웃, 본문만 내용 교체!
  return (
    <>
      <ScrollToTopButton />
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">
                  {postDTO?.title || (loading ? '불러오는 중...' : '게시글')}
                </h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <a
                    href="/"
                    onClick={e => {
                      e.preventDefault()
                      navigate(-1)
                    }}>
                    홈
                  </a>
                </li>
                <li>{postDTO?.serviceCategory || ''}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* === 깜빡임 없는 item-details 컨테이너 === */}
      <div className="item-details page-content">
        <div className="container">
          <div
            className="item-main-row"
            style={{
              minHeight: 480,
              display: 'flex',
              alignItems: 'flex-start'
            }}>
            {/* 본문 분기 */}
            {loading ? (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <div
                  style={{
                    width: '100%',
                    height: 350,
                    background: '#f3f3f3',
                    borderRadius: 18,
                    animation: 'pulse 1.1s infinite alternate'
                  }}
                />
              </div>
            ) : error ? (
              <div className="col-12 text-center p-5" style={{flex: 1}}>
                <h4 className="text-red-600 mb-3">{error}</h4>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate(-1)}
                  style={{marginTop: 16}}>
                  ← 목록으로 돌아가기
                </button>
              </div>
            ) : !postDTO ? (
              <div className="col-12 text-center p-5" style={{flex: 1}}>
                <h5>게시글을 찾을 수 없습니다.</h5>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate(-1)}
                  style={{marginTop: 16}}>
                  ← 목록으로 돌아가기
                </button>
              </div>
            ) : (
              <>
                {/* 🟢 정상 게시글 상세 */}
                <div className="item-left-area">
                  <div className="main-image-selection">
                    <div className="main-image">
                      <img
                        src={
                          postDTO.images && postDTO.images[0]
                            ? getImageUrl(postDTO.images[0].path)
                            : '/assets/images/pet/dog-2.jpg'
                        }
                        alt={postDTO.title}
                        onLoad={e => {
                          const img = e.target as HTMLImageElement
                          const aspectRatio = img.naturalWidth / img.naturalHeight
                          img.style.aspectRatio = aspectRatio > 1 ? 'auto' : '3/4'
                        }}
                      />
                    </div>
                  </div>
                  <Link
                    to={`/member/profile/simple/${postDTO.member?.mid}`}
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      color: 'inherit',
                      width: '100%'
                    }}>
                    <div className="author-info-area">
                      {postDTO.member && (
                        <div className="profile-meta-wrap">
                          <div className="post-author11-image2">
                            <img
                              src={
                                postDTO.member?.profileImagePath
                                  ? getImageUrl(postDTO.member.profileImagePath)
                                  : '/assets/images/items-grid/author-2.jpg'
                              }
                              alt={postDTO.member?.nickname}
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />
                          </div>
                          <div className="author-meta">
                            <div className="author-name">
                              {postDTO.member.nickname || 'nickname'}
                            </div>
                            <div className="author-location">
                              {postDTO.defaultLocation || '부산시'}
                            </div>
                          </div>
                          <div className="author-rating">
                            <span>🐾 {postDTO.member.pawRate.toFixed(1) || '1.4'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
                <div className="item-right-area">
                  <h2 className="item-title">{postDTO.title}</h2>
                  <div className="item-price">
                    {postDTO.hourlyRate.toLocaleString()}원/시간
                  </div>
                  <div
                    className="post-service-category"
                    style={{display: 'flex', alignItems: 'center'}}>
                    <p style={{marginRight: '6px'}}>{postDTO.serviceCategory}</p>
                    <span style={{color: '#888'}}>
                      · {new Date(postDTO.regDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="item-notice">
                    {postDTO.content.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="post-summary">
                    <span>조회수 {postDTO.chatCount}</span>
                    <p>· </p>
                    <span>채팅 {postDTO.chatCount}</span>
                    <p>· </p>
                    <span>좋아요 {postDTO.likes}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      marginTop: '12px',
                      alignItems: 'center'
                    }}>
                    <button className="reserve-button" onClick={() => setShowModal(true)}>
                      예약하기
                    </button>
                    <button
                      className="reserve-button"
                      onClick={() => setIsChatOpen(true)}
                      style={{backgroundColor: '#6c5ce7'}}>
                      채팅 열기
                    </button>
                    <button className="likes" onClick={handleFavorite}>
                      <i
                        className={`lni ${
                          isFavorited ? 'lni-heart-filled' : 'lni-heart'
                        }`}
                        style={{color: isFavorited ? '#e74c3c' : 'inherit'}}></i>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* 지도/푸터는 항상 자리 보존 */}
          <div className="map-area" style={{minHeight: 180, marginTop: 32}}>
            {postDTO ? (
              <KakaoMap
                latitude={postDTO.latitude}
                longitude={postDTO.longitude}
                address={postDTO.defaultLocation}
              />
            ) : null}
          </div>
          <button className="report-button">🚨 신고하기</button>
        </div>
      </div>

      {postDTO && (
        <ReservationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          memberId={memberId}
          petId={petId}
          postId={postDTO.postId}
          postType={postType?.toUpperCase() === 'PETOWNER' ? 'PET_OWNER' : 'PET_SITTER'}
        />
      )}
      {isChatOpen && <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}
      <div
        className="bottom-buttons"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          margin: '40px 0 24px 0'
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
        {myMemberId === postDTO?.member?.mid && (
          <button
            onClick={() => navigate(`/posts/${postType}/edit/${postId}`)}
            className="reserve-button"
            style={{
              background: '#f4c150',
              color: '#fff'
            }}>
            수정하기
          </button>
        )}
      </div>
    </>
  )
}
