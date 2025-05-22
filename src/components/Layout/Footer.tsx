import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import './Footer.css'

export function Footer() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem('token')
    // 세션 스토리지에서도 토큰 제거 (혹시 모를 경우 대비)
    sessionStorage.removeItem('token')
    // 홈으로 리다이렉트
    navigate('/')
    // 페이지 새로고침하여 상태 초기화
    window.location.reload()
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">UnknownPaw</h3>
          <p className="footer-description">
            반려동물과 함께하는 행복한 일상을 위한 서비스
          </p>
          <div className="footer-social">
            <a href="#" className="social-link">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-kakao"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">바로가기</h4>
          <ul className="footer-links">
            <li>
              <Link to="/" className="footer-link">
                홈
              </Link>
            </li>
            <li>
              <Link to="/about" className="footer-link">
                서비스 소개
              </Link>
            </li>
            <li>
              <Link to="/community" className="footer-link">
                커뮤니티
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="footer-link">
                마이페이지
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">고객센터</h4>
          <ul className="footer-links">
            <li>
              <a href="tel:1234-5678" className="footer-link">
                전화: 1234-5678
              </a>
            </li>
            <li>
              <a href="mailto:support@unknownpaw.com" className="footer-link">
                이메일: support@unknownpaw.com
              </a>
            </li>
            <li>
              <p className="footer-text">운영시간: 평일 09:00 - 18:00</p>
            </li>
            <li>
              <button onClick={handleLogout} className="footer-text logout-link">
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom text-center">
        <p className="footer-copyright">© 2025 UnknownPaw. All rights reserved.</p>
      </div>
    </footer>
  )
}