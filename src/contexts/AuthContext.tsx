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
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
    console.log('[초기 로그인 상태]', !!token) // ✅ 초기 로딩 시 로그인 상태
  }, [])

  const login = () => {
    setIsLoggedIn(true)
    console.log('[로그인 성공] isLoggedIn:', true) // ✅ 로그인 시
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    console.log('[로그아웃 성공] isLoggedIn:', false) // ✅ 로그아웃 시
  }

  return (
    <AuthContext.Provider value={{isLoggedIn, login, logout}}>
      {children}
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
