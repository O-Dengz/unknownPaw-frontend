import {useState, useCallback, useRef, ChangeEvent, FormEvent} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import '../../assets/styles/login.css'

/* ------------------- 타입 & 초기 상태 ------------------- */
type LoginFormType = {
  email: string
  password: string
  rememberMe: boolean
}

const initialFormState: LoginFormType = {
  email: '',
  password: '',
  rememberMe: false
}

/* ======================= 컴포넌트 ======================= */
export function Login() {
  /* react‑state */
  const [{email, password, rememberMe}, setForm] =
    useState<LoginFormType>(initialFormState)

  /* refs */
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const navigate = useNavigate()

  /* input 변경 핸들러 */
  const changed = useCallback(
    (key: keyof LoginFormType) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
      setForm(prev => ({...prev, [key]: value as never}))
    },
    []
  )

  /* ----------------------- 로그인 ----------------------- */
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    /* 1) 프런트 단 검증 */
    if (!email.trim()) {
      alert('Please enter your email')
      return emailRef.current?.focus()
    }
    if (!password) {
      alert('Please enter your password')
      return passwordRef.current?.focus()
    }

    try {
      /* 2) 서버 요청 — context‑path 포함 */
      const res = await fetch('/api/member/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include', // 쿠키를 포함하여 요청
        body: JSON.stringify({email, password})
      })

      /* 3) 실패 분기 */
      if (!res.ok) {
        const msg = await res.text()
        alert(msg || 'Login failed')
        return
      }

      /* 4) 성공 처리 */
      const data = await res.json() // { token, member }
      sessionStorage.setItem('token', data.token)
      sessionStorage.setItem('email', email)
      sessionStorage.setItem('member', JSON.stringify(data.member))

      /* Remember‑Me */
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      /* 5) 라우팅 */
      navigate('/')
    } catch (err) {
      console.error(err)
      alert('Network error. Please try again.')
    }
  }

  /* ======================= UI ======================= */
  return (
    <>
      <Header />
      <main>
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-6 col-12">
                <div className="breadcrumbs-content">
                  <h1 className="page-title">Login</h1>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-12">
                <ul className="breadcrumb-nav">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>Login</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* --- Login Box --- */}
        <div className="login-container">
          <div className="login-box">
            <div className="login-header">
              <h2>Welcome Back!</h2>
              <p>Please login to your account</p>
            </div>

            <form className="login-form" onSubmit={onSubmit}>
              {/* email */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-group">
                  <i className="lni lni-envelope" />
                  <input
                    id="email"
                    ref={emailRef}
                    className="form-control"
                    name="email"
                    type="email"
                    value={email}
                    onChange={changed('email')}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* password */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-group">
                  <i className="lni lni-lock-alt" />
                  <input
                    id="password"
                    ref={passwordRef}
                    className="form-control"
                    name="password"
                    type="password"
                    value={password}
                    onChange={changed('password')}
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* remember me & forgot */}
              <div className="form-options">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={changed('rememberMe')}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
                <Link to="/find-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

              {/* submit */}
              <button type="submit" className="login-button">
                Sign In
              </button>

              {/* social */}
              <div className="social-login">
                <p className="divider">
                  <span>Or continue with</span>
                </p>
                <div className="social-buttons">
                  <button type="button" className="social-button facebook">
                    <i className="lni lni-facebook-filled" />
                  </button>
                  <button type="button" className="social-button google">
                    <i className="lni lni-google" />
                  </button>
                </div>
              </div>

              <p className="signup-link">
                Don't have an account? <Link to="/join">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
