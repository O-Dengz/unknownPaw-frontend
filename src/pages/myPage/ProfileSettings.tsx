import {useState} from 'react'
import './myPage.css'
import {DashboardSidebar} from '../../components/DashboardSidebar'

export function ProfileSettings() {
  const [formData, setFormData] = useState({
    nickname: '',
    phoneNumber: '',
    address: '',
    profileImage: null as File | null
  })

  const [petData, setPetData] = useState({
    petName: '',
    breed: '',
    petBirth: new Date().getFullYear(),
    petGender: true,
    weight: 0,
    petMbti: '',
    neutering: false,
    petIntroduce: '',
    petImage: null as File | null
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    retypePassword: ''
  })

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 프로필 업데이트 로직 구현
  }

  const handlePetProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 펫 프로필 업데이트 로직 구현
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 비밀번호 변경 로직 구현
  }

  const handleDeleteAccount = () => {
    // 회원 탈퇴 로직 구현
    console.log('회원 탈퇴 처리')
    setShowDeleteModal(false)
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'profile' | 'pet'
  ) => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'profile') {
        setFormData(prev => ({
          ...prev,
          profileImage: e.target.files![0]
        }))
      } else {
        setPetData(prev => ({
          ...prev,
          petImage: e.target.files![0]
        }))
      }
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePetInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target
    setPetData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div>
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">프로필 설정</h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <a href="/">
                    <img src="/assets/images/logo/logo.png" alt="UnknownPaw" style={{ height: '30px' }} />
                  </a>
                </li>
                <li>프로필 설정</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-12">
              <DashboardSidebar />
            </div>
            <div className="col-lg-9 col-md-8 col-12">
              <div className="profile-settings">
                <h2>프로필 설정</h2>
                <form onSubmit={handleProfileSubmit}>
                  <div className="profile-image-preview">
                    <img src="/assets/images/items-grid/author-2.jpg" alt="Profile" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="profileImage">프로필 이미지*</label>
                    <label className="file-upload" htmlFor="profileImage">
                      <i className="lni lni-cloud-upload"></i> 선택된 파일 없음
                    </label>
                    <input
                      id="profileImage"
                      type="file"
                      multiple
                      onChange={e => handleFileChange(e, 'profile')}
                      accept="image/*"
                    />
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>닉네임*</label>
                        <input
                          type="text"
                          name="nickname"
                          value={formData.nickname}
                          onChange={handleInputChange}
                          placeholder="닉네임을 입력하세요"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>전화번호</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="전화번호를 입력하세요"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label>주소</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="주소를 입력하세요"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="update-profile-btn">
                        프로필 업데이트
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="pet-profile-settings">
                <h2>반려견 프로필 설정</h2>
                <form onSubmit={handlePetProfileSubmit}>
                  <div className="pet-profile-image-preview">
                    <img src="/assets/images/pet/dog-1.jpg" alt="Pet Profile" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="petImage">강아지 사진*</label>
                    <label className="file-upload" htmlFor="petImage">
                      <i className="lni lni-cloud-upload"></i> 선택된 파일 없음
                    </label>
                    <input
                      id="petImage"
                      type="file"
                      multiple
                      onChange={e => handleFileChange(e, 'pet')}
                      accept="image/*"
                    />
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>강아지 이름*</label>
                        <input
                          type="text"
                          name="petName"
                          value={petData.petName}
                          onChange={handlePetInputChange}
                          placeholder="Enter pet name"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>종*</label>
                        <input
                          type="text"
                          name="breed"
                          value={petData.breed}
                          onChange={handlePetInputChange}
                          placeholder="Enter breed"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>태어난 연도*</label>
                        <input
                          type="number"
                          name="petBirth"
                          value={petData.petBirth}
                          onChange={handlePetInputChange}
                          placeholder="Enter birth year"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>몸무게 (kg)*</label>
                        <input
                          type="number"
                          name="weight"
                          value={petData.weight}
                          onChange={handlePetInputChange}
                          placeholder="Enter weight"
                          step="0.1"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="toggle-group">
                        <label>성별*</label>
                        <div className="toggle-buttons">
                          <button
                            type="button"
                            className={`toggle-button ${
                              petData.petGender ? 'active' : ''
                            }`}
                            onClick={() =>
                              setPetData(prev => ({...prev, petGender: true}))
                            }>
                            수컷
                          </button>
                          <button
                            type="button"
                            className={`toggle-button ${
                              !petData.petGender ? 'active' : ''
                            }`}
                            onClick={() =>
                              setPetData(prev => ({...prev, petGender: false}))
                            }>
                            암컷
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="toggle-group">
                        <label>중성화 여부*</label>
                        <div className="toggle-buttons">
                          <button
                            type="button"
                            className={`toggle-button ${
                              petData.neutering ? 'active' : ''
                            }`}
                            onClick={() =>
                              setPetData(prev => ({...prev, neutering: true}))
                            }>
                            Yes
                          </button>
                          <button
                            type="button"
                            className={`toggle-button ${
                              !petData.neutering ? 'active' : ''
                            }`}
                            onClick={() =>
                              setPetData(prev => ({...prev, neutering: false}))
                            }>
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label>강아지 MBTI*</label>
                        <input
                          type="text"
                          name="petMbti"
                          value={petData.petMbti}
                          onChange={handlePetInputChange}
                          placeholder="Enter pet MBTI"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label>강아지 소개*</label>
                        <textarea
                          name="petIntroduce"
                          value={petData.petIntroduce}
                          onChange={handlePetInputChange}
                          placeholder="Enter about your pet"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="update-profile-btn">
                        펫 프로필 업데이트
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              {/* change password */}
              <div className="password-change">
                <h2>비밀번호 변경</h2>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>현재 비밀번호*</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="현재 비밀번호를 입력하세요"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>새 비밀번호*</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="새 비밀번호를 입력하세요"
                    />
                  </div>
                  <div className="form-group">
                    <label>비밀번호 확인*</label>
                    <input
                      type="password"
                      name="retypePassword"
                      value={passwordData.retypePassword}
                      onChange={handlePasswordChange}
                      placeholder="비밀번호를 다시 입력하세요"
                    />
                  </div>
                  <button type="submit" className="update-password-btn">
                    비밀번호 변경
                  </button>
                </form>
              </div>

              {/* 회원 탈퇴 섹션 */}
              <div className="delete-account-section">
                <h2>회원 탈퇴</h2>
                <p className="warning-text">
                  회원 탈퇴 시 모든 개인정보와 서비스 이용 기록이 삭제되며, 복구가
                  불가능합니다.
                  <br />
                  탈퇴 전 반려동물 관련 예약 내역과 결제 내역을 확인해 주세요.
                </p>
                <button
                  className="delete-account-btn"
                  onClick={() => setShowDeleteModal(true)}>
                  회원 탈퇴하기
                </button>
              </div>

              {/* 회원 탈퇴 확인 모달 */}
              {showDeleteModal && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>회원 탈퇴 확인</h3>
                    <p>정말로 탈퇴하시겠습니까?</p>
                    <p className="modal-warning">
                      탈퇴 시 모든 개인정보와 서비스 이용 기록이 삭제되며, 복구가
                      불가능합니다.
                      <br />
                      진행 중인 예약이 있다면 먼저 취소해 주세요.
                    </p>
                    <div className="modal-buttons">
                      <button
                        className="modal-btn cancel"
                        onClick={() => setShowDeleteModal(false)}>
                        취소
                      </button>
                      <button className="modal-btn confirm" onClick={handleDeleteAccount}>
                        탈퇴하기
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
  )
}
