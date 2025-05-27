// src/components/SocialLogin/KakaoLoginButton.tsx

import React from 'react'

const KakaoLoginButton: React.FC = () => {
  // .env 파일에서 환경 변수를 불러와요!
  const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY
  const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI

  // 환경 변수가 정의되지 않았을 경우를 대비한 안전 장치
  if (!KAKAO_REST_API_KEY || !KAKAO_REDIRECT_URI) {
    console.error(
      '환경 변수 VITE_KAKAO_REST_API_KEY 또는 VITE_KAKAO_REDIRECT_URI가 설정되지 않았습니다. .env 파일을 확인해주세요!'
    )
    return (
      <button
        disabled
        style={{
          backgroundColor: '#CCCCCC',
          color: '#666666',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'not-allowed',
          fontSize: '16px',
          fontWeight: 'bold',
          width: '100%', // 기존 로그인 버튼 크기에 맞춰 조절
          marginTop: '10px'
        }}>
        카카오 로그인 준비 중... 😥
      </button>
    )
  }

  // 카카오 로그인 요청 URL
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`

  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL
  }

  return (
    <button
      type="button" // form 태그 안에 들어가도 submit이 되지 않도록 type="button"으로 명시
      onClick={handleKakaoLogin}
      style={{
        backgroundColor: '#FEE500', // 카카오 노란색! 💛
        color: '#181600',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        width: '100%', // 기존 로그인 버튼 크기에 맞춰 조절
        marginTop: '10px' // 버튼 간 간격
      }}>
      <img
        src="\assets\kakao_login_large_narrow.png" // 카카오 아이콘 이미지가 있다면 여기에 경로를 넣어주세요!
        alt="카카오 로고"
        style={{verticalAlign: 'middle', marginRight: '8px', height: '18px'}}
      />
      카카오로 로그인
    </button>
  )
}

export default KakaoLoginButton
