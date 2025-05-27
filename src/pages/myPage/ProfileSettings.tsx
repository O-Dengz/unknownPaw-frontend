import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Header from '@/components/Layout/Header'
import { Footer } from '@/components/Layout/Footer'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import { DashboardSidebar } from '@/components/features/dashboard/DashboardSidebar'
import { PasswordInput } from '@/components/PasswordInput'
import { useUserStore } from '@/store/userStore'
import { EyeIcon } from 'lucide-react'
import { EyeSlashIcon } from '@heroicons/react/24/outline'
import './myPage.css'

/* ------------------------------------------------------------------ */
/*                              타입 정의                              */
/* ------------------------------------------------------------------ */
interface MemberResponseDTO {
  mid: number
  email: string
  nickname: string
  profileImagePath?: string
  pawRate: number
  address?: string | null
  phoneNumber?: string | null
  emailVerified: boolean
  regDate?: string | null
  modDate?: string | null
  role: string
  status: string
}

type PasswordField = 'currentPassword' | 'newPassword' | 'confirmNewPassword'

/* ------------------------------------------------------------------ */
/*                             컴포넌트                                */
/* ------------------------------------------------------------------ */
export function ProfileSettings() {
  const navigate = useNavigate()
  const setUserGlobally = useUserStore(s => s.setUser)
  const clearUserGlobally = useUserStore(s => s.clearUser)

  /* ------------------------- state ------------------------ */
  const [userProfile, setUserProfile] = useState<MemberResponseDTO | null>(null)

  const [profileFormValues, setProfileFormValues] = useState({
    nickname: '',
    address: '',
    phoneNumber: ''
  })

  const [passwordFormValues, setPasswordFormValues] = useState<
    Record<PasswordField, string>
  >({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })

  const [showPasswords, setShowPasswords] = useState<Record<PasswordField, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false
  })

  const [pageLoading, setPageLoading] = useState(true)
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false)
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false)

  const [pageError, setPageError] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  // 전화번호 중복 체크
  const [phoneNumberDuplicationError, setPhoneNumberDuplicationError] =
    useState<string | null>(null)
  const [isPhoneNumberChecked, setIsPhoneNumberChecked] = useState(false)

  /* ---------------------- 사용자 정보 로드 ---------------------- */
  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    ;(async () => {
      try {
        const res = await fetch('/api/member/me', {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!res.ok) throw new Error('사용자 정보 로드 실패')
        const data: MemberResponseDTO = await res.json()

        /* 상태 초기화 */
        setUserProfile(data)
        setUserGlobally(data)
        setProfileFormValues({
          nickname: data.nickname ?? '',
          address: data.address ?? '',
          phoneNumber: data.phoneNumber ?? ''
        })
        setIsPhoneNumberChecked(true)
      } catch (err) {
        console.error(err)
        setPageError('사용자 정보를 불러오지 못했습니다.')
      } finally {
        setPageLoading(false)
      }
    })()
  }, [navigate, setUserGlobally])

  /* ---------------------- 핸들러들 ----------------------- */
  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileFormValues(prev => ({ ...prev, [name]: value }))
    setProfileError(null)
    setProfileSuccess(null)

    if (name === 'phoneNumber') {
      setPhoneNumberDuplicationError(null)
      setIsPhoneNumberChecked(false)
    }
  }

  /** 비밀번호 input change */
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordFormValues(prev => ({ ...prev, [name as PasswordField]: value }))
  }

  /** 눈 아이콘 토글 */
  const togglePasswordVisibility = (field: PasswordField) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  /* ---------------- 전화번호 중복 확인 ---------------- */
  const checkPhoneNumberDuplication = async () => {
    const phone = profileFormValues.phoneNumber.trim()

    if (userProfile?.phoneNumber === phone) {
      setIsPhoneNumberChecked(true)
      return
    }
    if (!/^\d{2,3}-\d{3,4}-\d{4}$/.test(phone)) {
      setPhoneNumberDuplicationError('전화번호 형식이 올바르지 않습니다.')
      return
    }

    try {
      const res = await fetch(`/api/member/check-phone?phoneNumber=${phone}`)
      const { exists } = await res.json()

      if (exists) {
        setPhoneNumberDuplicationError('이미 사용 중인 전화번호입니다.')
        setIsPhoneNumberChecked(false)
      } else {
        setPhoneNumberDuplicationError(null)
        setIsPhoneNumberChecked(true)
      }
    } catch {
      setPhoneNumberDuplicationError('중복 확인 중 오류가 발생했습니다.')
    }
  }

  /* ---------------- 프로필 제출 ---------------- */
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (
      userProfile?.phoneNumber !== profileFormValues.phoneNumber &&
      (!isPhoneNumberChecked || phoneNumberDuplicationError)
    ) {
      setProfileError('전화번호 중복 확인을 완료해주세요.')
      return
    }

    const token = sessionStorage.getItem('token')
    if (!token) return navigate('/login')

    setProfileUpdateLoading(true)
    try {
      const res = await fetch('/api/member/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileFormValues)
      })

      if (!res.ok) throw new Error(await res.text())

      /* 업데이트 후 최신 정보 반영 */
      const meRes = await fetch('/api/member/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const newData: MemberResponseDTO = await meRes.json()
      setUserProfile(newData)
      setUserGlobally(newData)
      setProfileSuccess('프로필이 업데이트되었습니다.')
    } catch (err: any) {
      setProfileError(err.message ?? '프로필 업데이트 실패')
    } finally {
      setProfileUpdateLoading(false)
    }
  }

  /* ---------------- 비밀번호 변경 제출 ---------------- */
  const handlePasswordChangeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { currentPassword, newPassword, confirmNewPassword } = passwordFormValues
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('모든 필드를 입력해주세요.')
      return
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('새 비밀번호와 확인이 일치하지 않습니다.')
      return
    }

    const token = sessionStorage.getItem('token')
    if (!token) return navigate('/login')

    setPasswordChangeLoading(true)
    try {
      const res = await fetch('/api/member/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword })
      })
      if (!res.ok) throw new Error(await res.text())

      setPasswordSuccess('비밀번호가 변경되었습니다.')
      setPasswordFormValues({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
    } catch (err: any) {
      setPasswordError(err.message ?? '비밀번호 변경 실패')
    } finally {
      setPasswordChangeLoading(false)
    }
  }

  /* ------------------ (렌더링 로딩/에러 처리) ------------------ */
  if (pageLoading)
    return (
      <>
        <Header />
        <main className="container text-center py-20">로딩 중…</main>
        <Footer />
      </>
    )

  if (pageError)
    return (
      <>
        <Header />
        <main className="container text-center py-20 text-red-600">{pageError}</main>
        <Footer />
      </>
    )

  /* ------------------------------------------------------------------ */
  /*                           실제 화면 렌더링                           */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <Header />
      <main>
        <ScrollToTopButton />

        {/* 생략 …  (아래의 JSX 구조는 질문에 올려주신 것과 동일) */}
        {/* 중간 JSX는 그대로 두시면 되고, showPasswords / togglePasswordVisibility
            / handlePasswordInputChange 등은 이미 위에서 타입 안전하게 정의했습니다. */}
      </main>
      <Footer />
    </>
  )
}