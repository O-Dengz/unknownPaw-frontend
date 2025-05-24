import React, {useState, useEffect, useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import './Header.css'

export default function Header() {
  const [scrollPos, setScrollPos] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const mainNavRef = useRef<HTMLElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      const mainNav = mainNavRef.current
      if (!mainNav) return

      const currentTop = window.scrollY
      const headerHeight = mainNav.clientHeight

      if (currentTop < scrollPos) {
        if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
          mainNav.classList.add('is-visible')
        } else {
          mainNav.classList.remove('is-visible', 'is-fixed')
        }
      } else {
        mainNav.classList.remove('is-visible')
        if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
          mainNav.classList.add('is-fixed')
        }
      }
      setScrollPos(currentTop)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollPos])

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
                <Link className="navbar-brand" to="/">
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
                        to="/"
                        onClick={() => setIsMenuOpen(false)}>
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/petowner/list"
                        onClick={() => setIsMenuOpen(false)}>
                        Pet Owner
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/petsitter/list"
                        onClick={() => setIsMenuOpen(false)}>
                        Pet Sitter
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/community/posts"
                        onClick={() => setIsMenuOpen(false)}>
                        Community
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/about"
                        onClick={() => setIsMenuOpen(false)}>
                        About
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="header-button">
                  <a href="/dashboard" className="btn">
                    <i className="fas fa-user-circle"></i>
                    My Page
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}