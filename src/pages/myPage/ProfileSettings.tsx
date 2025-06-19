import React, {useState, useEffect, ChangeEvent} from 'react'
import {useNavigate, Link, NavLink} from 'react-router-dom'
import Header from '@/components/Layout/Header'
import {Footer} from '@/components/Layout/Footer'
import {DashboardSidebar} from '@/components/features/dashboard/DashboardSidebar'
import './ProfileSettings.css'
import {useUserStore} from '../../store/userStore'
import {PasswordInput} from '../../components/PasswordInput'
import ScrollToTopButton from '../../components/ScrollToTopButton'
import {EyeIcon} from 'lucide-react'
import {EyeSlashIcon} from '@heroicons/react/24/outline'
import {getImageUrl} from '@/utils/getImageUrl'

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

export function ProfileSettings() {
  const navigate = useNavigate()
  const setUserGlobally = useUserStore(state => state.setUser)
  const clearUserGlobally = useUserStore(state => state.clearUser)
  const imgUrl = (p?: string | null) =>
    p && p.trim() ? `/api/members/image/${p}` : '/assets/images/items-grid/author-2.jpg'

  const [userProfile, setUserProfile] = useState<MemberResponseDTO | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [profileFormValues, setProfileFormValues] = useState({
    nickname: '',
    address: '',
    phoneNumber: ''
  })

  const [passwordFormValues, setPasswordFormValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(null)
  const [profileImageUploading, setProfileImageUploading] = useState(false)
  const [profileImageError, setProfileImageError] = useState<string | null>(null)

  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)
  const [withdrawalPassword, setWithdrawalPassword] = useState('')
  const [withdrawalLoading, setWithdrawalLoading] = useState(false)
  const [withdrawalError, setWithdrawalError] = useState<string | null>(null)
  const [withdrawalSuccess, setWithdrawalSuccess] = useState<string | null>(null)

  // ⭐ 전화번호 중복 확인 관련 상태 추가
  const [phoneNumberDuplicationError, setPhoneNumberDuplicationError] = useState<
    string | null
  >(null)
  const [isPhoneNumberChecked, setIsPhoneNumberChecked] = useState(false) // 전화번호 중복 확인 완료 여부

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
          setUserGlobally(data)

          setProfileFormValues({
            nickname: data.nickname || '',
            address: data.address || '',
            phoneNumber: data.phoneNumber || ''
          })
          // ⭐ 초기 로딩 시 전화번호가 있으면 일단 확인 완료 상태로 설정 (원래 번호니까)
          setIsPhoneNumberChecked(true)
        }
      } catch (err) {
        console.error('사용자 정보 가져오는 중 네트워크 오류:', err)
        setPageError('네트워크 오류가 발생했습니다.')
      } finally {
        setPageLoading(false)
      }
    }

    fetchUserProfile()
  }, [navigate, setUserGlobally])

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setProfileFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }))
    setProfileError(null)
    setProfileSuccess(null)

    // ⭐ 전화번호가 변경될 경우 중복 확인 상태 초기화
    if (name === 'phoneNumber') {
      setPhoneNumberDuplicationError(null)
      setIsPhoneNumberChecked(false)
    }
  }

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setPasswordFormValues(prev => ({...prev, [name]: value}))
  }

  const togglePasswordVisibility = (fieldName: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }))
  }

  // ⭐ 전화번호 중복 확인 함수 추가
  const checkPhoneNumberDuplication = async () => {
    const phoneNumber = profileFormValues.phoneNumber.trim()

    // 현재 사용자의 전화번호와 동일하면 중복 확인 불필요
    if (userProfile && userProfile.phoneNumber === phoneNumber) {
      setPhoneNumberDuplicationError(null)
      setIsPhoneNumberChecked(true)
      return
    }

    // 유효성 검사 (간단한 예시, 필요시 더 복잡한 정규식 추가)
    if (!phoneNumber || !/^\d{2,3}-\d{3,4}-\d{4}$/.test(phoneNumber)) {
      setPhoneNumberDuplicationError(
        '유효한 전화번호 형식이 아닙니다. (예: 010-1234-5678)'
      )
      setIsPhoneNumberChecked(false)
      return
    }

    setPhoneNumberDuplicationError(null)
    setIsPhoneNumberChecked(false) // 확인 중임을 표시

    try {
      // 백엔드 API 경로 확인: /api/member/check-phone
      const res = await fetch(`/api/member/check-phone?phoneNumber=${phoneNumber}`)
      const data = await res.json()

      if (data.exists) {
        // 백엔드 응답이 { exists: true/false } 형태라고 가정
        setPhoneNumberDuplicationError('이미 사용 중인 전화번호입니다.')
        setIsPhoneNumberChecked(false)
      } else {
        setPhoneNumberDuplicationError(null)
        setIsPhoneNumberChecked(true) // 중복 아님 확인 완료
      }
    } catch (error) {
      console.error('전화번호 중복 확인 중 네트워크 오류:', error)
      setPhoneNumberDuplicationError(
        '전화번호 중복 확인 중 네트워크 오류가 발생했습니다.'
      )
      setIsPhoneNumberChecked(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setProfileUpdateLoading(true)
    setProfileError(null)
    setProfileSuccess(null)

    const token = sessionStorage.getItem('token')
    if (!token) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      setProfileUpdateLoading(false)
      return
    }

    // ⭐ 전화번호 중복 확인 여부 검사 (수정된 경우만)
    // 현재 전화번호가 변경되었고, 중복 확인이 완료되지 않았거나 중복인 경우 업데이트를 막습니다.
    if (
      userProfile?.phoneNumber !== profileFormValues.phoneNumber &&
      !isPhoneNumberChecked
    ) {
      setProfileError('전화번호 중복 확인을 완료해주세요.')
      setProfileUpdateLoading(false)
      return
    }
    if (
      userProfile?.phoneNumber !== profileFormValues.phoneNumber &&
      phoneNumberDuplicationError
    ) {
      setProfileError('중복된 전화번호이거나 유효하지 않은 전화번호입니다. 확인해주세요.')
      setProfileUpdateLoading(false)
      return
    }

    try {
      const res = await fetch('/api/member/update', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileFormValues)
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
          updatedData.profileImagePath = imgUrl(updatedData.profileImagePath)
          setUserProfile(updatedData)
          setUserGlobally(updatedData)
          setProfileSuccess('프로필 정보가 성공적으로 업데이트되었습니다.')
          // ⭐ 업데이트 성공 시 전화번호 중복 확인 상태 다시 초기화 (새로운 번호가 현재 번호가 됨)
          setIsPhoneNumberChecked(true)
          setPhoneNumberDuplicationError(null) // 혹시 남아있을 에러 메시지 초기화
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
      setProfileUpdateLoading(false)
    }
  }

  const handlePasswordChangeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setPasswordChangeLoading(true)
    setPasswordError(null)
    setPasswordSuccess(null)

    const token = sessionStorage.getItem('token')
    if (!token) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      setPasswordChangeLoading(false)
      return
    }

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
        const successText = await res.text()
        console.log('비밀번호 변경 성공:', successText)
        setPasswordSuccess(successText || '비밀번호가 성공적으로 변경되었습니다.')

        setPasswordFormValues({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        })
      }
    } catch (err) {
      console.error('비밀번호 변경 중 네트워크 오류:', err)
      setPasswordError('비밀번호 변경 중 네트워크 오류가 발생했습니다.')
    } finally {
      setPasswordChangeLoading(false)
    }
  }
  const handleWithdrawalClick = () => {
    setShowWithdrawalModal(true)
    setWithdrawalPassword('')
    setWithdrawalError(null)
    setWithdrawalSuccess(null)
  }

  const handleWithdrawalModalClose = () => {
    setShowWithdrawalModal(false)
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    // (1-1) 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setProfileImageError('10MB 이하의 이미지만 업로드 가능합니다.')
      setSelectedFile(null)
      setProfilePreviewUrl(null)
      return
    }
    setSelectedFile(file)
    setProfilePreviewUrl(URL.createObjectURL(file))
    setProfileImageError(null)
  }

  const handleProfileImageUpload = async () => {
    if (!selectedFile || !userProfile) return
    setProfileImageUploading(true)
    setProfileImageError(null)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('targetId', String(userProfile.mid))

      const res = await fetch('/api/members/image/upload', {
        method: 'POST',
        body: formData,
        headers: {Authorization: `Bearer ${sessionStorage.getItem('token')}`}
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }

      // 업로드 성공 후 최신 프로필 정보 다시 불러오기
      const token = sessionStorage.getItem('token')
      const updatedRes = await fetch('/api/member/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (updatedRes.ok) {
        const updatedData: MemberResponseDTO = await updatedRes.json()
        // profileImagePath가 이미 member/filename.jpg 형태로 오는지 확인
        console.log('Updated profile data:', updatedData) // 디버깅용
        setUserProfile(updatedData)
        setUserGlobally(updatedData)
        setProfileSuccess('프로필 이미지가 업데이트되었습니다!')
      } else {
        setProfileSuccess('이미지는 업로드됐지만, 최신 정보 로딩에 실패했습니다.')
      }

      setProfileImageError(null)
      setSelectedFile(null)
      setProfilePreviewUrl(null)
    } catch (err: any) {
      setProfileImageError(err.message || '이미지 업로드 중 오류가 발생했습니다.')
    } finally {
      setProfileImageUploading(false)
    }
  }

  const handleWithdrawalPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWithdrawalPassword(e.target.value)
    setWithdrawalError(null)
    setWithdrawalSuccess(null)
  }

  const handleWithdrawalConfirm = async (e: React.FormEvent) => {
    e.preventDefault()

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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({password: withdrawalPassword})
      })

      if (!res.ok) {
        const errorData = await res.text()
        console.error('회원 탈퇴 실패:', res.status, errorData)
        setWithdrawalError(errorData || '회원 탈퇴에 실패했습니다.')
        if (res.status === 401) {
          sessionStorage.removeItem('token')
          clearUserGlobally()
          navigate('/login')
        }
      } else {
        const successMessage = await res.text()
        setWithdrawalSuccess(successMessage || '회원 탈퇴가 성공적으로 처리되었습니다.')
        alert('회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.')

        sessionStorage.removeItem('token')
        clearUserGlobally()
        navigate('/')
      }
    } catch (err) {
      console.error('회원 탈퇴 중 네트워크 오류:', err)
      setWithdrawalError('네트워크 오류가 발생했습니다.')
    } finally {
      setWithdrawalLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{textAlign: 'center', padding: '50px'}}>
          로딩 중...
        </div>
      </div>
    )
  }

  if (pageError) {
    return (
      <div className="page-wrapper">
        <div
          className="container"
          style={{textAlign: 'center', padding: '50px', color: 'red'}}>
          오류: {pageError}
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <Header />
      <div className="dashboard section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-12">
              <DashboardSidebar />
            </div>
            <div className="col-lg-9 col-md-8 col-12">
              <div className="profile-settings-container">
                <div className="profile-header">
                  <div className="profile-image-container">
                    <img
                      src={profilePreviewUrl || imgUrl(userProfile?.profileImagePath)}
                      alt="Profile"
                      className="profile-image"
                    />
                    <label className="profile-image-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        style={{display: 'none'}}
                      />
                      {profileImageUploading ? '업로드 중...' : '이미지 변경'}
                    </label>
                  </div>
                  <div className="profile-info">
                    <h1>{userProfile?.nickname}</h1>
                    <p>{userProfile?.email}</p>
                    <p>평판: {userProfile?.pawRate || 0}</p>
                  </div>
                </div>

                <div className="settings-section">
                  <h2>프로필 정보</h2>
                  <form onSubmit={handleProfileSubmit}>
                    <div className="form-group">
                      <label htmlFor="nickname">닉네임</label>
                      <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        className="form-control"
                        value={profileFormValues.nickname}
                        onChange={handleProfileInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="address">주소</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        className="form-control"
                        value={profileFormValues.address}
                        onChange={handleProfileInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phoneNumber">전화번호</label>
                      <div className="phone-input-group">
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          className={`form-control ${phoneNumberDuplicationError ? 'error' : ''}`}
                          value={profileFormValues.phoneNumber}
                          onChange={handleProfileInputChange}
                          placeholder="010-0000-0000"
                        />
                        <button
                          type="button"
                          className={`phone-check-button ${isPhoneNumberChecked ? 'checked' : ''}`}
                          onClick={checkPhoneNumberDuplication}
                        >
                          {isPhoneNumberChecked ? '확인완료' : '중복확인'}
                        </button>
                      </div>
                      {phoneNumberDuplicationError && (
                        <div className="error-message phone-check-message">{phoneNumberDuplicationError}</div>
                      )}
                    </div>

                    {profileError && <div className="error-message">{profileError}</div>}
                    {profileSuccess && <div className="success-message">{profileSuccess}</div>}

                    <div className="button-group">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={profileUpdateLoading}
                      >
                        {profileUpdateLoading ? '저장 중...' : '저장하기'}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="settings-section">
                  <h2>비밀번호 변경</h2>
                  <form onSubmit={handlePasswordChangeSubmit}>
                    <div className="form-group">
                      <label htmlFor="currentPassword">현재 비밀번호</label>
                      <div style={{position: 'relative'}}>
                        <input
                          type={showPasswords.currentPassword ? 'text' : 'password'}
                          id="currentPassword"
                          name="currentPassword"
                          className="form-control"
                          value={passwordFormValues.currentPassword}
                          onChange={handlePasswordInputChange}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('currentPassword')}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {showPasswords.currentPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="newPassword">새 비밀번호</label>
                      <div style={{position: 'relative'}}>
                        <input
                          type={showPasswords.newPassword ? 'text' : 'password'}
                          id="newPassword"
                          name="newPassword"
                          className="form-control"
                          value={passwordFormValues.newPassword}
                          onChange={handlePasswordInputChange}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('newPassword')}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {showPasswords.newPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmNewPassword">새 비밀번호 확인</label>
                      <div style={{position: 'relative'}}>
                        <input
                          type={showPasswords.confirmNewPassword ? 'text' : 'password'}
                          id="confirmNewPassword"
                          name="confirmNewPassword"
                          className="form-control"
                          value={passwordFormValues.confirmNewPassword}
                          onChange={handlePasswordInputChange}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirmNewPassword')}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {showPasswords.confirmNewPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {passwordError && <div className="error-message">{passwordError}</div>}
                    {passwordSuccess && <div className="success-message">{passwordSuccess}</div>}

                    <div className="button-group">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={passwordChangeLoading}
                      >
                        {passwordChangeLoading ? '변경 중...' : '비밀번호 변경'}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="settings-section">
                  <h2>계정 관리</h2>
                  <div className="button-group">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleWithdrawalClick}
                    >
                      회원 탈퇴
                    </button>
                  </div>
                </div>

                {showWithdrawalModal && (
                  <div className="modal">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h3>회원 탈퇴</h3>
                      </div>
                      <div className="modal-body">
                        <p>정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
                        <div className="form-group">
                          <label htmlFor="withdrawalPassword">비밀번호 확인</label>
                          <input
                            type="password"
                            id="withdrawalPassword"
                            className="form-control"
                            value={withdrawalPassword}
                            onChange={handleWithdrawalPasswordChange}
                          />
                        </div>
                        {withdrawalError && (
                          <div className="error-message">{withdrawalError}</div>
                        )}
                        {withdrawalSuccess && (
                          <div className="success-message">{withdrawalSuccess}</div>
                        )}
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleWithdrawalModalClose}
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={handleWithdrawalConfirm}
                          disabled={withdrawalLoading}
                        >
                          {withdrawalLoading ? '처리 중...' : '탈퇴하기'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
