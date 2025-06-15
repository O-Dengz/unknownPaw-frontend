// components/MainHeader.tsx
import {Link} from 'react-router-dom'

const MainHeader = () => {
  return (
    <header
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
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
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#50bcdf',
          textDecoration: 'none',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
        UnknownPaw
      </Link>

      {/* 버튼들 */}
      <div style={{display: 'flex', gap: '1.5rem'}}>
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
      </div>
    </header>
  )
}

export default MainHeader
