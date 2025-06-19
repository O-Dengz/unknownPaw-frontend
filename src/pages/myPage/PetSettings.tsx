import React, {useState, useEffect, ChangeEvent} from 'react'
import {useNavigate, Link, NavLink} from 'react-router-dom'
import Header from '../../components/Layout/Header'
import {Footer} from '../../components/Layout/Footer'
import {DashboardSidebar} from '../../components/features/dashboard/DashboardSidebar'
import toast, {Toaster} from 'react-hot-toast'
import ScrollToTopButton from '../../components/ScrollToTopButton'

type FieldErrors = {
  petName?: string
  breed?: string
  petBirth?: string
  weight?: string
  petMbti?: string
}

// PetDTO 구조에 맞게 인터페이스 정의
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
  regDate: string
  modDate?: string
  imagePath?: string
  thumbnailPath?: string // 이미지 경로 필드 추가
}

export function PetSettings() {
  const navigate = useNavigate()
  const [validationErrors, setValidationErrors] = useState<Record<number, FieldErrors>>(
    {}
  )
  const [pets, setPets] = useState<PetDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [petFiles, setPetFiles] = useState<Record<number, File | null>>({})
  const [petPreviews, setPetPreviews] = useState<Record<number, string | null>>({})
  const [uploadingPetImage, setUploadingPetImage] = useState<Record<number, boolean>>({})
  const [petImageErrors, setPetImageErrors] = useState<Record<number, string | null>>({})

  const validatePet = (pet: PetDTO): FieldErrors => {
    const errors: FieldErrors = {}
    if (!pet.petName.trim() || pet.petName.length > 20)
      errors.petName = '이름을 1~20자로 입력하세요.'
    if (!pet.breed.trim()) errors.breed = '견종을 입력하세요.'
    const year = Number(pet.petBirth)
    const thisYear = new Date().getFullYear()
    if (!year || year < 1900 || year > thisYear)
      errors.petBirth = '출생연도를 올바르게 입력하세요.'
    if (!(pet.weight > 0)) errors.weight = '몸무게를 올바르게 입력하세요.'
    if (pet.petMbti && !/^[A-Za-z]{4}$/.test(pet.petMbti))
      errors.petMbti = 'MBTI를 4글자로 입력하세요.'
    return errors
  }

  // 1. 펫 목록 불러오기
  useEffect(() => {
    const fetchPetList = async () => {
      const token = sessionStorage.getItem('token')
      if (!token) {
        navigate('/login')
        setLoading(false)
        return
      }
      try {
        const res = await fetch('/api/pet/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (!res.ok) {
          const errorText = await res.text()
          setError(`펫 목록 로딩 실패: ${errorText || res.statusText}`)
          if (res.status === 401) {
            sessionStorage.removeItem('token')
            navigate('/login')
          }
        } else {
          const data: PetDTO[] = await res.json()
          setPets(data)
        }
      } catch (err) {
        setError('펫 목록 로딩 중 네트워크 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchPetList()
  }, [navigate])

  // 2. 펫 정보 입력 핸들러
  const handlePetInputChange = (petId: number, fieldName: keyof PetDTO, value: any) => {
    setPets(prevPets =>
      prevPets.map(pet => {
        if (pet.petId === petId) {
          let convertedValue = value
          switch (fieldName) {
            case 'petBirth':
              convertedValue = parseInt(value, 10)
              break
            case 'weight':
              convertedValue = parseFloat(value)
              break
            case 'petGender':
            case 'neutering':
              convertedValue = Boolean(value)
              break
            default:
              convertedValue = value
          }
          return {...pet, [fieldName]: convertedValue}
        }
        return pet
      })
    )
  }

  // 3. 이미지 업로드 핸들러 (백엔드에 맞게!)
  const handlePetImageUpload = async (petId: number) => {
    const file = petFiles[petId]
    if (!file) return
    setUploadingPetImage(prev => ({...prev, [petId]: true}))
    setPetImageErrors(prev => ({...prev, [petId]: null}))
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('targetId', String(petId)) // ⭐️ 'targetId'로 보냄
      const token = sessionStorage.getItem('token')
      const res = await fetch(`/api/pets/image/upload`, {
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`},
        body: formData
      })
      if (!res.ok) throw new Error(await res.text())

      // 서버에서 갱신된 PetDTO 반환 (imagePath가 반영됨)
      const updatedPet: PetDTO = await res.json()
      setPets(prev =>
        prev.map(p =>
          p.petId === petId
            ? {
                ...p,
                imagePath: updatedPet.imagePath,
                thumbnailPath: updatedPet.thumbnailPath
              }
            : p
        )
      )
      setPetFiles(prev => ({...prev, [petId]: null}))
      setPetPreviews(prev => ({...prev, [petId]: null}))
      toast.success('펫 이미지 업로드 완료!')
    } catch (err: any) {
      setPetImageErrors(prev => ({...prev, [petId]: err.message}))
    } finally {
      setUploadingPetImage(prev => ({...prev, [petId]: false}))
    }
  }

  // 4. 이미지 파일 선택 핸들러 (미리보기 & 10MB 체크)
  const handlePetImageChange = (petId: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setPetImageErrors(prev => ({
        ...prev,
        [petId]: '10MB 이하 이미지만 업로드 가능합니다.'
      }))
      return
    }
    setPetImageErrors(prev => ({...prev, [petId]: null}))
    setPetFiles(prev => ({...prev, [petId]: file}))
    setPetPreviews(prev => ({...prev, [petId]: URL.createObjectURL(file)}))
  }

  // 5. 펫 정보 업데이트 핸들러
  const handleUpdatePet = async (petId: number) => {
    const petToUpdate = pets.find(p => p.petId === petId)
    if (!petToUpdate) return
    const errs = validatePet(petToUpdate)
    setValidationErrors(prev => ({...prev, [petId]: errs}))
    if (Object.keys(errs).length) return
    const token = sessionStorage.getItem('token')
    if (!token) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }
    if (!petToUpdate) {
      alert('업데이트할 펫 정보를 찾을 수 없습니다.')
      return
    }
    const updateData = {
      petName: petToUpdate.petName,
      breed: petToUpdate.breed,
      petBirth: Number(petToUpdate.petBirth),
      petGender: Boolean(petToUpdate.petGender),
      weight: Number(petToUpdate.weight),
      petMbti: petToUpdate.petMbti,
      neutering: Boolean(petToUpdate.neutering),
      petIntroduce: petToUpdate.petIntroduce
    }
    try {
      const res = await fetch(`/api/pet/${petId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })
      if (!res.ok) {
        const errorText = await res.text()
        toast.error(`펫 정보 업데이트 실패: ${errorText || res.statusText}`)
        if (res.status === 401) {
          sessionStorage.removeItem('token')
          navigate('/login')
        }
      } else {
        toast.success(`정보가 성공적으로 업데이트되었습니다.`)
      }
    } catch (err) {
      toast.error('펫 정보 업데이트 중 오류가 발생했습니다.')
    }
  }

  // 6. 펫 삭제 핸들러
  const handleDeletePet = async (petId: number, petName: string) => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }
    if (!window.confirm(`${petName}을(를) 정말로 삭제하시겠습니까?`)) {
      return
    }
    try {
      const response = await fetch(`/api/pet/${petId}`, {
        method: 'DELETE',
        headers: {Authorization: `Bearer ${token}`}
      })
      if (response.ok) {
        alert(`${petName}이(가) 성공적으로 삭제되었습니다.`)
        setPets(prevPets => prevPets.filter(pet => pet.petId !== petId))
      } else {
        const errorData = await response.text()
        alert(`펫 삭제에 실패했습니다: ${errorData || response.statusText}`)
      }
    } catch (error) {
      alert('펫 삭제 중 오류가 발생했습니다.')
    }
  }

  // --- 렌더링 부분 ---
  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{textAlign: 'center', padding: '50px'}}>
          펫 목록 로딩 중...
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="page-wrapper">
        <div
          className="container"
          style={{textAlign: 'center', padding: '50px', color: 'red'}}>
          오류: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <ScrollToTopButton />
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">나의 펫 정보</h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>나의 펫 정보</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="dashboard section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-12">
              <DashboardSidebar />
            </div>
            <div className="col-lg-9 col-md-8 col-12">
              <div className="profile-settings">
                <div className="profile-settings-block settings-box">
                  <div className="settings-tabs mb-4">
                    <Link to="/profile-settings" className="link-button">
                      프로필 설정
                    </Link>
                    <NavLink
                      to="/pet-settings"
                      className={({isActive}) =>
                        isActive ? 'link-button active' : 'link-button'
                      }>
                      pet 수정
                    </NavLink>
                  </div>
                  {pets.length > 0 ? (
                    pets.map(pet => (
                      <div key={pet.petId} className="pet-info">
                        <div className="form-group">
                          <input
                            id={`petImage-${pet.petId}`}
                            type="file"
                            accept="image/*"
                            style={{display: 'none'}}
                            onChange={e => handlePetImageChange(pet.petId, e)}
                          />
                          <h2>펫 정보</h2>
                          <div className="image-row">
                            {!petPreviews[pet.petId] && pet.imagePath && (
                              <img
                                src={`/api/pets/image/${pet.petId}/${
                                  pet.thumbnailPath
                                    ? pet.thumbnailPath.split('/').pop()
                                    : pet.imagePath.split('/').pop()
                                }`}
                                alt={pet.petName}
                                style={{
                                  width: 120,
                                  height: 120,
                                  objectFit: 'cover',
                                  borderRadius: '50%'
                                }}
                              />
                            )}
                            <div className="image-actions">
                              <label
                                htmlFor={`petImage-${pet.petId}`}
                                className="file-upload">
                                <i className="lni lni-cloud-upload" /> 펫 이미지 선택
                              </label>
                              {petPreviews[pet.petId] && (
                                <button
                                  type="button"
                                  onClick={() => handlePetImageUpload(pet.petId)}
                                  disabled={uploadingPetImage[pet.petId]}
                                  className="btn btn-primary">
                                  {uploadingPetImage[pet.petId]
                                    ? '업로드 중…'
                                    : '이미지 업로드'}
                                </button>
                              )}
                            </div>
                            {petImageErrors[pet.petId] && (
                              <p style={{color: 'red', fontSize: '0.8em', marginTop: 4}}>
                                {petImageErrors[pet.petId]}
                              </p>
                            )}
                          </div>
                        </div>
                        <form
                          className="pet-form profile-form"
                          onSubmit={e => {
                            e.preventDefault()
                            handleUpdatePet(pet.petId)
                          }}>
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
                                {validationErrors[pet.petId]?.petName && (
                                  <small className="text-danger">
                                    {validationErrors[pet.petId].petName}
                                  </small>
                                )}
                              </div>
                            </div>
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
                                {validationErrors[pet.petId]?.breed && (
                                  <small className="text-danger">
                                    {validationErrors[pet.petId].breed}
                                  </small>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label htmlFor={`petBirth-${pet.petId}`}>
                                  태어난 연도:
                                </label>
                                <input
                                  type="number"
                                  id={`petBirth-${pet.petId}`}
                                  name="petBirth"
                                  value={pet.petBirth}
                                  onChange={e =>
                                    handlePetInputChange(
                                      pet.petId,
                                      'petBirth',
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                />
                                {validationErrors[pet.petId]?.petBirth && (
                                  <small className="text-danger">
                                    {validationErrors[pet.petId].petBirth}
                                  </small>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label htmlFor={`weight-${pet.petId}`}>무게 (kg):</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  id={`weight-${pet.petId}`}
                                  name="weight"
                                  value={pet.weight}
                                  onChange={e =>
                                    handlePetInputChange(
                                      pet.petId,
                                      'weight',
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                />
                                {validationErrors[pet.petId]?.weight && (
                                  <small className="text-danger">
                                    {validationErrors[pet.petId].weight}
                                  </small>
                                )}
                              </div>
                            </div>
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
                                rows={4}
                              />
                            </div>
                          </div>
                          <div
                            style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
                            <button type="submit" className="update-profile-btn">
                              펫 정보 업데이트
                            </button>
                            <button
                              type="button"
                              className="delete-button btn-danger"
                              onClick={() => handleDeletePet(pet.petId, pet.petName)}>
                              삭제
                            </button>
                          </div>
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
                  <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                    <button className="update-profile-btn">
                      <Link
                        to="/register-pet"
                        style={{color: 'white', textDecoration: 'none'}}>
                        새로운 반려동물 등록하기
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
