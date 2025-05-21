import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'

import BackgroundVideo from '../../components/MainLayout/BackgroundVideo'
import MainHeader from '../../components/MainLayout/MainHeader'

// CSS & 스타일 파일들
import '../../../public/assets/css/LineIcons.2.0.css'
import '../../../public/assets/css/animate.css'
import '../../../public/assets/css/bootstrap.min.css'
import '../../../public/assets/css/glightbox.min.css'
import '../../../public/assets/css/main.css'
import '../../../public/assets/css/tiny-slider.css'
import './List.css'

// 게시글 이미지 타입
interface ImageDTO {
  imageId: number
  imageUrl: string
}

// 펫오너/펫시터 게시글 타입
interface Post {
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
  modDate: string
  email: string
  image: ImageDTO[]
  isPetSitterPost: boolean // 시터 게시글 여부
}

export function List() {
  const navigate = useNavigate()

  // 상태: 게시글 목록, 로딩, 에러
  const [ownerPosts, setOwnerPosts] = useState<Post[]>([])
  const [sitterPosts, setSitterPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 게시글 요청 (마운트 시 실행)
  useEffect(() => {
    let isMounted = true

    const fetchPosts = async () => {
      setIsLoading(true)

      const token = sessionStorage.getItem('token')
      if (!token) {
        setError('로그인이 필요합니다.')
        navigate('/login', {replace: true})
        return
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }

      // 캐시된 데이터가 있으면 재사용 (5분 이내)
      const cachedData = sessionStorage.getItem('cachedPosts')
      if (cachedData) {
        const {ownerPosts, sitterPosts, timestamp} = JSON.parse(cachedData)
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          if (isMounted) {
            setOwnerPosts(ownerPosts)
            setSitterPosts(sitterPosts)
            setIsLoading(false)
            return
          }
        }
      }

      try {
        // 펫오너/펫시터 게시글 각각 6개씩 랜덤 조회
        const [ownerRes, sitterRes] = await Promise.all([
          fetch('/api/posts/petowner/recent/random6', {headers}),
          fetch('/api/posts/petsitter/recent/random6', {headers})
        ])

        // 응답 에러 처리
        const handleErrors = (res: Response, type: string) => {
          if (res.status === 403) {
            sessionStorage.clear()
            navigate('/login', {replace: true})
            throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.')
          }
          if (!res.ok) {
            throw new Error(`${type} 게시글 목록 조회 실패: ${res.status}`)
          }
        }

        handleErrors(ownerRes, '펫오너')
        handleErrors(sitterRes, '펫시터')

        const owners: Post[] = await ownerRes.json()
        const sitters: Post[] = await sitterRes.json()

        // 게시글에 타입 플래그 추가
        const processedOwnerPosts = owners.map(post => ({
          ...post,
          isPetSitterPost: false
        }))
        const processedSitterPosts = sitters.map(post => ({
          ...post,
          isPetSitterPost: true
        }))

        // 상태 저장 + 세션 스토리지 캐시
        if (isMounted) {
          setOwnerPosts(processedOwnerPosts)
          setSitterPosts(processedSitterPosts)
          sessionStorage.setItem(
            'cachedPosts',
            JSON.stringify({
              ownerPosts: processedOwnerPosts,
              sitterPosts: processedSitterPosts,
              timestamp: Date.now()
            })
          )
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || '게시글을 불러오는데 실패했습니다.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchPosts()
    return () => {
      isMounted = false
    }
  }, [navigate])

  // 게시글 카드 렌더링 함수
  const renderPostCards = (posts: Post[]) =>
    posts.map(post => {
      const thumbnailUrl = post.image?.[0]?.imageUrl || '/assets/images/items-grid/2.jpg'

      return (
        <div className="col-lg-4 col-md-6 col-12" key={post.postId}>
          <Link
            to={`/posts/${post.isPetSitterPost ? 'petsitter' : 'petowner'}/read/${
              post.postId
            }`}
            className="single-grid wow fadeInUp random-post-card"
            data-wow-delay=".2s">
            <div className="image">
              <div className="thumbnail">
                <img
                  src={thumbnailUrl}
                  alt="썸네일"
                  style={{width: '100%', height: '200px', objectFit: 'cover'}}
                />
              </div>
              <div className="author">
                <div className="author-image">
                  <img
                    src={thumbnailUrl}
                    alt="작성자"
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                  />
                  <span>{post.email}</span>
                </div>
                <p className="sale">{post.isPetSitterPost ? '펫시터' : '펫오너'}</p>
              </div>
            </div>

            <div className="content">
              <div className="top-content">
                <span className="tag">{post.serviceCategory}</span>
                <h3 className="title">{post.title}</h3>
                <p className="update-time">
                  업데이트: {new Date(post.modDate).toLocaleDateString()}
                </p>
                <p className="location">위치: {post.defaultLocation}</p>
                <p className="rate">희망 시급: {post.hourlyRate.toLocaleString()}원</p>
              </div>
              <div className="bottom-content">
                <span className="like">
                  <i className="lni lni-heart" /> {post.likes}
                </span>
                <span className="chat">
                  <i className="lni lni-comments" /> {post.chatCount}
                </span>
              </div>
            </div>
          </Link>
        </div>
      )
    })

  // 상단 이동 버튼
  const handleScrollTop = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // 에러 시 UI
  if (error) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    )
  }

  return (
    <>
      {/* 스크롤 탑 버튼 */}
      <span onClick={handleScrollTop} className="scroll-top btn-hover">
        <i className="lni lni-chevron-up" />
      </span>

      {/* 배경 비디오 + 헤더 영역 */}
      <section
        className="hero-area overlay"
        style={{height: '60vh', position: 'relative', overflow: 'hidden'}}>
        <MainHeader />
        <BackgroundVideo />
      </section>

      {/* 게시판 바로가기 섹션 */}
      <section className="categories-section">
        <div className="container">
          <div className="row">
            {[
              {
                to: '/petowner/list',
                img: '/assets/images/items-grid/1.jpg',
                title: '펫오너 게시판',
                desc: '반려동물을 돌봐줄 사람을 찾고 있다면 여기로!'
              },
              {
                to: '/petsitter/list',
                img: '/assets/images/items-grid/3.jpg',
                title: '펫시터 게시판',
                desc: '펫시터로 활동하고 싶다면 이곳을 확인해보세요!'
              },
              {
                to: '/community/posts',
                img: '/assets/images/items-grid/4.jpg',
                title: '커뮤니티 게시판',
                desc: '자유롭게 소통할 수 있는 반려동물 커뮤니티'
              }
            ].map((item, idx) => (
              <div className="col-lg-4 col-md-6 col-12" key={idx}>
                <Link
                  to={item.to}
                  className="single-grid wow fadeInUp same-height-card card-link"
                  data-wow-delay={`.${idx + 1}s`}
                  onClick={e => {
                    e.preventDefault()
                    navigate(item.to)
                  }}>
                  <div className="image">
                    <img src={item.img} alt={item.title} />
                  </div>
                  <div className="content text-center">
                    <h3 className="title">{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 펫오너 게시글 */}
      <section className="posts-section">
        <div className="container">
          <h2 className="section-title mb-4">펫오너 게시글</h2>
          <div className="row">{renderPostCards(ownerPosts)}</div>
        </div>
      </section>

      {/* 펫시터 게시글 */}
      <section className="posts-section">
        <div className="container">
          <h2 className="section-title mb-4">펫시터 게시글</h2>
          <div className="row">{renderPostCards(sitterPosts)}</div>
        </div>
      </section>
    </>
  )
}
