// src/pages/unknownPaw/List.tsx
import React, {useEffect, useState, useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {getImageUrl} from '@/utils/getImageUrl'
import {formatTimeAgo} from '../../utils/timeAgo'

import BackgroundVideo from '../../components/MainLayout/BackgroundVideo'
import MainHeader from '../../components/MainLayout/MainHeader'

import '../../../public/assets/css/LineIcons.2.0.css'
import '../../../public/assets/css/animate.css'
import '../../../public/assets/css/bootstrap.min.css'
import '../../../public/assets/css/glightbox.min.css'
import '../../../public/assets/css/main.css'
import '../../../public/assets/css/tiny-slider.css'
import './List.css'

interface ImageDTO {
  imageId: number
  imagePath: string
  thumbnailPath?: string
  isMain: boolean
}
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
  images?: ImageDTO[]
  isPetSitterPost: boolean
  member?: {
    mid: number
    email: string
    nickname: string
    profileImagePath?: string
    pawRate?: number
  }
}

const bannerImages = [
  '/src/assets/banner1.png',
  '/src/assets/banner2.png',
  '/src/assets/banner3.png'
]

export function List() {
  const navigate = useNavigate()
  const [ownerPosts, setOwnerPosts] = useState<Post[]>([])
  const [sitterPosts, setSitterPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ---------------- 배너 ---------------- */
  const [currentBanner, setCurrentBanner] = useState(0)
  const bannerInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    bannerInterval.current = setInterval(
      () => setCurrentBanner(p => (p + 1) % bannerImages.length),
      3000
    )
    return () => {
      if (bannerInterval.current) {
        clearInterval(bannerInterval.current)
      }
    }
  }, [])

  const goToBanner = (idx: number) => {
    setCurrentBanner(idx)
    bannerInterval.current && clearInterval(bannerInterval.current)
    bannerInterval.current = setInterval(
      () => setCurrentBanner(p => (p + 1) % bannerImages.length),
      3000
    )
  }

  /* --------------- 데이터 로드 --------------- */
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const token = sessionStorage.getItem('token')
        if (!token) return navigate('/login', {replace: true})

        const headers = {Authorization: `Bearer ${token}`}
        const [oRes, sRes] = await Promise.all([
          fetch('/api/posts/petowner/recent/random6', {headers}),
          fetch('/api/posts/petsitter/recent/random6', {headers})
        ])
        if (oRes.status === 403 || sRes.status === 403) {
          sessionStorage.clear()
          return navigate('/login', {replace: true})
        }

        const owners = (await oRes.json()) as Post[]
        const sitters = (await sRes.json()) as Post[]

        const sortDesc = (arr: Post[]) =>
          [...arr].sort((a, b) => +new Date(b.regDate) - +new Date(a.regDate)).slice(0, 6)

        if (alive) {
          setOwnerPosts(sortDesc(owners).map(p => ({...p, isPetSitterPost: false})))
          setSitterPosts(sortDesc(sitters).map(p => ({...p, isPetSitterPost: true})))
          setIsLoading(false)
        }
      } catch (e: any) {
        alive && setError(e.message || '데이터를 불러오지 못했습니다.')
      }
    })()
    return () => {
      alive = false
    }
  }, [navigate])

  /* ---------------- 렌더 함수 ---------------- */
  const prettyDate = (d: string) =>
    (Date.now() - +new Date(d)) / 864e5 < 7
      ? formatTimeAgo(d)
      : `${new Date(d).getFullYear()}년 ${new Date(d).getMonth() + 1}월 ${new Date(
          d
        ).getDate()}일`

  const renderCards = (posts: Post[]) =>
    posts.map(p => (
      <div className="col-lg-4 col-md-6 col-12" key={p.postId}>
        <Link
          to={`/posts/${p.isPetSitterPost ? 'petsitter' : 'petowner'}/read/${p.postId}`}
          className="single-grid wow fadeInUp random-post-card"
          data-wow-delay=".2s">
          <div className="image">
            <div className="thumbnail">
              <img
                src={
                  p.images?.[0]
                    ? getImageUrl(p.images[0].thumbnailPath ?? p.images[0].imagePath)
                    : '/assets/images/pet/dog-2.jpg'
                }
                alt=""
                style={{width: '100%', height: 200, objectFit: 'cover'}}
              />
            </div>
            <div className="author">
              <div className="author-image">
                <img
                  src={
                    p.member?.profileImagePath
                      ? getImageUrl(p.member.profileImagePath)
                      : '/assets/images/items-grid/author-1.jpg'
                  }
                  alt=""
                  style={{width: 40, height: 40, borderRadius: '50%'}}
                />
                <span>{p.member?.nickname || p.email}</span>
              </div>
              <p className="sale">{p.isPetSitterPost ? '펫시터' : '펫오너'}</p>
            </div>
          </div>
          <div className="content">
            <div className="top-content">
              <span className="tag">{p.serviceCategory}</span>
              <h3 className="title">{p.title}</h3>
              <p className="update-time">등록일: {prettyDate(p.regDate)}</p>
              <p className="location">위치: {p.defaultLocation || '정보 없음'}</p>
              <p className="rate">
                시급: {p.hourlyRate ? `${p.hourlyRate.toLocaleString()}원` : '협의가능'}
              </p>
            </div>
            <div className="bottom-content">
              <span className="like">
                <i className="lni lni-heart" /> {p.likes}
              </span>
              <span className="chat">
                <i className="lni lni-comments" /> {p.chatCount}
              </span>
            </div>
          </div>
        </Link>
      </div>
    ))

  /* ---------------- 로딩 / 에러 ---------------- */
  if (isLoading)
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" />
      </div>
    )
  if (error)
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    )

  /* ------------------- 뷰 ------------------- */
  return (
    <div className="list-page-wrapper">
      <>
        {/* scroll-top */}
        <span
          className="scroll-top btn-hover"
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <i className="lni lni-chevron-up" />
        </span>

        {/* 히어로 영역 ------------------------------------------------------ */}
        <section className="hero-area overlay baemin-hero">
          <div className="baemin-hero-inner">
            <div className="baemin-hero-text">
              <h1>
                반려동물과 함께
                <br />
                사람과 사람을 잇다
              </h1>
              <p>산책, 돌봄, 커뮤니티까지 한 번에!</p>
            </div>
            <img
              src="/assets/images/main image.png"
              alt="메인 이미지"
              className="baemin-hero-image"
            />
          </div>
          <div
            className="scroll-down-indicator"
            onClick={() =>
              window.scrollTo({top: window.innerHeight, behavior: 'smooth'})
            }>
            <svg width="54" height="60" viewBox="0 0 54 60" fill="none">
              <path
                d="M27 8
         Q30 26 27 38
         Q24 50 27 52"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="2,5"
                fill="none"
                style={{
                  filter: 'drop-shadow(0px 2px 7px rgba(50,173,230,0.09))'
                }}
              />
              <path
                d="M21 46 L27 54 L33 46"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span className="scroll-text">아래로</span>
          </div>
        </section>

        <section className="hero-area overlay baemin-hero2">
          <div className="row mt-4">
            <div className="col-12">
              <div
                className="main-banner-area"
                style={{
                  width: '100%',
                  maxWidth: 1200,
                  margin: '0 auto',
                  position: 'relative',
                  textAlign: 'center',
                  minHeight: 280
                }}>
                <img
                  src={bannerImages[currentBanner]}
                  alt=""
                  style={{
                    width: '100%',
                    height: 360,
                    borderRadius: 20,
                    objectFit: 'cover',
                    boxShadow: '0 4px 32px rgba(0,0,0,.08)',
                    transition: 'all .6s cubic-bezier(.23,1,.32,1)'
                  }}
                />
                <button
                  onClick={() =>
                    goToBanner(
                      (currentBanner - 1 + bannerImages.length) % bannerImages.length
                    )
                  }
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 32,
                    transform: 'translateY(-50%)',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: 0,
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,.7)',
                    boxShadow: '0 2px 6px rgba(0,0,0,.13)',
                    fontSize: 24
                  }}>
                  ←
                </button>
                <button
                  onClick={() => goToBanner((currentBanner + 1) % bannerImages.length)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: 32,
                    transform: 'translateY(-50%)',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: 0,
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,.7)',
                    boxShadow: '0 2px 6px rgba(0,0,0,.13)',
                    fontSize: 24
                  }}>
                  →
                </button>
              </div>
            </div>
          </div>
          <div className="baemin-hero2-inner">
            {/* 이미지와 텍스트를 하나의 래퍼로 감싸기 */}
            <div className="baemin-hero2-visual">
              <img
                src="/assets/images/main image2.png"
                alt="특별한 서비스"
                className="baemin-hero-image"
              />
              <div className="baemin-hero-text">
                <h1>
                  산책, 호텔링, 돌봄
                  <br />
                  반려동물 맞춤형 서비스
                </h1>
                <div className="baemin-hero-desc">
                  사랑스러운 동물들과 믿음직한 도우미들을 만나보세요!
                </div>
              </div>
            </div>
            {/* 버튼은 hero2-inner의 가장 아래, 하단 중앙에! */}
            <div className="baemin-hero2-buttons">
              <button
                className="hero-circle-btn"
                onClick={() => navigate('/petowner/list')}>
                돌봐주세요
              </button>
              <button
                className="hero-circle-btn"
                onClick={() => navigate('/petsitter/list')}>
                돌봐줄게요
              </button>
              <button
                className="hero-circle-btn"
                onClick={() => navigate('/community/posts')}>
                커뮤니티
              </button>
            </div>
            <div className="hero2-guide-msg">버튼을 눌러 게시판으로 이동하세요</div>
          </div>
        </section>
      </>
    </div>
  )
}
