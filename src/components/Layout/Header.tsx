import React, {useState, useEffect, useRef} from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import './Header.css'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const mainNavRef = useRef<HTMLElement | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  // 메인 페이지가 아닐 때 헤더 크기 고정
  useEffect(() => {
    const header = mainNavRef.current
    if (!header) return

    if (location.pathname !== '/') {
      header.style.height = '100px'
      header.style.position = 'fixed'
      header.style.top = '0'
      header.style.left = '0'
      header.style.width = '100%'
      header.style.zIndex = '999'
      header.style.backgroundColor = '#fff'
    } else {
      header.style.height = ''
      header.style.position = ''
      header.style.top = ''
      header.style.left = ''
      header.style.width = ''
      header.style.zIndex = ''
      header.style.backgroundColor = ''
    }
  }, [location.pathname])

  // 페이지 전환 시 스크롤 위치 초기화
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // 메뉴 버튼 클릭 시 상태 토글
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

  return (
    <header ref={mainNavRef} className="header navbar-area">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="nav-inner">
              <nav className="navbar navbar-expand-lg">
                <Link className="navbar-brand" to="/" style={{marginLeft: '20px'}}>
                  <img src="/assets/images/logo/모개로고.png" alt="Logo" />
                </Link>
                <button
                  className={`navbar-toggler mobile-menu-btn ${
                    isMenuOpen ? 'active' : ''
                  }`}
                  type="button"
                  aria-label="Toggle navigation"
                  onClick={toggleMenu}>
                  <span className="toggler-icon"></span>
                  <span className="toggler-icon"></span>
                  <span className="toggler-icon"></span>
                </button>

                <div
                  className={`collapse navbar-collapse sub-menu-bar ${
                    isMenuOpen ? 'show' : ''
                  }`}
                  id="navbarSupportedContent">
                  <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/petowner/list"
                        onClick={() => setIsMenuOpen(false)}>
                        돌봐주세요
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/petsitter/list"
                        onClick={() => setIsMenuOpen(false)}>
                        돌보고싶어요
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/community/posts"
                        onClick={() => setIsMenuOpen(false)}>
                        시끌벅적
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/about"
                        onClick={() => setIsMenuOpen(false)}>
                        서비스 소개
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="header-button">
                  <Link
                    to="/dashboard"
                    className="reserve-button"
                    style={{
                      minWidth: '120px',
                      fontSize: '15px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-user-circle"></i>
                    마이페이지
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
