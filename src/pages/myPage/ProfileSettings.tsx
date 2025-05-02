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
                  <a href="/">홈</a>
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
                <h2>Pet Profile Settings</h2>
                <form onSubmit={handlePetProfileSubmit}>
                  <div className="pet-profile-image-preview">
                    <img src="/assets/images/pet/dog-1.jpg" alt="Pet Profile" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="petImage">Pet Image*</label>
                    <label className="file-upload" htmlFor="petImage">
                      <i className="lni lni-cloud-upload"></i> 선택된 파일 없음
                    </label>
                    <input
                      id="petImage"
                      type="file"
                      onChange={e => handleFileChange(e, 'pet')}
                      accept="image/*"
                    />
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Pet Name*</label>
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
                        <label>Breed*</label>
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
                        <label>Birth Year*</label>
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
                        <label>Weight (kg)*</label>
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
                        <label>Gender*</label>
                        <div className="toggle-buttons">
                          <button
                            type="button"
                            className={`toggle-button ${
                              petData.petGender ? 'active' : ''
                            }`}
                            onClick={() =>
                              setPetData(prev => ({...prev, petGender: true}))
                            }>
                            Male
                          </button>
                          <button
                            type="button"
                            className={`toggle-button ${
                              !petData.petGender ? 'active' : ''
                            }`}
                            onClick={() =>
                              setPetData(prev => ({...prev, petGender: false}))
                            }>
                            Female
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="toggle-group">
                        <label>Neutering*</label>
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
                        <label>Pet MBTI*</label>
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
                        <label>Pet Introduction*</label>
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
                        Update Pet Profile
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
