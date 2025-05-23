import type {ChangeEvent, FormEvent} from 'react'
import {useState, useCallback, useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {EyeIcon, EyeSlashIcon} from '@heroicons/react/24/outline'
import './Join.css'

type JoinFormType = Record<
  | 'email'
  | 'pass'
  | 'phoneNumber'
  | 'name'
  | 'nickname'
  | 'birthday'
  | 'gender'
  | 'address',
  string
>

type PetFormType = {
  petName: string
  breed: string
  petBirth: string
  petGender: boolean
  weight: string
  petMbti: string
  neutering: boolean
  petIntroduce: string
}

const initialFormState = {
  email: '',
  pass: '',
  phoneNumber: '',
  name: '',
  nickname: '',
  birthday: '',
  gender: '',
  address: ''
}

const initialPetFormState = {
  petName: '',
  breed: '',
  petBirth: '',
  petGender: true,
  weight: '',
  petMbti: '',
  neutering: false,
  petIntroduce: ''
}

export function Join() {
  const [{email, pass, phoneNumber, name, nickname, birthday, gender, address}, setForm] =
    useState<JoinFormType>(initialFormState)
  const [petForm, setPetForm] = useState<PetFormType>(initialPetFormState)
  const [showPassword, setShowPassword] = useState(false)
  const [showPetModal, setShowPetModal] = useState(false)
  const [showPetForm, setShowPetForm] = useState(false)
  const [hasPet, setHasPet] = useState<boolean | null>(null)

  // 닉네임 중복 확인 관련 상태
  const [isNicknameChecked, setIsNicknameChecked] = useState(false) // 닉네임 중복 확인을 했는지 여부
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null) // 닉네임 사용 가능 여부 (true/false/null)
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState('') // 닉네임 에러/성공 메시지

  // 이메일 중복 확인 관련 상태
  const [emailDuplicateStatus, setEmailDuplicateStatus] = useState<
    'idle' | 'checking' | 'available' | 'duplicate' | 'error'
  >('idle')
  const [emailCheckMessage, setEmailCheckMessage] = useState<string>('')

  // 휴대폰 번호 중복 확인 관련 상태
  const [phoneDuplicateStatus, setPhoneDuplicateStatus] = useState<
    'idle' | 'checking' | 'available' | 'duplicate' | 'error'
  >('idle')
  const [phoneCheckMessage, setPhoneCheckMessage] = useState<string>('')

  const changed = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm(obj => ({...obj, [key]: e.target.value}))
    },
    []
  )

  const petChanged = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setPetForm(obj => ({...obj, [key]: e.target.value}))
    },
    []
  )

  const navigate = useNavigate()

  const emailRef = useRef<HTMLInputElement>(null)
  const passRef = useRef<HTMLInputElement>(null)
  const phoneNumberRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const nicknameRef = useRef<HTMLInputElement>(null)
  const birthdayRef = useRef<HTMLInputElement>(null)
  const genderRef = useRef<HTMLSelectElement>(null)
  const addressRef = useRef<HTMLInputElement>(null)

  // 닉네임 입력 변경 핸들러
  const handleNicknameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setForm(obj => ({...obj, nickname: value})) // 닉네임 상태 업데이트
    setIsNicknameChecked(false) // 닉네임이 변경되었으니 중복 확인 상태 초기화
    setIsNicknameAvailable(null) // 사용 가능 여부 초기화
    setNicknameErrorMessage('') // 에러 메시지 초기화
  }, [])

  // 이메일 입력 변경 핸들러
  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    setForm(prev => ({...prev, email: value})) // setFormData 대신 setForm 사용
    // 입력이 다시 시작되면 중복 확인 상태 초기화
    setEmailDuplicateStatus('idle')
    setEmailCheckMessage('')
  }, [])

  // 휴대폰 번호 입력 변경 핸들러
  const handlePhoneChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    setForm(prev => ({...prev, phoneNumber: value})) // setFormData 대신 setForm 사용
    // 입력이 다시 시작되면 중복 확인 상태 초기화
    setPhoneDuplicateStatus('idle')
    setPhoneCheckMessage('')
  }, [])

  // 닉네임 중복 확인 API 호출 함수
  const checkNicknameAvailability = useCallback(async (currentNickname: string) => {
    if (currentNickname.trim() === '') {
      setNicknameErrorMessage('닉네임을 입력해주세요.')
      setIsNicknameAvailable(false) // 입력 안 했으니 사용 불가능
      setIsNicknameChecked(true) // 확인 시도 자체는 했음
      return
    }

    try {
      const response = await fetch(
        `/api/member/check-nickname?nickname=${encodeURIComponent(currentNickname)}`,
        {
          method: 'GET'
        }
      )

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({message: '알 수 없는 오류 발생.'})) // JSON 파싱 실패 대비
        setNicknameErrorMessage(
          errorData.message || '닉네임 확인 중 오류가 발생했습니다. 다시 시도해주세요.'
        )
        setIsNicknameAvailable(false)
        setIsNicknameChecked(true)
        return
      }

      const data = await response.json() // 서버 응답이 {isAvailable: true/false} 형태라고 가정
      if (data.isAvailable) {
        setIsNicknameAvailable(true)
        setIsNicknameChecked(true)
        setNicknameErrorMessage('사용 가능한 닉네임입니다.')
      } else {
        setIsNicknameAvailable(false)
        setIsNicknameChecked(true)
        setNicknameErrorMessage('이미 사용 중인 닉네임입니다.')
      }
    } catch (error) {
      console.error('Failed to check nickname availability:', error)
      setNicknameErrorMessage('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.')
      setIsNicknameAvailable(false)
      setIsNicknameChecked(true)
    }
  }, [])

  // 이메일 중복 확인 함수
  const checkEmailDuplication = async (currentEmail: string) => {
    // 인자명 충돌 피함
    if (!currentEmail) {
      // currentEmail로 변경
      setEmailDuplicateStatus('idle')
      setEmailCheckMessage('')
      return
    }

    setEmailDuplicateStatus('checking')
    setEmailCheckMessage('이메일 중복 확인 중...')

    try {
      const response = await fetch(`/api/member/check-email?email=${currentEmail}`) // 백엔드 API 경로 확인
      const data = await response.json() // 백엔드 응답 형태: { isDuplicate: true/false }

      if (response.ok) {
        if (data.isDuplicate) {
          setEmailDuplicateStatus('duplicate')
          setEmailCheckMessage('이미 사용 중인 이메일입니다.')
        } else {
          setEmailDuplicateStatus('available')
          setEmailCheckMessage('사용 가능한 이메일입니다.')
        }
      } else {
        // 서버에서 에러 응답이 왔을 경우 (예: 500 Internal Server Error)
        const errorData = await response
          .json()
          .catch(() => ({message: '알 수 없는 오류 발생.'}))
        setEmailDuplicateStatus('error')
        setEmailCheckMessage(
          `오류: ${errorData.message || '이메일 중복 확인에 실패했습니다.'}`
        )
      }
    } catch (error) {
      console.error('이메일 중복 확인 중 네트워크 오류:', error)
      setEmailDuplicateStatus('error')
      setEmailCheckMessage('네트워크 오류가 발생했습니다.')
    }
  }

  // 휴대폰 번호 중복 확인 함수
  const checkPhoneDuplication = async (currentPhoneNumber: string) => {
    // 인자명 충돌 피함
    if (!currentPhoneNumber) {
      // currentPhoneNumber로 변경
      setPhoneDuplicateStatus('idle')
      setPhoneCheckMessage('')
      return
    }

    setPhoneDuplicateStatus('checking')
    setPhoneCheckMessage('휴대폰 번호 중복 확인 중...')

    try {
      const response = await fetch(
        `/api/member/check-phone?phoneNumber=${currentPhoneNumber}`
      ) // 백엔드 API 경로 확인
      const data = await response.json() // 백엔드 응답 형태: { isDuplicate: true/false }

      if (response.ok) {
        if (data.isDuplicate) {
          setPhoneDuplicateStatus('duplicate')
          setPhoneCheckMessage('이미 사용 중인 휴대폰 번호입니다.')
        } else {
          setPhoneDuplicateStatus('available')
          setPhoneCheckMessage('사용 가능한 휴대폰 번호입니다.')
        }
      } else {
        // 서버에서 에러 응답이 왔을 경우
        const errorData = await response
          .json()
          .catch(() => ({message: '알 수 없는 오류 발생.'}))
        setPhoneDuplicateStatus('error')
        setPhoneCheckMessage(
          `오류: ${errorData.message || '휴대폰 번호 중복 확인에 실패했습니다.'}`
        )
      }
    } catch (error) {
      console.error('휴대폰 번호 중복 확인 중 네트워크 오류:', error)
      setPhoneDuplicateStatus('error')
      setPhoneCheckMessage('네트워크 오류가 발생했습니다.')
    }
  }

  // 최종 onSubmit 함수
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let hasFormError = false // 폼 필드 유효성 검사 에러

    // 1. 필수 입력 필드 검사 (기존 로직 유지)
    // 기존 유효성 검사 로직...
    if (!emailRef.current?.value) {
      emailRef.current?.setAttribute('placeholder', '이메일을 입력해주세요.')
      emailRef.current?.focus()
      hasFormError = true
    } else if (!passRef.current?.value) {
      passRef.current?.setAttribute('placeholder', '비밀번호를 입력해주세요.')
      passRef.current?.focus()
      hasFormError = true
    } else if (!phoneNumberRef.current?.value) {
      phoneNumberRef.current?.setAttribute('placeholder', '휴대전화 번호를 입력해주세요.')
      phoneNumberRef.current?.focus()
      hasFormError = true
    } else if (!nameRef.current?.value) {
      nameRef.current?.setAttribute('placeholder', '이름을 입력해주세요.')
      nameRef.current?.focus()
      hasFormError = true
    } else if (!birthdayRef.current?.value) {
      birthdayRef.current?.setAttribute('placeholder', '출생년도를 입력해주세요.')
      birthdayRef.current?.focus()
      hasFormError = true
    } else if (!genderRef.current?.value) {
      // select는 placeholder가 동작 안함, 에러 메시지 UI 필요
      genderRef.current?.focus()
      hasFormError = true
    } else if (!addressRef.current?.value) {
      addressRef.current?.setAttribute('placeholder', '주소를 입력해주세요.')
      addressRef.current?.focus()
      hasFormError = true
    }

    // 2. 닉네임 중복 확인 최종 검사
    if (!nicknameRef.current?.value.trim()) {
      setNicknameErrorMessage('닉네임을 입력해주세요.')
      setIsNicknameAvailable(false)
      setIsNicknameChecked(true)
      nicknameRef.current?.focus()
      hasFormError = true
    } else if (!isNicknameChecked || isNicknameAvailable === false) {
      setNicknameErrorMessage(
        '닉네임 중복 확인을 완료하거나, 사용 가능한 닉네임을 입력해주세요.'
      )
      if (nicknameRef.current) {
        nicknameRef.current.focus()
      }
      hasFormError = true
    }

    // 3. 이메일 중복 확인 최종 검사
    if (emailDuplicateStatus !== 'available') {
      setEmailCheckMessage(
        '이메일 중복 확인을 완료하거나, 사용 가능한 이메일을 입력해주세요.'
      )
      if (emailRef.current) {
        emailRef.current.focus()
      }
      hasFormError = true
    }

    // 4. 휴대폰 번호 중복 확인 최종 검사
    if (phoneDuplicateStatus !== 'available') {
      setPhoneCheckMessage(
        '휴대폰 번호 중복 확인을 완료하거나, 사용 가능한 번호를 입력해주세요.'
      )
      if (phoneNumberRef.current) {
        phoneNumberRef.current.focus()
      }
      hasFormError = true
    }

    if (hasFormError) {
      // 모든 유효성 검사에서 에러가 발생했으면 제출 중단
      return
    }

    // 반려동물 보유 여부 선택 확인
    if (hasPet === null) {
      alert('반려동물 보유 여부를 선택해주세요.')
      return
    }

    // 모든 검증 통과 후 다음 단계 진행
    if (hasPet) {
      setShowPetModal(true)
    } else {
      regist(email, pass, phoneNumber, name, nickname, birthday, gender, address)
    }
  }

  const handlePetSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    regist(email, pass, phoneNumber, name, nickname, birthday, gender, address, petForm)
  }

  const regist = async (
    email: string,
    pass: string,
    phoneNumber: string,
    name: string,
    nickname: string,
    birthday: string,
    gender: string,
    address: string,
    petInfo?: PetFormType
  ) => {
    try {
      const response = await fetch('/api/member/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email,
          password: pass,
          phoneNumber,
          name,
          nickname,
          birthday: parseInt(birthday),
          gender: gender === 'male',
          address,
          petInfo
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || '회원가입에 실패했습니다.')
      }

      const result = await response.text()
      if (result) {
        // alert(result)
        navigate('/login')
        console.log('Sending password:', pass)
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert(error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="join-container">
      <div className="join-wrapper">
        <div className="join-card">
          <h2 className="join-title">회원 가입</h2>
          <p className="join-subtitle">
            <div className="social-divider">
              <span className="social-divider-text">Or</span>
            </div>
            <Link to="/login" className="join-link">
              계정으로 로그인 하기
            </Link>
          </p>

          <form className="form-group" onSubmit={onSubmit}>
            {/* 이메일 필드 */}
            <label htmlFor="email">이메일</label>
            <div className="form-group">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                ref={emailRef}
                className="form-input"
                placeholder="예: mogae@gee.com"
                value={email} // Controlled component로 유지
                onChange={handleEmailChange} // 새로운 핸들러 사용
                onBlur={() => checkEmailDuplication(email)} // onBlur 이벤트
              />
            </div>
            {emailCheckMessage && (
              <p
                className={`validation-message ${
                  emailDuplicateStatus === 'available' ? 'success' : 'error'
                }`}>
                {emailCheckMessage}
              </p>
            )}

            {/* 비밀번호 필드 */}
            <div>
              <label htmlFor="password">비밀번호</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  name="pass"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  ref={passRef}
                  className="form-input"
                  placeholder="비밀번호"
                  onChange={changed('pass')}
                  value={pass}
                />
                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* 휴대폰 번호 필드 */}
            <div className="mt-20">
              <label htmlFor="phoneNumber">휴대전화</label>
              <div className="form-group">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  ref={phoneNumberRef}
                  className="form-input"
                  placeholder="예: 010-1234-1234"
                  value={phoneNumber} // Controlled component로 유지
                  onChange={handlePhoneChange} // 새로운 핸들러 사용
                  onBlur={() => checkPhoneDuplication(phoneNumber)} // onBlur 이벤트
                />
              </div>
            </div>
            {phoneCheckMessage && (
              <p
                className={`validation-message ${
                  phoneDuplicateStatus === 'available' ? 'success' : 'error'
                }`}>
                {phoneCheckMessage}
              </p>
            )}

            {/* 이름 필드 */}
            <div>
              <label htmlFor="name">이름</label>
              <div className="form-group">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  ref={nameRef}
                  className="form-input"
                  placeholder="이름을 작성해주세요"
                  onChange={changed('name')}
                />
              </div>
            </div>

            {/* 닉네임 필드 */}
            <div className="form-field">
              <label htmlFor="nickname" className="form-label">
                닉네임
              </label>
              <div className="input-with-button-group">
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  required
                  ref={nicknameRef}
                  placeholder="닉네임을 작성해주세요."
                  onChange={handleNicknameChange}
                  value={nickname} // Controlled component로 유지
                />
                <button
                  type="button"
                  className="button button-check" // 새로운 버튼 스타일 클래스
                  onClick={() => checkNicknameAvailability(nickname)} // 닉네임 중복 확인 함수 호출
                  disabled={nickname.trim() === '' || isNicknameAvailable === true} // 입력값이 없거나 이미 사용 가능하면 비활성화
                >
                  중복 확인
                </button>
              </div>
              {nicknameErrorMessage && (
                <p
                  className={`validation-message ${
                    isNicknameAvailable ? 'success' : 'error' // 닉네임은 isNicknameAvailable로 성공/실패 구분
                  }`}>
                  {nicknameErrorMessage}
                </p>
              )}
            </div>

            {/* 출생년도 필드 */}
            <div>
              <label htmlFor="birthday">출생년도</label>
              <div className="form-group">
                <input
                  id="birthday"
                  name="birthday"
                  type="number"
                  required
                  ref={birthdayRef}
                  className="form-input"
                  placeholder="예시: 1988"
                  onChange={changed('birthday')}
                />
              </div>
            </div>

            {/* 성별 필드 */}
            <div className="form-field">
              <label htmlFor="gender" className="form-label">
                성별
              </label>
              <div className="form-group">
                <select
                  id="gender"
                  name="gender"
                  required
                  ref={genderRef}
                  className="form-select"
                  onChange={changed('gender')}>
                  <option value="">선택해 주세요</option>
                  <option value="male">남자</option>
                  <option value="female">여자</option>
                </select>
              </div>
            </div>

            {/* 주소 필드 */}
            <div>
              <label htmlFor="address">주소</label>
              <div className="form-group">
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  ref={addressRef}
                  className="form-input"
                  placeholder="예: 서울시 강남구"
                  onChange={changed('address')}
                />
              </div>
            </div>

            {/* 반려동물 보유 여부 필드 */}
            <div className="form-field">
              <label className="form-label">반려동물 보유 여부</label>
              <div className="toggle-group">
                <button
                  type="button"
                  onClick={() => setHasPet(true)}
                  className={`toggle-button ${hasPet === true ? 'is-active' : ''}`}>
                  반려동물이 있어요
                </button>
                <button
                  type="button"
                  onClick={() => setHasPet(false)}
                  className={`toggle-button ${hasPet === false ? 'is-active' : ''}`}>
                  반려동물이 없어요
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="button button-primary"
                // 회원가입 버튼 비활성화 조건 추가
                disabled={
                  emailDuplicateStatus !== 'available' ||
                  phoneDuplicateStatus !== 'available' ||
                  !isNicknameChecked || // 닉네임 중복 확인 완료 여부
                  isNicknameAvailable === false // 닉네임 사용 가능 여부
                }>
                회원가입
              </button>
            </div>
          </form>

          <div className="social-divider">
            <span className="social-divider-text">또는 다음으로 가입</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div>
              <a href="#" className="form-social-button">
                <span className="sr-only">Sign up with Facebook</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>

            <div>
              <a href="#" className="form-social-button">
                <span className="sr-only">Sign up with Google</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 반려동물 정보 입력 모달 */}
      {showPetModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">지금 반려동물의 정보를 입력하시겠습니까?</h3>
            <div className="modal-actions">
              <button
                type="button"
                onClick={() => {
                  setShowPetModal(false)
                  setShowPetForm(true)
                }}
                className="button button-primary">
                예
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPetModal(false)
                  regist(
                    email,
                    pass,
                    phoneNumber,
                    name,
                    nickname,
                    birthday,
                    gender,
                    address
                  )
                }}
                className="button button-secondary">
                아니오
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 반려동물 정보 입력 폼 */}
      {showPetForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">반려동물 정보 입력</h3>
            <form onSubmit={handlePetSubmit} className="pet-form-grid">
              <div className="form-field">
                <label className="form-label">이름</label>
                <input
                  type="text"
                  value={petForm.petName}
                  onChange={petChanged('petName')}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">견종</label>
                <input
                  type="text"
                  value={petForm.breed}
                  onChange={petChanged('breed')}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">출생 연도</label>
                <input
                  type="number"
                  value={petForm.petBirth}
                  onChange={petChanged('petBirth')}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">성별</label>
                <select
                  value={petForm.petGender ? 'true' : 'false'}
                  onChange={e =>
                    setPetForm({...petForm, petGender: e.target.value === 'true'})
                  }
                  className="form-select">
                  <option value="true">수컷</option>
                  <option value="false">암컷</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">무게 (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={petForm.weight}
                  onChange={petChanged('weight')}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">성격 (MBTI)</label>
                <input
                  type="text"
                  value={petForm.petMbti}
                  onChange={petChanged('petMbti')}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">중성화 여부</label>
                <select
                  value={petForm.neutering ? 'true' : 'false'}
                  onChange={e =>
                    setPetForm({...petForm, neutering: e.target.value === 'true'})
                  }
                  className="form-select">
                  <option value="true">예</option>
                  <option value="false">아니오</option>
                </select>
              </div>
              <div className="form-field full-width">
                <label className="form-label">소개</label>
                <textarea
                  value={petForm.petIntroduce}
                  onChange={e => setPetForm({...petForm, petIntroduce: e.target.value})}
                  className="form-textarea"
                  rows={3}
                  required
                />
              </div>
              <div className="modal-actions full-width">
                <button type="submit" className="button button-primary">
                  등록
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPetForm(false)
                    regist(
                      email,
                      pass,
                      phoneNumber,
                      name,
                      nickname,
                      birthday,
                      gender,
                      address
                    )
                  }}
                  className="button button-secondary">
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
