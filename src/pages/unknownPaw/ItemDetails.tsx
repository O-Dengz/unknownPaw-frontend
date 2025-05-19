import React, {useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom'
import './Post.css'
import KakaoMap from './components/KakaoMap'

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
  latitude: number | null
  longitude: number | null
  regDate: string
  image: {
    imageId: number
    imagePath: string
    isMain: boolean
  }[]
  member?: MemberResponseDTO
}

export function ItemDetails() {
  const {postId, postType} = useParams()
  const [postDTO, setPostDTO] = useState<PostDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const fetchPost = () => {
      setLoading(true)
      setError(null)
      const token = sessionStorage.getItem('token')

      const formattedPostType = postType === 'petowner' ? 'petOwner' : 
                              postType === 'petsitter' ? 'petSitter' : postType;

      if (!token) {
        setError('로그인이 필요합니다.')
        setLoading(false)
        return
      }

      fetch(`/api/posts/${formattedPostType}/read/${postId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(async response => {
          if (!response.ok) {
            const errorBody = await response.text()
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.json()
        })
        .then(async data => {
          if (!data.latitude || !data.longitude) {
            try {
              const response = await fetch(`/api/maps/coordinates?address=${encodeURIComponent(data.defaultLocation)}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              });

              if (!response.ok) {
                const errorText = await response.text();
                data.latitude = 35.1795543;
                data.longitude = 129.0756416;
                return;
              }

              const coordinates = await response.json();
              data.latitude = coordinates.latitude;
              data.longitude = coordinates.longitude;
            } catch (error) {
              data.latitude = 35.1795543;
              data.longitude = 129.0756416;
            }
          }
          setPostDTO(data)
        })
        .catch(err => {
          console.error('Error fetching post:', err)
          setError('게시글을 불러오는데 실패했습니다.')
        })
        .finally(() => {
          setLoading(false)
        })
    }

    if (postId && postType) {
      fetchPost()
    }
  }, [postId, postType])

  useEffect(() => {
    if (postDTO) {
    }
  }, [postDTO]);

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>{error}</div>
  if (!postDTO) return <div>게시글을 찾을 수 없습니다.</div>

  return (
    <>
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
                  <Link to="/">
                    <img src="/assets/images/logo/logo.png" alt="UnknownPaw" style={{ height: '30px' }} />
                  </Link>
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
            <div className="item-left-area" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              {postDTO.image && postDTO.image.length > 0 && (
                <img
                  src={postDTO.image[0].imagePath}
                  alt="대표 이미지"
                  className="main-image"
                />
              )}
              <div className="main-image-selection">
                <div className="main-image">
                  <img src="/assets/images/items-grid/img2.jpg" alt="상품" />
                </div>
              </div>
              <div className="author-info-area">
                {postDTO.member && (
                  <>
                    <div className="profile-meta-wrap">
                      <div className="post-author-image">
                        <img
                          src={postDTO.member.profileImagePath || '/assets/images/items-grid/author-2.jpg'}
                          alt="프로필"
                          style={{ width: 56, height: 56, borderRadius: '50%' }}
                        />
                      </div>
                      <div className="author-meta">
                        <div className="author-name">{postDTO.member.nickname}</div>
                        <div className="author-location">{postDTO.defaultLocation}</div>
                      </div>
                    </div>
                    <div className="author-rating">
                      <span>🐾 {postDTO.member.pawRate.toFixed(1)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="item-right-area">
              <h2 className="item-title">{postDTO.title}</h2>
              <div className="item-price">
                {postDTO.hourlyRate.toLocaleString()}원/시간
              </div>
              <div className="post-service-category" style={{display: 'flex', alignItems: 'center'}}>
                <p style={{marginRight: '6px'}}>{postDTO.serviceCategory}</p>
                <span style={{color: '#888'}}>· {new Date(postDTO.regDate).toLocaleDateString()}</span>
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
                <p>·</p>
                <span>채팅 {postDTO.chatCount}</span>
                <p>·</p>
                <span>좋아요 {postDTO.likes}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px', alignItems: 'center' }}>
                <button className="reserve-button">예약하기</button>
                <button className="reserve-button" onClick={() => setLiked(!liked)}>
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
    </>
  )
}
