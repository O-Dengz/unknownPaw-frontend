// src/components/KakaoLoginButton.tsx
import React from 'react'

const KakaoLoginButton: React.FC = () => {
  // 🐻 환경 변수 사용!
  // Vite 환경에서는 import.meta.env.* 로 환경 변수를 가져와요.
  const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY
  const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI

  // 🚨 중요한 부분! 환경 변수가 제대로 설정되었는지 확인하는 습관을 들이면 좋아요!
  if (!KAKAO_REST_API_KEY || !KAKAO_REDIRECT_URI) {
    console.error(
      '카카오 로그인 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.'
    )
    return <div>카카오 로그인 버튼을 표시할 수 없습니다.</div> // 오류 메시지 표시
  }

  // 🌈 카카오 인증 URL을 정확하게 만듭니다!
  // .env 파일과 카카오 개발자 센터에 등록한 URI와 EXACTLY! 똑같아야 해요!
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`

  const handleKakaoLogin = () => {
    // 카카오 로그인 페이지로 이동합니다! 슝~ 💨
    window.location.href = KAKAO_AUTH_URL
  }

  return (
    // 귀여운 카카오 로그인 버튼이에요! 💛
    <button
      onClick={handleKakaoLogin}
      style={{
        backgroundColor: '#FEE500', // 카카오 노랑색!
        color: '#3C1E1E', // 카카오 글씨색!
        border: 'none',
        borderRadius: '5px',
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
      {/* 귀여운 카카오 로고 이모티콘 톡! */}
      <img
        src="\assets\kakao_login_medium_narrow.png"
        alt="카카오 로고"
        style={{width: '20px', height: '20px'}}
      />
      카카오 로그인
    </button>
  )
}

export default KakaoLoginButton
