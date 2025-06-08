// contexts/AuthContext.tsx

import {createContext, useContext, useState, useEffect} from 'react'
import {useUserStore} from '../store/userStore'

interface UserProfile {
  mid: number
  email: string
  nickname: string
  profileImagePath: string | null
  pawRate: number
  address: string | null
  phoneNumber: string | null
  emailVerified: boolean
  regDate: string | null
  role: string
  status: string
}

interface AuthContextType {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const {setUser} = useUserStore()

  useEffect(() => {
    const initializeAuth = async () => {
      const token = sessionStorage.getItem('token')
      setIsLoggedIn(!!token)

      if (token) {
        const memberData = sessionStorage.getItem('member')
        if (memberData) {
          try {
            const parsed: UserProfile = JSON.parse(memberData)
            setUser(parsed)
          } catch (err) {
            console.error('[AuthContext] sessionStorage member 파싱 오류:', err)
          }
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [setUser])

  const login = () => {
    setIsLoggedIn(true)
    console.log('[로그인 성공] isLoggedIn:', true)
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('member')
    setIsLoggedIn(false)
    setUser(null)
    console.log('[로그아웃 성공] isLoggedIn:', false)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{isLoggedIn, login, logout, isLoading}}>
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
