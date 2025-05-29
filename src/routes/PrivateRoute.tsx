// src/components/PrivateRoute.tsx
import React from 'react'
import {Navigate} from 'react-router-dom'
import {useAuth} from '../contexts/AuthContext' // 🌟 useAuth 훅을 임포트합니다!

interface PrivateRouteProps {
  component: React.ComponentType
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({component: Component}) => {
  const {isLoggedIn} = useAuth() // 🌟 AuthContext에서 isLoggedIn 상태를 가져와요!

  // 콘솔 로그 추가 (로그인 상태 확인용)
  console.log('[PrivateRoute] 현재 로그인 상태:', isLoggedIn)

  // isLoggedIn 상태에 따라 컴포넌트를 렌더링하거나 로그인 페이지로 리다이렉트해요!
  return isLoggedIn ? <Component /> : <Navigate to="/login" replace />
}

export default PrivateRoute
