import {Route, Routes} from 'react-router-dom'
import {Login} from '../pages/member/Login'
import {Join} from '../pages/member/Join'
import PrivateRoute from './PrivateRoute'
import Layout from './Layout'

/**
 * 애플리케이션의 라우트 설정을 정의하는 컴포넌트
 * 
 * - /login: 로그인 페이지
 * - /join: 회원가입 페이지
 * - /*: 인증이 필요한 모든 페이지 (Layout 컴포넌트 내부에서 처리)
 */
export default function RoutesSetup() {
  return (
    <Routes>
      {/* 공개 라우트 */}
      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<Join />} />

      {/* 보호된 라우트 */}
      <Route 
        path="/*" 
        element={<PrivateRoute component={Layout} />} 
      />
    </Routes>
  )
}
