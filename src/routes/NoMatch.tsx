// src/pages/NoMatch.tsx
import {useCallback, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'

import '../../public/assets/css/LineIcons.2.0.css'
import '../../public/assets/css/animate.css'
import '../../public/assets/css/bootstrap.min.css'
import '../../public/assets/css/glightbox.min.css'
import '../../public/assets/css/main.css'
import {Button} from '../theme/daisyui'
;<>
  {/* <!-- Web Font --> */}
  <link
    href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Lato&display=swap"
    rel="stylesheet"
  />
</>

export default function NoMatch() {
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
  const navigate = useNavigate()
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
                <h2>Here Is Some Problem</h2>
                <p>The page you are looking for might have been deleted.</p>
                <div className="button">
                  <Button className="btn" onClick={goBack}>
                    Go To Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
