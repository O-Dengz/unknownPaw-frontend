import {create} from 'zustand'

// 로그인 시 sessionStorage에 저장된 member 정보를 초기 전역 상태로 사용하기 위해 바로 가져옵니다.
const memberJson = typeof window !== 'undefined' ? sessionStorage.getItem('member') : null

// UserProfile 인터페이스: ProfileSettings에서 사용하던 것과 동일합니다.
export interface UserProfile {
  mid?: number
  email: string
  nickname: string
  profileImagePath?: string | null
  pawRate?: number
  address?: string | null
  phoneNumber?: string | null
  emailVerified?: boolean
  regDate?: string | null
  role?: string
  status?: string
}

interface UserStore {
  /** 전역에 보관할 현재 로그인 유저 정보 */
  user: UserProfile | null
  /** 프로필 업데이트 시 전역 상태 갱신 */
  setUser: (user: UserProfile | null) => void
  /** 로그아웃 시 전역 상태 초기화 */
  clearUser: () => void
}

// sessionStorage에 있으면 파싱해서 초기값으로 사용, 없으면 null
const initialUser: UserProfile | null = memberJson ? JSON.parse(memberJson) : null

export const useUserStore = create<UserStore>(set => ({
  user: initialUser,
  setUser: user => set({user}),
  clearUser: () => set({user: null})
}))
