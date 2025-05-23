import React, {useState, useEffect, ChangeEvent} from 'react'
import {useNavigate, Link, NavLink} from 'react-router-dom'
import Header from '../../components/common/Header' // Header 컴포넌트 import
import Footer from '../../components/common/Footer' // Footer 컴포넌트 import
import {DashboardSidebar} from '../../components/DashboardSidebar'
import './myPage.css'
import {useUserStore} from '../../store/userStore'
import {PasswordInput} from '../../components/PasswordInput'
import ScrollToTopButton from '../../components/ScrollToTopButton'

interface UserProfile {
  email?: string
  nickname?: string
  address?: string
  phoneNumber?: string
  profileImageUrl?: string
}
interface MemberResponseDTO {
  mid: number
  email: string
  nickname: string
  profileImagePath?: string // 백엔드 응답에 맞게 수정
  pawRate: number
  address?: string | null // 백엔드 응답에 맞게 수정
  phoneNumber?: string | null // 백엔드 응답에 맞게 수정
  emailVerified: boolean
  regDate?: string | null
  modDate?: string | null
  role: string
  status: string
  // 다른 필드...
}

export function ProfileSettings() {
  // 통합 컴포넌트 이름
  const navigate = useNavigate()

  // Zustand 스토어의 setUser 액션만 가져옴
  const setUserGlobally = useUserStore(state => state.setUser)
  const clearUserGlobally = useUserStore(state => state.clearUser) // Zustand clearUser 액션 추가

  // --- State 관리 ---

  // 사용자 정보를 저장할 state (초기값은 null 또는 빈 객체)
  const [userProfile, setUserProfile] = useState<MemberResponseDTO | null>(null)

  // 일반 회원 정보 폼 입력 값을 관리할 state
  const [profileFormValues, setProfileFormValues] = useState({
    nickname: '',
    address: '',
    phoneNumber: ''
    // 다른 필드 초기값 추가
  })

  // 비밀번호 변경 폼 입력 값을 관리할 state
  const [passwordFormValues, setPasswordFormValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '' // 새 비밀번호 확인 필드 (클라이언트 측 유효성 검사용)
  })

  // 로딩 상태 관리 (전체 페이지 로딩 및 개별 폼 제출 로딩)
  const [pageLoading, setPageLoading] = useState(true) // 초기 페이지 로딩
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false) // 프로필 업데이트 로딩
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false) // 비밀번호 변경 로딩

  // 에러 메시지 상태 관리 (개별 폼 또는 전체 페이지)
  const [pageError, setPageError] = useState<string | null>(null) // 초기 데이터 로딩 에러
  const [profileError, setProfileError] = useState<string | null>(null) // 프로필 업데이트 에러
  const [passwordError, setPasswordError] = useState<string | null>(null) // 비밀번호 변경 에러

  // 성공 메시지 상태 관리 (개별 폼)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null) // 프로필 업데이트 성공
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null) // 비밀번호 변경 성공

  // 이미지 관련 상태 관리
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(null)

  // 회원 탈퇴 관련 상태
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)
  const [withdrawalPassword, setWithdrawalPassword] = useState('')
  const [withdrawalLoading, setWithdrawalLoading] = useState(false)
  const [withdrawalError, setWithdrawalError] = useState<string | null>(null)
  const [withdrawalSuccess, setWithdrawalSuccess] = useState<string | null>(null)

  // --- useEffect 훅: 컴포넌트 마운트 시 사용자 정보 불러오기 ---
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = sessionStorage.getItem('token')

      if (!token) {
        console.log('토큰이 없습니다. 로그인 페이지로 이동합니다.')
        navigate('/login')
        setPageLoading(false)
        return
      }

      try {
        const res = await fetch('/api/member/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!res.ok) {
          const errorText = await res.text()
          console.error('사용자 정보 가져오기 실패:', res.status, errorText)
          setPageError(`사용자 정보 로딩 실패: ${errorText || res.statusText}`)
          if (res.status === 401) {
            sessionStorage.removeItem('token')
            navigate('/login')
          }
        } else {
          const data: MemberResponseDTO = await res.json()

          setUserProfile(data)
          setUserGlobally(data) // 전역 스토어 업데이트

          // 불러온 정보로 프로필 폼 state 초기화
          setProfileFormValues({
            nickname: data.nickname || '',
            address: data.address || '',
            phoneNumber: data.phoneNumber || ''
            // 다른 필드 초기값 설정
          })
        }
      } catch (err) {
        console.error('사용자 정보 가져오는 중 네트워크 오류:', err)
        setPageError('네트워크 오류가 발생했습니다.')
      } finally {
        setPageLoading(false) // 초기 페이지 로딩 완료
      }
    }

    fetchUserProfile()
  }, [navigate, setUserGlobally])

  // --- 일반 회원 정보 폼 입력 변경 핸들러 ---
  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setProfileFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }))
    // 입력 시 관련 에러/성공 메시지 초기화
    setProfileError(null)
    setProfileSuccess(null)
  }

  // --- 비밀번호 변경 폼 입력 변경 핸들러 ---
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setPasswordFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }))
    // 입력 시 관련 에러/성공 메시지 초기화
    setPasswordError(null)
    setPasswordSuccess(null)
  }

  // --- 일반 회원 정보 업데이트 제출 핸들러 ---
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setProfileUpdateLoading(true) // 프로필 업데이트 로딩 시작
    setProfileError(null) // 에러 메시지 초기화
    setProfileSuccess(null) // 성공 메시지 초기화

    const token = sessionStorage.getItem('token')
    if (!token) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      setProfileUpdateLoading(false)
      return
    }

    // TODO: 프로필 폼 프런트 단 유효성 검사 추가

    // --- 이미지 정보 업데이트 핸들러 / 아직 구현 x  ---
    // const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    //   const file = event.target.files ? event.target.files[0] : null
    //   setSelectedFile(file) // 선택된 파일 객체를 상태에 저장

    //   if (file) {
    //     // 파일 미리보기 URL 생성 (선택 사항)
    //     const reader = new FileReader()
    //     reader.onloadend = () => {
    //       setProfilePreviewUrl(reader.result as string)
    //     }
    //     reader.readAsDataURL(file)
    //   } else {
    //     setProfilePreviewUrl(null) // 파일이 없으면 미리보기 제거
    //   }
    //   console.log('이미지 업로드', file)
    // }

    try {
      const res = await fetch('/api/member/update', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileFormValues) // 수정된 프로필 폼 값 전송
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('프로필 정보 업데이트 실패:', res.status, errorText)
        setProfileError(
          errorText || res.statusText || '프로필 정보 업데이트에 실패했습니다.'
        )
        if (res.status === 401) {
          sessionStorage.removeItem('token')
          navigate('/login')
        }
      } else {
        // 업데이트 성공 처리
        // 백엔드에서 업데이트된 사용자 정보를 반환한다면 받을 수 있습니다.
        const updatedRes = await fetch('/api/member/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (updatedRes.ok) {
          const updatedData: MemberResponseDTO = await updatedRes.json()
          console.log(
            '프로필 정보 업데이트 성공, 최신 사용자 정보 (Zustand 업데이트):',
            updatedData
          )

          setUserProfile(updatedData)
          setUserGlobally(updatedData) // ✨ Zustand 전역 스토어 업데이트

          setProfileSuccess('프로필 정보가 성공적으로 업데이트되었습니다.')
        } else {
          const errorText = await updatedRes.text()
          console.error(
            '업데이트 후 사용자 정보 다시 가져오기 실패:',
            updatedRes.status,
            errorText
          )
          setProfileError('프로필 업데이트는 성공했지만, 최신 정보 로딩에 실패했습니다.')
        }
      }
    } catch (err) {
      console.error('프로필 정보 업데이트 중 네트워크 오류:', err)
      setProfileError('프로필 정보 업데이트 중 네트워크 오류가 발생했습니다.')
    } finally {
      setProfileUpdateLoading(false) // 프로필 업데이트 로딩 완료
    }
  }

  // --- 비밀번호 변경 제출 핸들러 ---
  const handlePasswordChangeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setPasswordChangeLoading(true) // 비밀번호 변경 로딩 시작
    setPasswordError(null) // 에러 메시지 초기화
    setPasswordSuccess(null) // 성공 메시지 초기화

    const token = sessionStorage.getItem('token')
    if (!token) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      setPasswordChangeLoading(false)
      return
    }

    // --- 비밀번호 변경 폼 프런트 단 유효성 검사 ---
    if (
      !passwordFormValues.currentPassword ||
      !passwordFormValues.newPassword ||
      !passwordFormValues.confirmNewPassword
    ) {
      setPasswordError('모든 비밀번호 필드를 입력해주세요.')
      setPasswordChangeLoading(false)
      return
    }

    if (passwordFormValues.newPassword !== passwordFormValues.confirmNewPassword) {
      setPasswordError('새 비밀번호와 확인이 일치하지 않습니다.')
      setPasswordChangeLoading(false)
      return
    }

    // TODO: 새 비밀번호 복잡성 규칙 등 추가 유효성 검사

    try {
      const res = await fetch('/api/member/change-password', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordFormValues.currentPassword,
          newPassword: passwordFormValues.newPassword
        })
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('비밀번호 변경 실패:', res.status, errorText)
        setPasswordError(errorText || res.statusText || '비밀번호 변경에 실패했습니다.')
        if (res.status === 401) {
          sessionStorage.removeItem('token')
          navigate('/login')
        }
      } else {
        // 비밀번호 변경 성공 처리
        const successText = await res.text()
        console.log('비밀번호 변경 성공:', successText)
        setPasswordSuccess(successText || '비밀번호가 성공적으로 변경되었습니다.')

        // 비밀번호 폼 필드 초기화
        setPasswordFormValues({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        })

        // 성공 후 다른 페이지로 이동하거나 추가 작업 수행 가능
        // navigate('/profile-settings'); // 예시: 프로필 설정 페이지로 이동
      }
    } catch (err) {
      console.error('비밀번호 변경 중 네트워크 오류:', err)
      setPasswordError('비밀번호 변경 중 네트워크 오류가 발생했습니다.')
    } finally {
      setPasswordChangeLoading(false) // 비밀번호 변경 로딩 완료
    }
  }
  // --- 회원 탈퇴 관련 핸들러 ---
  const handleWithdrawalClick = () => {
    setShowWithdrawalModal(true) // 탈퇴 확인 모달 표시
    setWithdrawalPassword('') // 비밀번호 필드 초기화
    setWithdrawalError(null)
    setWithdrawalSuccess(null)
  }

  const handleWithdrawalModalClose = () => {
    setShowWithdrawalModal(false) // 모달 닫기
  }

  const handleWithdrawalPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWithdrawalPassword(e.target.value)
    setWithdrawalError(null)
    setWithdrawalSuccess(null)
  }

  const handleWithdrawalConfirm = async (e: React.FormEvent) => {
    e.preventDefault() // 폼 제출 기본 동작 방지

    setWithdrawalLoading(true)
    setWithdrawalError(null)
    setWithdrawalSuccess(null)

    const token = sessionStorage.getItem('token')
    if (!token) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      setWithdrawalLoading(false)
      return
    }

    if (!withdrawalPassword.trim()) {
      setWithdrawalError('비밀번호를 입력해주세요.')
      setWithdrawalLoading(false)
      return
    }

    try {
      const res = await fetch('/api/member/withdraw', {
        // 백엔드 API 경로 확인
        method: 'PUT', // 상태 변경이므로 PUT 사용
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({password: withdrawalPassword}) // 비밀번호 전송
      })

      if (!res.ok) {
        const errorData = await res.text()
        console.error('회원 탈퇴 실패:', res.status, errorData)
        setWithdrawalError(errorData || '회원 탈퇴에 실패했습니다.')
        if (res.status === 401) {
          sessionStorage.removeItem('token')
          clearUserGlobally() // 전역 스토어 사용자 정보 삭제
          navigate('/login')
        }
      } else {
        const successMessage = await res.text()
        setWithdrawalSuccess(successMessage || '회원 탈퇴가 성공적으로 처리되었습니다.')
        alert('회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.')

        // --- 탈퇴 성공 후 처리 ---
        sessionStorage.removeItem('token') // 토큰 삭제
        clearUserGlobally() // Zustand 스토어의 사용자 정보 삭제 (로그아웃 처리)
        navigate('/') // 메인 페이지나 로그아웃 페이지로 리다이렉트
      }
    } catch (err) {
      console.error('회원 탈퇴 중 네트워크 오류:', err)
      setWithdrawalError('네트워크 오류가 발생했습니다.')
    } finally {
      setWithdrawalLoading(false)
    }
  }

  // --- 렌더링 부분 ---

  // 초기 페이지 로딩 중일 때
  if (pageLoading) {
    return (
      <>
        <Header />
        <main>
          <div className="container" style={{textAlign: 'center', padding: '50px'}}>
            로딩 중...
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // 초기 페이지 로딩 에러 발생 시
  if (pageError) {
    return (
      <>
        <Header />
        <main>
          <div
            className="container"
            style={{textAlign: 'center', padding: '50px', color: 'red'}}>
            오류: {pageError}
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // 사용자 정보가 성공적으로 로드되었을 때 전체 폼 렌더링
  // userProfile이 null이 아님을 보장
  return (
    <>
      <Header />
      <main>
        {/* Breadcrumbs 등 UI 요소 */}
        <ScrollToTopButton />
        <div className="breadcrumbs">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-6 col-12">
                <div className="breadcrumbs-content">
                  <h1 className="page-title">프로필 및 보안 설정</h1>{' '}
                  {/* 통합 페이지 제목 */}
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-12">
                <ul className="breadcrumb-nav">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>프로필 및 보안 설정</li> {/* Breadcrumb */}
                </ul>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <a href="/">
                    <img
                      src="/assets/images/logo/logo.png"
                      alt="UnknownPaw"
                      style={{height: '30px'}}
                    />
                  </a>
                </li>
                <li>프로필 설정</li>
              </ul>
            </div>
          </div>
        </div>
        {/* <div className="settings-container container"> */}{' '}
        {/* 전체 설정을 위한 컨테이너 */}
        <div className="dashboard section">
          {' '}
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-4 col-12">
                <DashboardSidebar />
              </div>
              <div className="col-lg-9 col-md-8 col-12">
                {/* 이동 펫 수정 페이지로 이동  */}
                <NavLink
                  to="/profile-settings"
                  className={({isActive}) =>
                    isActive ? 'link-button active' : 'link-button'
                  }>
                  프로필 설정
                </NavLink>
                <Link to={'/pet-settings'} className="link-button">
                  pet 수정
                </Link>
                {/* --- 회원 정보 수정 블록 --- */}
                <div className="profile-settings">
                  <div className="profile-settings-block settings-box profile-settings-box">
                    {' '}
                    {/* 블록 컨테이너 */}
                    <h2>회원 정보</h2>
                    <div className="profile-image-preview">
                      <img
                        src={
                          userProfile?.profileImagePath ||
                          '/assets/images/items-grid/author-2.jpg'
                        }
                        alt="#"
                      />
                    </div>
                    <form className="profile-form" onSubmit={handleProfileSubmit}>
                      {/* 이미지 파일 업로드 공간 */}
                      <div className="form-group">
                        <label htmlFor="profileImage">프로필 이미지*</label>
                        <input
                          type="file"
                          multiple
                          id="profileImage"
                          style={{display: 'none'}}
                          // onChange={handleFileChange} // hook을 이용한 함수처리 추천
                        />
                        <label className="file-upload" htmlFor="profileImage">
                          <i className="lni lni-cloud-upload"></i> 선택된 파일 없음
                        </label>
                      </div>
                      {/* 이메일 필드 (수정 불가) */}
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="email">이메일:</label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={userProfile?.email || ''}
                              disabled
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                      {/* 닉네임 필드 (수정 가능) */}
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="nickname">닉네임:</label>
                            <input
                              type="text"
                              id="nickname"
                              name="nickname"
                              value={profileFormValues.nickname}
                              onChange={handleProfileInputChange}
                              className="form-control"
                            />
                          </div>
                        </div>
                        {/* 연락처 정보 필드 */}
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="phoneNumber">전화번호:</label>
                            <input
                              type="text"
                              id="phoneNumber"
                              name="phoneNumber"
                              value={profileFormValues.phoneNumber}
                              onChange={handleProfileInputChange}
                              className="form-control"
                            />
                          </div>
                        </div>
                        {/* 주소 정보 필드 */}
                        <div className="col-12">
                          <div className="form-group">
                            <label htmlFor="address">주소:</label>
                            <input
                              type="text"
                              id="address"
                              name="address"
                              value={profileFormValues.address}
                              onChange={handleProfileInputChange}
                              className="form-control"
                            />
                          </div>
                        </div>
                        {/* 프로필 이미지 필드 (예시) */}
                        {/* ... 이미지 업로드 필드 ... */}
                        {/* 프로필 업데이트 관련 에러/성공 메시지 */}
                        {profileError && (
                          <div
                            className="alert alert-danger"
                            role="alert"
                            style={{color: 'red', marginTop: '10px'}}>
                            {profileError}
                          </div>
                        )}
                        {profileSuccess && (
                          <div
                            className="alert alert-success"
                            role="alert"
                            style={{color: 'green', marginTop: '10px'}}>
                            {profileSuccess}
                          </div>
                        )}
                        {/* 정보 업데이트 버튼 */}
                        <div className="col-12">
                          <button
                            type="submit"
                            className="update-profile-btn"
                            disabled={profileUpdateLoading}>
                            {profileUpdateLoading ? '업데이트 중...' : '정보 업데이트'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                {/* --- 비밀번호 변경 블록 --- */}
                {/* 별도의 블록으로 구분 */}
                <div className="password-change">
                  <div
                    className="password-change-block settings-box profile-settings-box"
                    style={{marginTop: '40px'}}>
                    {' '}
                    {/* 상단 여백 추가 */}
                    <h2>비밀번호 변경</h2>
                  </div>
                  <form
                    className="password-change-form"
                    onSubmit={handlePasswordChangeSubmit}>
                    {/* 현재 비밀번호 필드 */}
                    <div className="form-group">
                      <label htmlFor="currentPassword">현재 비밀번호:</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordFormValues.currentPassword}
                        onChange={handlePasswordInputChange}
                        className="form-control"
                        required
                      />
                    </div>

                    {/* 새로운 비밀번호 필드 */}
                    <div className="form-group">
                      <label htmlFor="newPassword">새로운 비밀번호:</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordFormValues.newPassword}
                        onChange={handlePasswordInputChange}
                        className="form-control"
                        required
                      />
                    </div>

                    {/* 새로운 비밀번호 확인 필드 */}
                    <div className="form-group">
                      <label htmlFor="confirmNewPassword">새로운 비밀번호 확인:</label>
                      <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={passwordFormValues.confirmNewPassword}
                        onChange={handlePasswordInputChange}
                        className="form-control"
                        required
                      />
                    </div>

                    {/* 비밀번호 변경 관련 에러/성공 메시지 */}
                    {passwordError && (
                      <div
                        className="alert alert-danger"
                        role="alert"
                        style={{color: 'red', marginTop: '10px'}}>
                        {passwordError}
                      </div>
                    )}
                    {passwordSuccess && (
                      <div
                        className="alert alert-success"
                        role="alert"
                        style={{color: 'green', marginTop: '10px'}}>
                        {passwordSuccess}
                      </div>
                    )}

                    {/* 제출 버튼 */}
                    <button
                      type="submit"
                      className="update-password-btn"
                      disabled={passwordChangeLoading}>
                      {passwordChangeLoading ? '변경 중...' : '비밀번호 변경'}
                    </button>
                  </form>
                </div>

                {/* --- 회원 탈퇴 블록 --- */}

                <div className="withdrawal-section">
                  <div
                    className="settings-box profile-settings"
                    style={{marginTop: '40px'}}>
                    <div
                      className="password-change-block settings-box profile-settings-box"
                      style={{marginTop: '40px'}}></div>
                    <h2>회원 탈퇴</h2>
                    <p>
                      더 이상 서비스를 이용하지 않으시려면 아래 버튼을 클릭하여 회원
                      탈퇴를 진행할 수 있습니다. 탈퇴 후에는 계정 복구가 어려울 수
                      있습니다.
                    </p>
                    <button
                      type="button"
                      className="btn btn-danger" // 부트스트랩 클래스 또는 직접 스타일링
                      onClick={handleWithdrawalClick}
                      style={{padding: '10px 20px', fontSize: '16px'}}>
                      회원 탈퇴
                    </button>
                  </div>
                </div>

                {/* --- 회원 탈퇴 확인 모달 (조건부 렌더링) --- */}
                {showWithdrawalModal && (
                  <div className="settings-header profile-header">
                    <div className="modal-overlay ">
                      {' '}
                      {/* 모달 오버레이 스타일링 필요 */}
                      <div className="modal-content">
                        {' '}
                        {/* 모달 내용 스타일링 필요 */}
                        <h3>회원 탈퇴 확인</h3>
                        <p>
                          정말로 회원 탈퇴를 진행하시겠습니까? 탈퇴하시면 모든 정보가 삭제
                          처리되며, 복구되지 않을 수 있습니다.
                        </p>
                        <form onSubmit={handleWithdrawalConfirm}>
                          <PasswordInput
                            id="withdrawalPassword"
                            name="withdrawalPassword"
                            value={withdrawalPassword}
                            onChange={handleWithdrawalPasswordChange}
                            label="확인을 위해 비밀번호를 입력해주세요"
                            required={true}
                          />
                          {withdrawalError && (
                            <div
                              className="alert alert-danger"
                              style={{color: 'red', marginTop: '10px'}}>
                              {withdrawalError}
                            </div>
                          )}
                          {withdrawalSuccess && (
                            <div
                              className="alert alert-success"
                              style={{color: 'green', marginTop: '10px'}}>
                              {withdrawalSuccess}
                            </div>
                          )}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              gap: '10px',
                              marginTop: '20px'
                            }}>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={handleWithdrawalModalClose}
                              disabled={withdrawalLoading}>
                              취소
                            </button>
                            <button
                              type="submit"
                              className="btn btn-danger"
                              disabled={withdrawalLoading}>
                              {withdrawalLoading ? '탈퇴 처리 중...' : '확인 및 탈퇴'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
