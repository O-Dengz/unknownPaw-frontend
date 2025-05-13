import type {ChangeEvent, FormEvent} from 'react'
import {useState, useCallback, useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'

type JoinFormType = Record<'email' | 'pass' | 'mobile' | 'name' | 'nickname', string>
const initialFormState = {email: '', pass: '', mobile: '', name: '', nickname: ''}
export function Join() {
  const [{email, pass, mobile, name, nickname}, setForm] =
    useState<JoinFormType>(initialFormState)
  const changed = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm(obj => ({...obj, [key]: e.target.value}))
    },
    []
  )
  const navigate = useNavigate()

  const emailRef = useRef<HTMLInputElement>(null)
  const passRef = useRef<HTMLInputElement>(null)
  const mobileRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const nicknameRef = useRef<HTMLInputElement>(null)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (emailRef.current?.value === '') {
      if (emailRef.current !== null) {
        emailRef.current.setAttribute('placeholder', 'Please Check Email')
        emailRef.current.focus()
      }
      return
    }
    if (passRef.current?.value === '') {
      if (passRef.current !== null) {
        passRef.current.setAttribute('placeholder', 'Please Check Password')
        passRef.current.focus()
      }
      return
    }
    if (mobileRef.current?.value === '') {
      if (mobileRef.current !== null) {
        mobileRef.current.setAttribute('placeholder', 'Please Check Mobile')
        mobileRef.current.focus()
      }
      return
    }
    if (nameRef.current?.value === '') {
      if (nameRef.current !== null) {
        nameRef.current.setAttribute('placeholder', 'Please Check Name')
        nameRef.current.focus()
      }
      return
    }
    if (nicknameRef.current?.value === '') {
      if (nicknameRef.current !== null) {
        nicknameRef.current.setAttribute('placeholder', 'Please Check Nickname')
        nicknameRef.current.focus()
      }
      return
    }
    regist(email, pass, mobile, name, nickname)
  }
  const regist = async (
    email: string,
    pass: string,
    mobile: string,
    name: string,
    nickname: string
  ) => {
    try {
      new Promise((resolve, reject) => {
        // prettier ignore
        fetch('http://localhost:8080/apiserver/members/register', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            email: email,
            password: pass,
            mobile: mobile,
            name: name,
            nickname: nickname
          })
        })
          .then(res => res.text())
          .then(mid => {
            if (mid) {
              alert('' + mid)
            }
          })
          .catch(err => console.log('Error:', err))
      })
    } catch (error) {
    } finally {
    }
  }

  // prettier-ignore
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #fceabb 0%, #f8b500 50%, #a1c4fd 100%)', // 오렌지 + 하늘색
      }}
    >
      <div className="w-full max-w-md p-10 bg-white rounded-lg shadow-lg">
        <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">
          My Journal 회원가입
        </h1>
  
        <form method="post" onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="email"
            ref={emailRef}
            placeholder="이메일"
            onChange={changed('email')}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="password"
            name="pass"
            ref={passRef}
            placeholder="비밀번호"
            onChange={changed('pass')}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="text"
            name="mobile"
            ref={mobileRef}
            placeholder="휴대폰 번호"
            onChange={changed('mobile')}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="text"
            name="name"
            ref={nameRef}
            placeholder="이름"
            onChange={changed('name')}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="text"
            name="nickname"
            ref={nicknameRef}
            placeholder="닉네임"
            onChange={changed('nickname')}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
  
          <button
            type="submit"
            className="w-full py-3 text-white bg-orange-400 hover:bg-orange-500 rounded-md font-semibold text-lg transition duration-300"
          >
            가입하기
          </button>
        </form>
  
        <div className="mt-6 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?
          <Link to="/login" className="ml-2 text-orange-500 hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );  
}
