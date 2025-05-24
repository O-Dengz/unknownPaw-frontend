import React, {useEffect, useState} from 'react'
import {useParams, useNavigate, useLocation, Link} from 'react-router-dom'
import './Post.css'
import ScrollToTopButton from '../../components/ScrollToTopButton'
import KakaoMap from './components/KakaoMap'
import ChatBox from '../../components/ChatBox'
import {getImageUrl} from '@/utils/getImageUrl'

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
  const location = useLocation()
  const {postId, postType} = useParams()
  const [postDTO, setPostDTO] = useState<PostDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)
  const myMemberId = Number(sessionStorage.getItem('mid'))

  console.log('postType:', postType, 'postId:', postId, postDTO)
  // 뒤로 가기 핸들러
  const handleBack = () => navigate(-1)

  useEffect(() => {
    const fetchPost = () => {
      setLoading(true)
      setError(null)

      const latestToken = sessionStorage.getItem('token')

      if (!latestToken) {
        console.error('No token found in sessionStorage. User is not logged in.')
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
            console.error(`HTTP error! Status: ${response.status}`, errorBody)
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const contentType = response.headers.get('Content-Type')
          if (contentType && contentType.includes('application/json')) {
            return response.json()
          } else {
            const text = await response.text()
            console.error('Expected JSON but received:', text)
            throw new Error('Expected JSON response but received non-JSON.')
          }
        })
        .then(data => {
          setPostDTO(data)
          // latitude, longitude 처리 부분이 필요하면 여기 추가 가능
        })
        .catch(err => {
          console.error('Error fetching post:', err)
          if (err.message.includes('non-JSON') || err.message.includes('HTTP error')) {
            setError('게시글을 불러오는데 실패했습니다.(네트워크 또는 서버 오류)')
          } else {
            setError('게시글을 불러오는데 실패했습니다.')
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }

    if (postId && postType) {
      fetchPost()
    }
  }, [postId, postType])

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>{error}</div>
  if (!postDTO) return <div>게시글을 찾을 수 없습니다.</div>

  return (
    <>
      <ScrollToTopButton />
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">{postDTO.title}</h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <a
                    href="/"
                    onClick={e => {
                      e.preventDefault()
                      handleBack()
                    }}>
                    홈
                  </a>
                </li>
                <li>{postDTO.serviceCategory}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="item-details">
        <div className="container">
          <div className="item-main-row">
            <div className="item-left-area">
              <div className="main-image-selection">
                <div className="main-image">
                  <img
                    src={
                      postDTO.images && postDTO.images[0]
                        ? getImageUrl(
                            postDTO.images[0].thumbnailPath ?? postDTO.images[0].imagePath
                          )
                        : '/assets/images/pet/dog-2.jpg'
                    }
                    alt={postDTO.title}
                  />
                </div>
              </div>

              <Link to={`/profile/simple/${postDTO.member?.mid}`}>
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
                <button className="reserve-button">예약하기</button>
                <button className="likes" onClick={() => setLiked(!liked)}>
                  <i className={`lni ${liked ? 'lni-heart-filled' : 'lni-heart'}`}></i>
                </button>
              </div>
            </div>
          </div>
          <div className="map-area">
            {postDTO.latitude != null && postDTO.longitude != null ? (
              <KakaoMap
                latitude={postDTO.latitude}
                longitude={postDTO.longitude}
                address={postDTO.defaultLocation}
              />
            ) : (
              <KakaoMap
                latitude={null}
                longitude={null}
                address={postDTO.defaultLocation}
              />
            )}
          </div>
          <button className="report-button">🚨 신고하기</button>
        </div>
      </div>
      <div className="chat-box-wrapper">
        {/* 채팅 UI */}
        <ChatBox />
      </div>
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
          style={{
            background: '#eee',
            color: '#333',
            border: 'none',
            padding: '8px 18px',
            borderRadius: '8px',
            fontWeight: 500,
            cursor: 'pointer'
          }}>
          목록으로 돌아가기
        </button>
        {myMemberId === postDTO.member?.mid && (
          <button
            onClick={() => navigate(`/posts/${postType}/edit/${postId}`)}
            style={{
              background: '#f4c150',
              color: '#222',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '8px',
              fontWeight: 500,
              cursor: 'pointer'
            }}>
            ✏️ 수정
          </button>
        )}
      </div>
    </>
  )
}
