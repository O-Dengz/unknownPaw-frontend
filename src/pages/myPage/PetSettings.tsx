// ------------ 펫 정보 수정 페이지 ------------
import React, {useState, useEffect} from 'react'
import {useNavigate, Link, useLocation, NavLink} from 'react-router-dom' // Link 추가
import Header from '../../components/common/Header' // Header 컴포넌트 import
import Footer from '../../components/common/Footer' // Footer 컴포넌트 import
import {DashboardSidebar} from '../../components/DashboardSidebar'
import toast, {Toaster} from 'react-hot-toast'
import ScrollToTopButton from '../../components/ScrollToTopButton'

// npm install react-hot-toast <- ❗❗❗ 설치하세요

// PetDTO 구조에 맞게 인터페이스 정의 (백엔드 PetDTO와 일치해야 함)
interface PetDTO {
  petId: number
  petName: string
  breed: string
  petBirth: number
  petGender: boolean // true/false
  weight: number
  petMbti: string
  neutering: boolean // true/false
  petIntroduce: string
  regDate: string // 또는 Date 타입
  modDate?: string // 또는 Date 타입
}

export function PetSettings() {
  // 예시 컴포넌트 이름
  const navigate = useNavigate()
  const [pets, setPets] = useState<PetDTO[]>([]) // 펫 목록을 저장할 state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // --- useEffect 훅: 컴포넌트 마운트 시 펫 목록 불러오기 ---
  useEffect(() => {
    const fetchPetList = async () => {
      const token = sessionStorage.getItem('token') // 로그인 시 저장한 토큰 가져오기

      if (!token) {
        console.log('토큰이 없습니다. 로그인 페이지로 이동합니다.')
        // 토큰이 없으면 로그인 페이지로 리다이렉트
        navigate('/login')
        setLoading(false)
        return
      }

      try {
        const res = await fetch('/api/pet/me', {
          // 백엔드 펫 목록 조회 엔드포인트
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // 토큰을 Authorization 헤더에 포함
            'Content-Type': 'application/json'
          }
        })

        if (!res.ok) {
          const errorText = await res.text()
          console.error('펫 목록 가져오기 실패:', res.status, errorText)
          setError(`펫 목록 로딩 실패: ${errorText || res.statusText}`)

          // 토큰이 유효하지 않은 경우 (예: 401 응답) 로그아웃 처리 및 리다이렉트
          if (res.status === 401) {
            sessionStorage.removeItem('token')
            navigate('/login')
          }
        } else {
          const data: PetDTO[] = await res.json() // 응답 데이터를 PetDTO 배열로 파싱
          // console.log('불러온 펫 목록:', data)
          setPets(data) // state에 펫 목록 저장
        }
      } catch (err) {
        console.error('펫 목록 가져오는 중 네트워크 오류:', err)
        setError('펫 목록 로딩 중 네트워크 오류가 발생했습니다.')
      } finally {
        setLoading(false) // 로딩 완료
      }
    }

    fetchPetList() // 컴포넌트 마운트 시 PetSettings 함수 실행
  }, [navigate]) // navigate 함수는 변경되지 않지만, ESLint 경고를 피하기 위해 의존성 배열에 포함

  // --- 펫 정보 입력 변경 핸들러 ---
  // 특정 펫의 특정 필드 값이 변경될 때 호출됩니다.
  const handlePetInputChange = (petId: number, fieldName: keyof PetDTO, value: any) => {
    setPets(prevPets =>
      prevPets.map(pet => (pet.petId === petId ? {...pet, [fieldName]: value} : pet))
    )
  }

  // --- 펫 정보 업데이트 핸들러 ---
  // 특정 펫의 업데이트 버튼 클릭 시 호출됩니다.
  const handleUpdatePet = async (petId: number) => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }

    // 업데이트할 펫 정보를 pets state에서 찾습니다.
    const petToUpdate = pets.find(pet => pet.petId === petId)

    if (!petToUpdate) {
      alert('업데이트할 펫 정보를 찾을 수 없습니다.')
      return
    }

    // TODO: 프런트 단 유효성 검사 추가 (예: 필수 필드 확인 등)

    try {
      const res = await fetch(`/api/pet/${petId}`, {
        // 백엔드 펫 업데이트 엔드포인트
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(petToUpdate) // 수정된 펫 정보 전송 (PetUpdateRequestDTO 구조와 일치해야 함)
      })

      if (!res.ok) {
        const errorText = await res.text()
        alert(
          `펫 정보 업데이트 실패: ${petToUpdate.petName} - ${errorText || res.statusText}`
        )
        if (res.status === 401) {
          sessionStorage.removeItem('token')
          navigate('/login')
        }
      } else {
        // 업데이트 성공 처리
        // 백엔드에서 업데이트된 펫 정보를 반환한다면 받을 수 있습니다.
        // const updatedPetData: PetDTO = await res.json();
        // alert(`${petToUpdate.petName} 정보가 성공적으로 업데이트되었습니다.`)
        toast.success(`정보가 성공적으로 업데이트되었습니다.`)
      }
    } catch (err) {
      console.error(`펫 정보 업데이트 중 네트워크 오류: ${petToUpdate.petName} - `, err)
      alert(`펫 정보 업데이트 중 네트워크 오류가 발생했습니다: ${petToUpdate.petName}`)
    }
  }

  // --- 펫 삭제 핸들러 ---
  const handleDeletePet = async (petId: number, petName: string) => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }

    // 사용자에게 정말 삭제할 것인지 확인
    if (!window.confirm(`${petName}을(를) 정말로 삭제하시겠습니까?`)) {
      return // 사용자가 취소하면 함수 종료
    }

    try {
      // TODO: 펫 삭제 API 엔드포인트로 변경하세요
      // 보통 DELETE 요청을 사용하며, 경로 변수로 petId를 넘깁니다.
      const response = await fetch(`/api/pet/${petId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert(`${petName}이(가) 성공적으로 삭제되었습니다.`)
        // 삭제 성공 시, UI에서 해당 펫을 제거하여 즉시 반영
        setPets(prevPets => prevPets.filter(pet => pet.petId !== petId))
      } else {
        const errorData = await response.text() // 또는 response.json()
        console.error('펫 삭제 실패:', response.status, errorData)
        alert(`펫 삭제에 실패했습니다: ${errorData || response.statusText}`)
      }
    } catch (error) {
      console.error('펫 삭제 중 네트워크 오류:', error)
      alert('펫 삭제 중 오류가 발생했습니다.')
    }
  }

  // --- 렌더링 부분 ---

  // 로딩 중일 때
  if (loading) {
    return (
      <>
        <Header />
        <main>
          <div className="container" style={{textAlign: 'center', padding: '50px'}}>
            펫 목록 로딩 중...
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // 에러 발생 시
  if (error) {
    return (
      <>
        <Header />
        <main>
          <div
            className="container"
            style={{textAlign: 'center', padding: '50px', color: 'red'}}>
            오류: {error}
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <ScrollToTopButton />
      <Header />
      <main>
        {/* Breadcrumbs 등 UI 요소 */}
        <div className="breadcrumbs">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-6 col-12">
                <div className="breadcrumbs-content">
                  <h1 className="page-title">나의 펫 정보</h1> {/* 페이지 제목 변경 */}
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-12">
                <ul className="breadcrumb-nav">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>나의 펫 정보</li> {/* Breadcrumb 변경 */}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Toaster
          position="top-center" // 또는 'bottom-right' 등 원하는 위치
          reverseOrder={false}
        />
        <div className="dashbard selection">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-4 col-12">
                <DashboardSidebar />
              </div>

              <div className="col-lg-9 col-md-8 col-12">
                <Link className="link-button" to={'/profile-settings'}>
                  프로필 설정
                </Link>
                <NavLink
                  to="/pet-settings"
                  className={({isActive}) =>
                    isActive ? 'link-button active' : 'link-button'
                  }>
                  pet 수정
                </NavLink>

                <div className="profile-settings">
                  {/* 펫 목록을 위한 컨테이너 */}
                  {pets.length > 0 ? (
                    pets.map(pet => (
                      // 각 펫 정보를 위한 박스/폼 형태
                      <div key={pet.petId} className="pet-info profile-one-box">
                        <div className="profile-settings-block settings-box profile-settings-box ">
                          {/* 블록 컨테이너 */}
                          <h2>나의 반려견 정보</h2>
                          <div className="profile-image-preview ">
                            <img
                              src={
                                // 대표 이미지 불러오기
                                '/assets/images/pet/dog-1.jpg'
                              }
                              alt="#"
                            />
                          </div>
                        </div>
                        <form
                          className="pet-form profile-form"
                          onSubmit={e => {
                            // 폼 제출 시 업데이트 핸들러 호출
                            e.preventDefault()
                            handleUpdatePet(pet.petId)
                          }}>
                          {/* 이미지 업로드  */}
                          <div className="form-group">
                            <label htmlFor="profileImage">반려견 이미지*</label>
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
                          {/* 펫 이름 */}
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label htmlFor={`petName-${pet.petId}`}>
                                  강아지 이름:
                                </label>
                                <input
                                  type="text"
                                  id={`petName-${pet.petId}`}
                                  name="petName"
                                  value={pet.petName}
                                  onChange={e =>
                                    handlePetInputChange(
                                      pet.petId,
                                      'petName',
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                />
                              </div>
                            </div>

                            {/* 견종 */}
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label htmlFor={`breed-${pet.petId}`}>견종:</label>
                                <input
                                  type="text"
                                  id={`breed-${pet.petId}`}
                                  name="breed"
                                  value={pet.breed}
                                  onChange={e =>
                                    handlePetInputChange(
                                      pet.petId,
                                      'breed',
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                />
                              </div>
                            </div>

                            {/* 출생 연도 */}
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label htmlFor={`petBirth-${pet.petId}`}>
                                  태어난 연도:
                                </label>
                                <input
                                  type="number" // 숫자 입력 필드
                                  id={`petBirth-${pet.petId}`}
                                  name="petBirth"
                                  value={pet.petBirth}
                                  onChange={e =>
                                    handlePetInputChange(
                                      pet.petId,
                                      'petBirth',
                                      parseInt(e.target.value, 10)
                                    )
                                  } // 숫자로 변환
                                  className="form-control"
                                />
                              </div>
                            </div>

                            {/* 무게 */}
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label htmlFor={`weight-${pet.petId}`}>무게 (kg):</label>
                                <input
                                  type="number" // 숫자 입력 필드
                                  step="0.1" // 소수점 입력 허용
                                  id={`weight-${pet.petId}`}
                                  name="weight"
                                  value={pet.weight}
                                  onChange={e =>
                                    handlePetInputChange(
                                      pet.petId,
                                      'weight',
                                      parseFloat(e.target.value)
                                    )
                                  } // 소수점 숫자로 변환
                                  className="form-control"
                                />
                              </div>
                            </div>

                            {/* 성별 (예시: 드롭다운 또는 라디오 버튼) */}
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label htmlFor={`petGender-${pet.petId}`}>성별:</label>
                                <div className="toggle-buttons">
                                  <button
                                    type="button"
                                    className={`toggle-button ${
                                      pet.petGender === true ? 'active' : ''
                                    }`}
                                    onClick={() =>
                                      handlePetInputChange(pet.petId, 'petGender', true)
                                    }>
                                    수컷
                                  </button>
                                  <button
                                    type="button"
                                    className={`toggle-button ${
                                      pet.petGender === false ? 'active' : ''
                                    }`}
                                    onClick={() =>
                                      handlePetInputChange(pet.petId, 'petGender', false)
                                    }>
                                    암컷
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* 중성화 여부 (예시: 체크박스 또는 라디오 버튼) */}
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label htmlFor={`neutering-${pet.petId}`}>
                                  중성화 여부:
                                </label>
                                <div className="toggle-buttons">
                                  <button
                                    type="button"
                                    className={`toggle-button ${
                                      pet.neutering === true ? 'active' : ''
                                    }`}
                                    onClick={() =>
                                      handlePetInputChange(pet.petId, 'neutering', true)
                                    }>
                                    했음
                                  </button>
                                  <button
                                    type="button"
                                    className={`toggle-button ${
                                      pet.neutering === false ? 'active' : ''
                                    }`}
                                    onClick={() =>
                                      handlePetInputChange(pet.petId, 'neutering', false)
                                    }>
                                    안 했음
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 펫 성격 (MBTI) */}
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label htmlFor={`petMbti-${pet.petId}`}>
                                펫 성격 (MBTI):
                              </label>
                              <input
                                type="text"
                                id={`petMbti-${pet.petId}`}
                                name="petMbti"
                                value={pet.petMbti}
                                onChange={e =>
                                  handlePetInputChange(
                                    pet.petId,
                                    'petMbti',
                                    e.target.value
                                  )
                                }
                                className="form-control"
                              />
                            </div>

                            {/* 펫 소개 */}
                            <div className="form-group">
                              <label htmlFor={`petIntroduce-${pet.petId}`}>
                                펫 소개:
                              </label>
                              <textarea
                                id={`petIntroduce-${pet.petId}`}
                                name="petIntroduce"
                                value={pet.petIntroduce}
                                onChange={e =>
                                  handlePetInputChange(
                                    pet.petId,
                                    'petIntroduce',
                                    e.target.value
                                  )
                                }
                                className="form-control"
                                rows={4} // 적절한 행 수 설정
                              />
                            </div>
                          </div>

                          {/* 이미지 필드는 복잡하므로 일단 제외 */}
                          {/* RegDate, ModDate는 보여주기만 하고 수정 불가 */}
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label>등록일:</label>
                                <input
                                  type="text"
                                  value={new Date(pet.regDate).toLocaleDateString()}
                                  disabled
                                  className="form-control-plaintext"
                                />
                              </div>
                            </div>
                            {pet.modDate && (
                              <div className="col-lg-6">
                                <div className="form-group">
                                  <label>수정일:</label>
                                  <input
                                    type="text"
                                    value={new Date(pet.modDate).toLocaleDateString()}
                                    disabled
                                    className="form-control-plaintext"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 정보 업데이트 버튼 */}
                          <button type="submit" className="update-profile-btn">
                            {' '}
                            {/* 적절한 버튼 클래스 사용 */}펫 정보 업데이트
                          </button>
                          {/* 삭제 버튼 추가 (선택 사항) */}
                          <button
                            type="button"
                            className="delete-button btn-danger"
                            onClick={() => handleDeletePet(pet.petId, pet.petName)}>
                            삭제
                          </button>
                        </form>
                      </div>
                    ))
                  ) : (
                    <div
                      className="container"
                      style={{textAlign: 'center', padding: '20px'}}>
                      <p>등록된 펫 정보가 없습니다.</p>
                    </div>
                  )}
                  {/* 펫 등록 페이지로 이동하는 링크 추가 가능 추후에 추가 */}
                  <div className="link-button">
                    <Link to="/register-pet"> 새로운 반려동물 등록하기</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
