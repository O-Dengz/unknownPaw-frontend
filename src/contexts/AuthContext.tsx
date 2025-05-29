// contexts/AuthContext.tsx

import {createContext, useContext, useState, useEffect} from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    const token = localStorage.getItem('accessToken') // 🌟🌟🌟 'token' -> 'accessToken'으로 변경! 🌟🌟🌟
    setIsLoggedIn(!!token)
    console.log('[초기 로그인 상태]', !!token)
  }, [])

  const login = () => {
    setIsLoggedIn(true) // 'accessToken'이 존재하면 true가 되므로, 이 함수 자체는 단순 상태 변경 역할만 해요.
    console.log('[로그인 성공] isLoggedIn:', true)
  }

  const logout = () => {
    localStorage.removeItem('accessToken') // 🌟🌟🌟 'token' -> 'accessToken'으로 변경! 🌟🌟🌟 // memberNickname과 memberRole도 로그아웃 시 지워주는 게 좋아요!
    localStorage.removeItem('memberNickname')
    localStorage.removeItem('memberRole')
    setIsLoggedIn(false)
    console.log('[로그아웃 성공] isLoggedIn:', false)
  }

  return (
    <AuthContext.Provider value={{isLoggedIn, login, logout}}>
            {children}   {' '}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
