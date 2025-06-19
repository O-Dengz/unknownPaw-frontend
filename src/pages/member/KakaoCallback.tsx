// src/pages/member/KakaoCallback.tsx
import React, {useEffect, useRef, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
// import { AuthContext } from '../../contexts/AuthContext';
import {useAuth} from '../../contexts/AuthContext'

// 💡 여기에 직접 타입을 정의하는 거예요! 뚝딱뚝딱! 🛠️
interface MemberInfo {
  role: string
  mid: number
  profileImagePath: string
  nickname: string // 백엔드에서 오는 memberInfo 객체에 포함된 다른 필드들도 여기에 추가해주세요! // 예: email?: string;
}

interface KakaoLoginResponse {
  memberInfo: MemberInfo
  message: string
  token: string
}
// ------------------------------------------------------------------

const KakaoCallback: React.FC = () => {
  const navigate = useNavigate()
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const hasFetched = useRef(false)
  const {login} = useAuth()

  useEffect(() => {
    // 🌟🌟🌟🌟🌟 이 부분이 중요해요! useEffect 시작하자마자 검사! 🌟🌟🌟🌟🌟
    if (hasFetched.current) {
      console.log('이미 카카오 콜백 요청을 처리했습니다. 중복 요청 방지. 🚫')
      return // 이미 요청했으면 여기서 바로 끝!
    } // 🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟

    const code = new URL(window.location.href).searchParams.get('code')

    if (code) {
      hasFetched.current = true // 🌟🌟🌟 유효한 코드를 받았으니 요청 시작 플래그 설정! 🌟🌟🌟
      console.log('카카오로부터 받은 인가 코드:', code)

      const backendKakaoAuthUrl = `${BACKEND_URL}/unknownPaw/api/oauth/kakao?code=${code}` // ✨ axios.get<KakaoLoginResponse> 이렇게 정의한 타입을 사용하면 돼요!

      axios
        .get<KakaoLoginResponse>(backendKakaoAuthUrl)
        .then(response => {
          console.log('백엔드로부터 받은 데이터:', response.data)

          const {token, memberInfo} = response.data

          if (token) {
            localStorage.setItem('accessToken', token)
            localStorage.setItem('memberNickname', memberInfo.nickname)
            localStorage.setItem('memberRole', memberInfo.role)

            login() // 🌟🌟🌟🌟🌟 navigate() 호출 전에 login() 호출! 🌟🌟🌟🌟🌟

            console.log('로그인 성공! 목록 페이지로 이동합니다. 🏡')
            navigate('/list')
          } else {
            console.error('백엔드 응답에 토큰이 없습니다. 😢')
            navigate('/login-error')
          }
        })
        .catch(error => {
          console.error('백엔드 통신 중 에러 발생:', error)
          navigate('/login-error')
        })
    } else {
      console.error('인가 코드를 찾을 수 없어요. 😢')
      navigate('/login-error')
    }
  }, [navigate, BACKEND_URL, login]) // 🌟🌟🌟 의존성 배열에 'login' 함수 추가! 🌟🌟🌟

  return (
    <div>
            <p>카카오 로그인 처리 중입니다... 잠시만 기다려주세요! ⏳</p>   {' '}
    </div>
  )
}

export default KakaoCallback
