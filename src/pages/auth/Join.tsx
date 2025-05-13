import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './Join.css'

interface JoinFormData {
  email: string
  password: string
  confirmPassword: string
  name: string
  nickname: string
  phoneNumber: string
  birthday: string
  gender: boolean
  address: string
  fromSocial: boolean
  signupChannel: string
  emailVerified: boolean
  pawRate: number
  role: 'USER' | 'ADMIN'
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED' | 'DELETED'
}

export default function Join() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<JoinFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    nickname: '',
    phoneNumber: '',
    birthday: '',
    gender: true,
    address: '',
    fromSocial: false,
    signupChannel: 'direct',
    emailVerified: false,
    pawRate: 0,
    role: 'USER',
    status: 'ACTIVE'
  })

  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [errors, setErrors] = useState<Partial<JoinFormData>>({})

  const validateForm = () => {
    const newErrors: Partial<JoinFormData> = {}

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.'
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.'
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
    }

    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.'
    }

    if (!formData.nickname) {
      newErrors.nickname = '닉네임을 입력해주세요.'
    }

    if (!formData.birthday) {
      newErrors.birthday = '생년월일을 입력해주세요.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!agreeToTerms) {
      alert('이용약관에 동의해주세요.')
      return
    }

    try {
      const requestData = {
        ...formData,
        birthday: parseInt(formData.birthday.split('-')[0]), // YYYY-MM-DD에서 연도만 추출
        roleSet: new Set(['USER']),
        profileImagePath: '', // 기본값
        socialId: '' // 기본값
      }

      delete requestData.confirmPassword // 백엔드로 전송하지 않을 데이터 제거

      const response = await fetch('/api/member/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '회원가입에 실패했습니다.')
      }

      const data = await response.json()
      console.log('회원가입 성공:', data)
      alert('회원가입이 완료되었습니다! 이메일 인증을 진행해주세요.')
      navigate('/login')
    } catch (error) {
      console.error('회원가입 에러:', error)
      alert(error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.')
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {name, value, type} = e.target
    let finalValue: string | boolean = value

    if (type === 'radio' && name === 'gender') {
      finalValue = value === 'true'
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }))
  }

  return (
    <div className="join-container">
      <div className="join-form-wrapper">
        <h2>회원가입</h2>
        <div className="social-login-buttons">
          <button className="facebook-btn" onClick={() => alert('준비중입니다.')}>
            <i className="fab fa-facebook"></i> Facebook으로 가입
          </button>
          <button className="google-btn" onClick={() => alert('준비중입니다.')}>
            <i className="fab fa-google"></i> Google로 가입
          </button>
        </div>
        <div className="divider">
          <span>또는</span>
        </div>
        <form onSubmit={handleSubmit} className="join-form">
          <div className="form-group">
            <label>이메일*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@email.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>비밀번호*</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="8자 이상 입력해주세요"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>비밀번호 확인*</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="비밀번호를 다시 입력해주세요"
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label>이름*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="실명을 입력해주세요"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>닉네임*</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              placeholder="사용하실 닉네임을 입력해주세요"
            />
            {errors.nickname && <span className="error-message">{errors.nickname}</span>}
          </div>

          <div className="form-group">
            <label>전화번호</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="010-0000-0000"
            />
          </div>

          <div className="form-group">
            <label>생년월일*</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
            />
            {errors.birthday && <span className="error-message">{errors.birthday}</span>}
          </div>

          <div className="form-group">
            <label>성별*</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="true"
                  checked={formData.gender === true}
                  onChange={handleInputChange}
                />
                남성
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="false"
                  checked={formData.gender === false}
                  onChange={handleInputChange}
                />
                여성
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>주소</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="시/구 단위로 입력해주세요"
            />
          </div>

          <div className="form-group terms">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={e => setAgreeToTerms(e.target.checked)}
              />
              <span>이용약관에 동의합니다</span>
            </label>
            <a href="/terms" className="terms-link">
              이용약관 보기
            </a>
          </div>

          <button type="submit" className="submit-btn">
            가입하기
          </button>

          <div className="login-link">
            이미 계정이 있으신가요? <a href="/login">로그인하기</a>
          </div>
        </form>
      </div>
    </div>
  )
}
