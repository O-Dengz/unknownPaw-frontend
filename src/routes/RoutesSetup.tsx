// src/components/RoutesSetup.tsx
import {Route, Routes} from 'react-router-dom'
import {Login} from '../pages/member/Login'
import {Join} from '../pages/member/Join'
import PrivateRoute from './PrivateRoute'
import Layout from '../components/Layout'
import {List} from '../pages/unknownPaw/List'
import KakaoCallback from '../pages/member/KakaoCallback'

export default function RoutesSetup() {
  return (
    <Routes>
      {/* 🌍 공개 라우트 (로그인 없이 접근 가능한 페이지들) */}
      <Route path="/list" element={<List />} /> {/* 목록 페이지 */}
      <Route path="/login" element={<Login />} /> {/* 로그인 페이지 */}
      <Route path="/join" element={<Join />} /> {/* 회원가입 페이지 */}
      {/* 🔑 카카오 로그인 콜백을 처리할 라우트예요! */}
      <Route path="/oauth/callback/kakao" element={<KakaoCallback />} />
      <Route
        path="/login-error"
        element={<div>로그인에 실패했어요 😢 다시 시도해주세요!</div>}
      />
      {/* 🔒 보호된 라우트 (로그인이 필요한 페이지들) */}
      {/* path="/*"는 위에 정의되지 않은 모든 경로를 잡아줘요! */}
      {/* PrivateRoute가 사용자를 인증하고, 인증되면 Layout을 보여줘요. */}
      <Route path="/*" element={<PrivateRoute component={Layout} />} />
    </Routes>
  )
}
