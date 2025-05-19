import React, {useEffect, useState} from 'react'
import {useParams, useNavigate, useLocation, Link} from 'react-router-dom'
import axios from 'axios'
import './Post.css'
import ScrollToTopButton from '../../components/ScrollToTopButton'

interface MemberResponseDTO {
  mid: number
  email: string
  nickname: string
  pawRate: number
  role: string
  profileImagePath?: string
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
  regDate: string
  postTypeUrlSegment?: string
  image: {
    imageId: number
    imagePath: string
    isMain: boolean
  }[]
  member?: MemberResponseDTO
}

interface PageRequestDTO {
  page: string
  size: string
  type: string
  keyword: string
}

export function ItemDetails() {
  const navigate = useNavigate()
  const location = useLocation()
  const {postId, postType} = useParams()
  const [postDTO, setPostDTO] = useState<PostDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)

  // 뒤로 가기 핸들러
  const handleBack = () => {
    // 이전 페이지의 URL로 이동 (페이지 정보가 포함된)
    navigate(-1)
  }

  useEffect(() => {
    const fetchPost = () => {
      setLoading(true)
      setError(null)

      const latestToken = sessionStorage.getItem('token')

      if (!latestToken) {
        console.error('No token found in sessionStorage. User is not logged in.')
        setError('로그인이 필요합니다.') // 사용자에게 보여줄 메시지
        setLoading(false)
        return // fetch 호출을 건너뛰고 함수 종료
      }

      // 직접 전체 url로 vite proxy를 사용 안함
      fetch(`/api/posts/${postType}/read/${postId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${latestToken}`,
          'Content-Type': 'application/json'
        }
      })
        .then(async response => {
          if (!response.ok) {
            console.error(
              `HTTP error! Status: ${response.status}, StatusText: ${response.statusText}`
            )
            // 에러 확인용 메시지
            const errorBody = await response.text()
            console.error('Error response body:', errorBody)

            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const contentType = response.headers.get('Content-Type')
          if (contentType && contentType.includes('application/json')) {
            return response.json()
          } else {
            const text = await response.text() // 받은 내용 텍스트로 읽음
            console.error('Expectd JSON but recevied', text)
            throw new Error('Expected JSON response but received non-JSON.')
          }
        })
        .then(data => {
          setPostDTO(data)
        })
        .catch(err => {
          // fetch 또는 응답 처리 중 에러 발생
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
                      postDTO.image?.[0]?.imagePath || '/assets/images/pet/dog-2.jpg' // public 기준 절대 경로 권장
                    }
                    alt="상품 이미지"
                    className="main-image"
                  />
                </div>
              </div>

              <Link to={`/profile/simple/${postDTO.member?.mid}`}>
                <div className="author-info-area">
                  {postDTO.member && (
                    <>
                      <div className="profile-meta-wrap">
                        <div className="post-author11-image2">
                          <img
                            className="post-author-image"
                            src={
                              postDTO.member.profileImagePath
                                ? postDTO.member.profileImagePath
                                : '/assets/images/items-grid/author-2.jpg'
                            }
                            alt="프로필"
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
                    </>
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
                  {' '}
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
            <iframe
              id="gmap_canvas"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                postDTO.defaultLocation
              )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              height={300}
              width={1300}
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
            />
          </div>
          <button className="report-button">🚨 신고하기</button>
        </div>
      </div>
    </>
  )
}
