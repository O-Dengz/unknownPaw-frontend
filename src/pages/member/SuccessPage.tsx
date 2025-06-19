import React, {useEffect} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import axios from 'axios'

export default function SuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const token = params.get('token')

  useEffect(() => {
    if (token) {
      // 1. 토큰 저장
      localStorage.setItem('accessToken', token)

      // 2. 예시: 사용자 정보 가져오기
      axios
        .get('http://localhost:8080/api/member/profile/simple/me', {
          // ❗ URL을 /api/member/profile/simple/me 로 수정
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          console.log('🐥 내 정보:', res.data)
          // 3. 원하는 페이지로 이동 (예: 홈)
          navigate('/list')
        })
        .catch(err => {
          console.error('😭 사용자 정보 가져오기 실패:', err)
          alert('로그인에 실패했습니다. 다시 시도해주세요.')
          navigate('/login')
        })
    }
  }, [token, navigate])

  return (
    <div>
      <h1>OAuth 로그인 성공!</h1>
      <p>잠시만 기다려주세요... 🚀</p>
    </div>
  )
}
