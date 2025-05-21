/// 명령어 입력해주세요 : npm install zustand   <- ❗❗❗
// 닉네임 변경 및 기타 개인정보 수정 후 자동으로 반영됨
// 전역 상태의 파일로 멤버 정보 변경 후에도 상태 저장됨

// stores/userStore.ts
import {create} from 'zustand'

// UserProfile 인터페이스는 ProfileSettings에서 사용하는 것과 동일하게 정의합니다.
// null 값이 올 수 있는 필드도 함께 고려합니다.
interface UserProfile {
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
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
}

export const useUserStore = create<UserStore>(set => ({
  user: null,
  setUser: user => set({user})
}))
