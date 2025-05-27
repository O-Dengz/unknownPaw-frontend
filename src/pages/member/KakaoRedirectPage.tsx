// src/pages/KakaoRedirectPage.tsx

import React, {useEffect} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext' // 🌟 AuthContext를 사용!

const KakaoRedirectPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const {login} = useAuth() // 로그인 상태 업데이트를 위해 useAuth 훅 사용!

  useEffect(() => {
    const fetchKakaoLogin = async () => {
      const urlParams = new URLSearchParams(location.search)
      const code = urlParams.get('code') // URL에서 인가 코드(code) 추출

      if (code) {
        console.log('카카오 인가 코드:', code)
        try {
          // 백엔드 서버의 카카오 로그인 처리 API로 인가 코드를 전송!
          // vite.config.ts의 proxy 설정에 따라 `/api` 경로를 사용해요.
          const response = await fetch(`/api/oauth/kakao?code=${code}`)
          const data = await response.text() // 또는 JSON 응답이라면 response.json()

          if (response.ok) {
            console.log('백엔드 카카오 로그인 성공:', data)
            // 백엔드에서 사용자 정보 저장/업데이트 후 로그인 처리 (세션, JWT 등)
            // 우리 서비스의 로그인 상태를 업데이트 (AuthContext 사용)
            login() // useAuth의 login 함수 호출!
            alert('카카오 로그인에 성공했어요! 😊') // 성공 알림
            navigate('/') // 로그인 성공 후 홈 페이지로 이동
          } else {
            console.error('백엔드 카카오 로그인 실패:', data)
            alert('카카오 로그인에 실패했어요. 😢') // 실패 알림
            navigate('/login-error') // 실패 시 에러 페이지로 이동
          }
        } catch (error) {
          console.error('백엔드와 통신 중 오류 발생:', error)
          alert('네트워크 오류가 발생했어요. 다시 시도해주세요.')
          navigate('/login-error')
        }
      } else {
        console.error('카카오 인가 코드를 찾을 수 없습니다.')
        alert('카카오 로그인 중 오류가 발생했어요. 코드를 찾을 수 없어요.')
        navigate('/login-error')
      }
    }

    fetchKakaoLogin()
  }, [location, navigate, login]) // 의존성 배열에 login 추가!

  return (
    <div>
      <p>카카오 로그인 처리 중입니다. 잠시만 기다려주세요... ⏳</p>
      <p>잠시 후 자동으로 페이지가 이동됩니다.</p>
    </div>
  )
}

export default KakaoRedirectPage
