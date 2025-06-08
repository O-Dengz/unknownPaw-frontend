import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'
import '../../assets/styles/fonts.css'

const MainHeader = () => {
  const {isLoggedIn, logout} = useAuth() // ⬅️ Context에서 상태 받아오기
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    alert('로그아웃 되었습니다! 🐾 안녕히 가세요~')
    navigate('/')
  }

  return (
    <header
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 3rem',
        zIndex: 100,
        background: 'transparent'
      }}>
      {/* 로고 */}
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          paddingTop: '80px'
        }}>
        <img
          src="/assets/images/logo/모개로고1.png"
          alt="모르는 개 산책"
          style={{
            height: '160px',
            width: 'auto',
            objectFit: 'contain',
            transform: 'rotate(-12deg)'
          }}
        />
      </Link>

      {/* 버튼 영역 */}
      <div style={{display: 'flex', gap: '1.5rem'}}>
        {isLoggedIn ? (
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: 'white',
              color: '#32ade6',
              fontWeight: 700,
              fontSize: '1.2rem',
              border: 'none',
              borderRadius: '999px',
              padding: '0.9rem 2.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              letterSpacing: '0.02em'
            }}>
            마이페이지
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#32ade6" strokeWidth="2.2" />
              <path
                d="M4 20c0-4 4-6 8-6s8 2 8 6"
                stroke="#32ade6"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '1.1rem',
                padding: '0.7rem 1.5rem',
                border: '2px solid white',
                borderRadius: '5px',
                transition: 'all 0.3s ease',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}>
              로그인
            </Link>
            <Link
              to="/join"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '1.1rem',
                padding: '0.7rem 1.5rem',
                border: '2px solid white',
                borderRadius: '5px',
                transition: 'all 0.3s ease',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}>
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default MainHeader
