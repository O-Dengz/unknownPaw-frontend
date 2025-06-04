// src/pages/unknownPaw/List.tsx
import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getImageUrl } from '@/utils/getImageUrl'
import { formatTimeAgo } from '../../utils/timeAgo'

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
  const [ownerPosts, setOwnerPosts]   = useState<Post[]>([])
  const [sitterPosts, setSitterPosts] = useState<Post[]>([])
  const [isLoading,  setIsLoading]    = useState(true)
  const [error,      setError]        = useState<string | null>(null)

  /* ---------------- 배너 ---------------- */
  const [currentBanner, setCurrentBanner] = useState(0)
  const bannerInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    bannerInterval.current = setInterval(
      () => setCurrentBanner(p => (p + 1) % bannerImages.length),
      3000
    )
    return () => bannerInterval.current && clearInterval(bannerInterval.current)
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
        if (!token) return navigate('/login', { replace: true })

        const headers = { Authorization: `Bearer ${token}` }
        const [oRes, sRes] = await Promise.all([
          fetch('/api/posts/petowner/recent/random6',   { headers }),
          fetch('/api/posts/petsitter/recent/random6', { headers })
        ])
        if (oRes.status === 403 || sRes.status === 403) {
          sessionStorage.clear()
          return navigate('/login', { replace: true })
        }

        const owners  = (await oRes.json()) as Post[]
        const sitters = (await sRes.json()) as Post[]

        const sortDesc = (arr: Post[]) =>
          [...arr].sort((a, b) => +new Date(b.regDate) - +new Date(a.regDate)).slice(0, 6)

        if (alive) {
          setOwnerPosts (sortDesc(owners ).map(p => ({ ...p, isPetSitterPost: false })))
          setSitterPosts(sortDesc(sitters).map(p => ({ ...p, isPetSitterPost: true  })))
          setIsLoading(false)
        }
      } catch (e: any) {
        alive && setError(e.message || '데이터를 불러오지 못했습니다.')
      }
    })()
    return () => { alive = false }
  }, [navigate])

  /* ---------------- 렌더 함수 ---------------- */
  const prettyDate = (d: string) =>
    (Date.now() - +new Date(d)) / 864e5 < 7
      ? formatTimeAgo(d)
      : `${new Date(d).getFullYear()}년 ${new Date(d).getMonth() + 1}월 ${new Date(d).getDate()}일`

  const renderCards = (posts: Post[]) =>
    posts.map(p => (
      <div className="col-lg-4 col-md-6 col-12" key={p.postId}>
        <Link
          to={`/posts/${p.isPetSitterPost ? 'petsitter' : 'petowner'}/read/${p.postId}`}
          className="single-grid wow fadeInUp random-post-card" data-wow-delay=".2s">
          <div className="image">
            <div className="thumbnail">
              <img
                src={
                  p.images?.[0]
                    ? getImageUrl(p.images[0].thumbnailPath ?? p.images[0].imagePath)
                    : '/assets/images/pet/dog-2.jpg'
                }
                alt=""
                style={{ width: '100%', height: 200, objectFit: 'cover' }}
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
                  alt="" style={{ width: 40, height: 40, borderRadius: '50%' }}
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
              <p className="rate">시급: {p.hourlyRate ? `${p.hourlyRate.toLocaleString()}원` : '협의가능'}</p>
            </div>
            <div className="bottom-content">
              <span className="like"><i className="lni lni-heart" /> {p.likes}</span>
              <span className="chat"><i className="lni lni-comments" /> {p.chatCount}</span>
            </div>
          </div>
        </Link>
      </div>
    ))

  /* ---------------- 로딩 / 에러 ---------------- */
  if (isLoading) return <div className="container text-center py-5"><div className="spinner-border" /></div>
  if (error)     return <div className="container text-center py-5"><div className="alert alert-danger">{error}</div></div>

  /* ------------------- 뷰 ------------------- */
  return (
    <>
      {/* scroll-top */}
      <span className="scroll-top btn-hover"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i className="lni lni-chevron-up" />
      </span>

      {/* 히어로 영역 ------------------------------------------------------ */}
      <section className="hero-area overlay"
        style={{ height: '60vh', minHeight: 420, position: 'relative',
                 display: 'flex', alignItems: 'center', background: '#23c8c5', overflow: 'hidden' }}>
        <MainHeader />
        <BackgroundVideo />
        <div style={{ position: 'absolute', left: 0, width: '100%', height: '100%',
                      display: 'flex', alignItems: 'flex-end', paddingBottom: '30vh',
                      pointerEvents: 'none', zIndex: 3 }}>
          <div style={{ color: '#fff', marginLeft: '10vw', fontWeight: 900, fontSize: '4.5rem',
                        lineHeight: 1.13, letterSpacing: -2, textShadow: '2px 2px 24px rgba(0,0,0,.13)',
                        maxWidth: 800 }}>
            산책과 돌봄으로<br />사람과 사람을 잇는 서비스
          </div>
        </div>
      </section>

      {/* 카테고리 카드 + 배너 -------------------------------------------- */}
      <section className="categories-section" style={{ marginTop: 120 }}>
        <div className="container">
          <div className="row">
            {[
              { to: '/petowner/list',  img: '/assets/images/items-grid/1.jpg',
                title: '돌봐주세요 🐶', desc: '반려동물을 돌봐줄 사람을 찾고 있다면 여기로!' },
              { to: '/petsitter/list', img: '/assets/images/items-grid/3.jpg',
                title: '돌보고싶어요 🙋🏻‍♂️', desc: '펫시터로 활동하고 싶다면 이곳을 확인해보세요!' },
              { to: '/community/posts',img: '/assets/images/items-grid/4.jpg',
                title: '커뮤니티 게시판', desc: '자유롭게 소통할 수 있는 반려동물 커뮤니티' }
            ].map((c, i) => (
              <div className="col-lg-4 col-md-6 col-12" key={i}>
                <Link to={c.to} className="single-grid wow fadeInUp same-height-card card-link"
                      data-wow-delay={`.${i + 1}s`} onClick={e => { e.preventDefault(); navigate(c.to) }}>
                  <div className="image"><img src={c.img} alt={c.title} /></div>
                  <div className="content text-center"><h3 className="title">{c.title}</h3><p>{c.desc}</p></div>
                </Link>
              </div>
            ))}
          </div>

          {/* 배너 */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="main-banner-area" style={{ width: '100%', maxWidth: 1200, margin: '0 auto',
                    position: 'relative', textAlign: 'center', minHeight: 280 }}>
                <img src={bannerImages[currentBanner]} alt=""
                     style={{ width: '100%', height: 280, borderRadius: 20, objectFit: 'cover',
                              boxShadow: '0 4px 32px rgba(0,0,0,.08)', transition: 'all .6s cubic-bezier(.23,1,.32,1)' }}/>
                <button onClick={() => goToBanner((currentBanner - 1 + bannerImages.length) % bannerImages.length)}
                        style={{ position: 'absolute', top: '50%', left: 32, transform: 'translateY(-50%)',
                                 width: 40, height: 40, borderRadius: '50%', border: 0, cursor: 'pointer',
                                 background: 'rgba(255,255,255,.7)', boxShadow: '0 2px 6px rgba(0,0,0,.13)', fontSize: 24 }}>
                  ←
                </button>
                <button onClick={() => goToBanner((currentBanner + 1) % bannerImages.length)}
                        style={{ position: 'absolute', top: '50%', right: 32, transform: 'translateY(-50%)',
                                 width: 40, height: 40, borderRadius: '50%', border: 0, cursor: 'pointer',
                                 background: 'rgba(255,255,255,.7)', boxShadow: '0 2px 6px rgba(0,0,0,.13)', fontSize: 24 }}>
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 게시글 ---------------------------------------------------------- */}
      <section className="posts-section">
        <div className="container">
          <h2 className="section-title mb-4">펫오너 게시글</h2>
          <div className="row">{renderCards(ownerPosts)}</div>
        </div>
      </section>
      <section className="posts-section">
        <div className="container">
          <h2 className="section-title mb-4">펫시터 게시글</h2>
          <div className="row">{renderCards(sitterPosts)}</div>
        </div>
      </section>
    </>
  )
}