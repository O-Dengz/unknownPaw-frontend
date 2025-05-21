// src/api/authService.js

// API 기본 URL (개발 환경과 배포 환경에 따라 달라질 수 있으므로 .env 파일 등으로 관리하는 것이 좋습니다)
// 예: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'
const API_BASE_URL = 'http://localhost:8080/unknownPaw/api' // 실제 백엔드 API 주소로 변경하세요

// 1. 로그인 API 호출 함수
export async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST', // 로그인은 보통 POST 메소드 사용
      headers: {
        'Content-Type': 'application/json' // JSON 형식으로 데이터를 보냄
      },
      body: JSON.stringify({email, password}) // 이메일과 비밀번호를 JSON 문자열로 변환하여 본문에 담음
    })

    // HTTP 상태 코드 확인
    // response.ok는 상태 코드가 200-299 범위인지 확인합니다.
    if (!response.ok) {
      // 서버에서 오류 응답 (예: 401 Unauthorized, 404 Not Found 등)을 보냈을 경우
      const errorData = await response.json() // 서버가 보낸 오류 메시지를 파싱 (서버 응답 형식에 따라 다름)
      // 더 구체적인 오류 메시지를 포함하여 에러를 발생시킵니다.
      const error = new Error(errorData.message || '로그인 실패')
      error.status = response.status // HTTP 상태 코드 추가
      throw error // 이 에러는 이 함수를 호출하는 쪽(예: 로그인 컴포넌트)에서 catch하게 됩니다.
    }

    // 성공적인 응답 (상태 코드 2xx)
    const data = await response.json() // 응답 본문을 JSON으로 파싱

    // 백엔드 응답 형태에 따라 다르지만, 보통 인증 성공 시 토큰과 함께 사용자 정보 일부를 반환합니다.
    // 예: { token: '...', user: { id: ..., userName: '...', userImage: '...', username: '@...' } }
    // 이 데이터를 반환하여 호출한 곳에서 사용합니다.
    return data
  } catch (error) {
    // 네트워크 오류, CORS 문제 등 fetch 자체에서 발생한 오류
    console.error('로그인 중 오류 발생:', error)
    throw error // 오류를 다시 throw하여 호출한 곳에서 처리하도록 합니다.
  }
}

// 2. 사용자 정보 조회 API 호출 함수 (인증 필요)
export async function fetchUserProfile(token) {
  try {
    // 인증이 필요한 API 호출 시에는 'Authorization' 헤더에 토큰을 포함해야 합니다.
    // 토큰은 보통 'Bearer ' 접두사를 붙여 보냅니다. (백엔드 요구사항에 따라 다를 수 있습니다)
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      // 사용자 프로필 정보 조회 엔드포인트
      method: 'GET', // 사용자 정보 조화는 보통 GET 메소드 사용
      headers: {
        Authorization: `Bearer ${token}` // 여기에 로그인 시 받은 토큰을 넣어줍니다.
        // 'Content-Type': 'application/json', // GET 요청에는 보통 body가 없으므로 Content-Type은 필요 없을 수 있습니다.
      }
      // GET 요청은 body가 없습니다.
    })

    if (!response.ok) {
      // 인증 실패 (예: 401 Unauthorized - 토큰 만료 또는 유효하지 않음), 찾을 수 없음 (404) 등의 오류
      const errorData = await response.json()
      const error = new Error(
        errorData.message || '사용자 정보를 가져오는데 실패했습니다.'
      )
      error.status = response.status
      throw error
    }

    // 성공적인 응답
    const data = await response.json() // 사용자 상세 정보 JSON 파싱

    // 예: { id: ..., userName: '...', userImage: '...', username: '@...', email: '...' } 등
    // 이 데이터를 반환합니다. DashboardSidebar에서 사용할 정보가 포함되어 있어야 합니다.
    return data
  } catch (error) {
    console.error('사용자 정보 조회 중 오류 발생:', error)
    throw error
  }
}

// 필요한 다른 API 호출 함수들을 여기에 추가합니다.
// 예: 회원가입, 비밀번호 재설정, 게시글 목록 조회 등
