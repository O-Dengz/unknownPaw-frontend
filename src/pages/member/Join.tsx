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

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!emailRef.current?.value) {
      emailRef.current?.setAttribute('placeholder', 'Please Check Email')
      emailRef.current?.focus()
      return
    }
    if (!passRef.current?.value) {
      passRef.current?.setAttribute('placeholder', 'Please Check Password')
      passRef.current?.focus()
      return
    }
    if (!phoneNumberRef.current?.value) {
      phoneNumberRef.current?.setAttribute('placeholder', 'Please Check phoneNumber')
      phoneNumberRef.current?.focus()
      return
    }
    if (!nameRef.current?.value) {
      nameRef.current?.setAttribute('placeholder', 'Please Check Name')
      nameRef.current?.focus()
      return
    }
    if (!nicknameRef.current?.value) {
      nicknameRef.current?.setAttribute('placeholder', 'Please Check Nickname')
      nicknameRef.current?.focus()
      return
    }
    if (!birthdayRef.current?.value) {
      birthdayRef.current?.setAttribute('placeholder', 'Please Check Birthday')
      birthdayRef.current?.focus()
      return
    }
    if (!genderRef.current?.value) {
      genderRef.current?.setAttribute('placeholder', 'Please Check Gender')
      genderRef.current?.focus()
      return
    }
    if (!addressRef.current?.value) {
      addressRef.current?.setAttribute('placeholder', 'Please Check Address')
      addressRef.current?.focus()
      return
    }

    if (hasPet === null) {
      alert('반려동물 보유 여부를 선택해주세요.')
      return
    }

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
    <div className="form-container">
      <div className="form-wrapper">
        <div className="form-card">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="form-link">
              sign in to your account
            </Link>
          </p>

          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="email" className="form-label">
                이메일
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  ref={emailRef}
                  className="form-input"
                  placeholder="Enter your email"
                  onChange={changed('email')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                비밀번호
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="pass"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  ref={passRef}
                  className="form-input"
                  placeholder="Enter your password"
                  onChange={changed('pass')}
                  value={pass}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="form-label">
                휴대전화
              </label>
              <div className="mt-1">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  ref={phoneNumberRef}
                  className="form-input"
                  placeholder="Enter your phoneNumber "
                  onChange={changed('phoneNumber')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="form-label">
                이름
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  ref={nameRef}
                  className="form-input"
                  placeholder="Enter your full name"
                  onChange={changed('name')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="nickname" className="form-label">
                닉네임
              </label>
              <div className="mt-1">
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  required
                  ref={nicknameRef}
                  className="form-input"
                  placeholder="Enter your nickname"
                  onChange={changed('nickname')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="birthday" className="form-label">
                출생년도
              </label>
              <div className="mt-1">
                <input
                  id="birthday"
                  name="birthday"
                  type="number"
                  required
                  ref={birthdayRef}
                  className="form-input"
                  placeholder="Enter your birth year"
                  onChange={changed('birthday')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="form-label">
                성별
              </label>
              <div className="mt-1">
                <select
                  id="gender"
                  name="gender"
                  required
                  ref={genderRef}
                  className="form-select"
                  onChange={changed('gender')}>
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="form-label">
                주소
              </label>
              <div className="mt-1">
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  ref={addressRef}
                  className="form-input"
                  placeholder="Enter your address"
                  onChange={changed('address')}
                />
              </div>
            </div>

            <div>
              <label className="form-label">반려동물 보유 여부</label>
              <div className="mt-2 flex space-x-4">
                <button
                  type="button"
                  onClick={() => setHasPet(true)}
                  className={`form-button ${
                    hasPet === true
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}>
                  반려동물이 있어요
                </button>
                <button
                  type="button"
                  onClick={() => setHasPet(false)}
                  className={`form-button ${
                    hasPet === false
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}>
                  반려동물이 없어요
                </button>
              </div>
            </div>

            <div>
              <button type="submit" className="form-button form-button-primary">
                회원가입
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="form-divider">
              <span className="form-divider-text">Or continue with</span>
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
      </div>

      {/* 반려동물 정보 입력 모달 */}
      {showPetModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              지금 반려동물의 정보를 입력하시겠습니까?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowPetModal(false)
                  setShowPetForm(true)
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
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
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                아니오
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 반려동물 정보 입력 폼 */}
      {showPetForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">반려동물 정보 입력</h3>
            <form onSubmit={handlePetSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">이름</label>
                <input
                  type="text"
                  value={petForm.petName}
                  onChange={petChanged('petName')}
                  className="form-input mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">견종</label>
                <input
                  type="text"
                  value={petForm.breed}
                  onChange={petChanged('breed')}
                  className="form-input mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  출생 연도
                </label>
                <input
                  type="number"
                  value={petForm.petBirth}
                  onChange={petChanged('petBirth')}
                  className="form-input mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">성별</label>
                <select
                  value={petForm.petGender ? 'true' : 'false'}
                  onChange={e =>
                    setPetForm({...petForm, petGender: e.target.value === 'true'})
                  }
                  className="form-select mt-1">
                  <option value="true">수컷</option>
                  <option value="false">암컷</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  무게 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={petForm.weight}
                  onChange={petChanged('weight')}
                  className="form-input mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  성격 (MBTI)
                </label>
                <input
                  type="text"
                  value={petForm.petMbti}
                  onChange={petChanged('petMbti')}
                  className="form-input mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  중성화 여부
                </label>
                <select
                  value={petForm.neutering ? 'true' : 'false'}
                  onChange={e =>
                    setPetForm({...petForm, neutering: e.target.value === 'true'})
                  }
                  className="form-select mt-1">
                  <option value="true">예</option>
                  <option value="false">아니오</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">소개</label>
                <textarea
                  value={petForm.petIntroduce}
                  onChange={e => setPetForm({...petForm, petIntroduce: e.target.value})}
                  className="form-input mt-1"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
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
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
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
