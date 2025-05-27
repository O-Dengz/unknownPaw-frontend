import {Route, Routes} from 'react-router-dom'
import {Login} from '../pages/member/Login'
import {Join} from '../pages/member/Join'
import PrivateRoute from './PrivateRoute'
import Layout from '../components/Layout'
import {List} from '../pages/unknownPaw/List'
import KakaoRedirectPage from '../pages/member/KakaoRedirectPage'

/**
 * 애플리케이션의 라우트 설정을 정의하는 컴포넌트
 *
 * - /login: 로그인 페이지
 * - /join: 회원가입 페이지
 * - /*: 인증이 필요한 모든 페이지 (Layout 컴포넌트 내부에서 처리)
 * - /unknownPaw/api/oauth/kakao: 카카오 로그인 리다이렉트 처리 페이지 (새로 추가!)
 */
export default function RoutesSetup() {
  return (
    <Routes>
      {/* 공개 라우트 */}

      <Route path="/list" element={<List />} />

      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<Join />} />

      <Route path="/unknownPaw/api/oauth/kakao" element={<KakaoRedirectPage />} />

      <Route
        path="/login-error"
        element={<div>로그인에 실패했어요 😢 다시 시도해주세요!</div>}
      />

      {/* 보호된 라우트 */}
      <Route path="/*" element={<PrivateRoute component={Layout} />} />
    </Routes>
  )
}
