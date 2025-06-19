// src/pages/NoMatch.tsx
import {useCallback, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {Button} from '../theme/daisyui'

// 스타일 import
import '../../public/assets/css/LineIcons.2.0.css'
import '../../public/assets/css/animate.css'
import '../../public/assets/css/bootstrap.min.css'
import '../../public/assets/css/glightbox.min.css'
import '../../public/assets/css/main.css'

/**
 * 404 에러 페이지 컴포넌트
 * 존재하지 않는 페이지에 접근했을 때 표시됩니다.
 */
export default function NoMatch() {
  const navigate = useNavigate()

  useEffect(() => {
    // Preloader fade out
    const timer = setTimeout(() => {
      const preloader = document.querySelector('.preloader') as HTMLElement
      if (preloader) {
        preloader.style.opacity = '0'
        preloader.style.display = 'none'
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const goBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  return (
    <>
      {/* Preloader */}
      <div className="preloader">
        <div className="preloader-inner">
          <div className="preloader-icon">
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      {/* Error Area */}
      <div className="error-area">
        <div className="d-table">
          <div className="d-table-cell">
            <div className="container">
              <div className="error-content">
                <h1>404</h1>
                <h2>페이지를 찾을 수 없습니다</h2>
                <p>요청하신 페이지가 삭제되었거나 존재하지 않습니다.</p>
                <div className="button">
                  <Button className="btn" onClick={goBack}>
                    이전 페이지로
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Web Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Lato&display=swap"
        rel="stylesheet"
      />
    </>
  )
}
