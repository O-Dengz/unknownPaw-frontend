// ------------ 추후에 펫 등록 시 이용 ------------
import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

// 백엔드 PetDTO에 맞게 타입을 정의합니다.
// (src/types/petTypes.ts 파일을 만들 필요 없이 여기서 바로 정의합니다.)
interface PetFormDataType {
  petName: string
  breed: string
  petBirth: number // 백엔드 DTO와 일치하도록 number
  petGender: boolean
  weight: number // 백엔드 DTO와 일치하도록 number
  petMbti: string
  neutering: boolean
  petIntroduce: string
}

const RegisterPetPage: React.FC = () => {
  const navigate = useNavigate()

  // 폼의 상태를 관리할 useState
  const [petForm, setPetForm] = useState<{
    petName: string
    breed: string
    petBirth: string // <input type="number">의 value는 string으로 관리하는 것이 일반적
    petGender: boolean
    weight: string // <input type="number">의 value는 string으로 관리하는 것이 일반적
    petMbti: string
    neutering: boolean
    petIntroduce: string
  }>({
    petName: '',
    breed: '',
    petBirth: '',
    petGender: true, // true: 수컷, false: 암컷
    weight: '',
    petMbti: '',
    neutering: false, // false: 아니오, true: 예
    petIntroduce: ''
  })

  // 입력 필드 변경 핸들러
  const petChanged =
    (key: keyof typeof petForm) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      let value: string | boolean = e.target.value
      if (key === 'petGender' || key === 'neutering') {
        // 'true'/'false' 문자열을 실제 boolean 값으로 변환
        value = e.target.value === 'true'
      }
      setPetForm({...petForm, [key]: value})
    }

  // 폼 제출 핸들러
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // 기본 폼 제출 동작 방지

    // 백엔드 PetDTO의 숫자 타입과 일치하도록 변환
    const submittedPetData: PetFormDataType = {
      ...petForm,
      petBirth: parseInt(petForm.petBirth), // 문자열을 숫자로 변환
      weight: parseFloat(petForm.weight) // 문자열을 숫자로 변환
    }

    console.log('최종 제출될 펫 정보:', submittedPetData)

    try {
      const token = sessionStorage.getItem('token')
      console.log('가져온 JWT 토큰:', token)

      const response = await fetch('/api/pet/register/later', {
        // 백엔드 API 엔드포인트
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰 포함
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submittedPetData) // 변환된 데이터를 JSON으로 전송
      })

      if (!token) {
        alert('로그인이 필요합니다. 다시 로그인해주세요.')
        navigate('/login') // 로그인 페이지로 리다이렉트
        return
      }
      if (response.ok) {
        const petId = await response.json() // 백엔드에서 반환하는 petId
        console.log('API 호출 성공, 응답 데이터:', petId) // 성공 시
        alert(`반려동물 '${petForm.petName}'이(가) 성공적으로 등록되었습니다!`)
        navigate('/pet-settings') // 등록 성공 후 펫 설정 페이지로 이동
      } else {
        const errorData = await response.json()
        alert(`반려동물 등록 실패: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error('반려동물 등록 중 오류 발생:', error)
      console.error('API 호출 실패, 에러 데이터:', error) // 실패 시
      alert('반려동물 등록 중 네트워크 오류 또는 예상치 못한 오류가 발생했습니다.')
    }
  }

  // 취소 버튼 핸들러
  const handleCancel = () => {
    navigate('/pet-settings') // 취소 시 펫 설정 페이지로 이동
  }

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h3 className="modal-title">새로운 반려동물 등록</h3>
          <form onSubmit={handleFormSubmit} className="pet-form-grid">
            {/* 이름 */}
            <div className="form-field ">
              <label className="form-label">이름</label>
              <input
                type="text"
                id="petName"
                value={petForm.petName}
                onChange={petChanged('petName')}
                className="form-input"
                required
              />
            </div>

            {/* 견종 */}
            <div className="form-field">
              <label className="form-label">견종</label>
              <input
                type="text"
                id="breed"
                value={petForm.breed}
                onChange={petChanged('breed')}
                className="form-input 
                "
                required
              />
            </div>

            {/* 성별 */}
            <div className="form-field">
              <label className="form-label">성별</label>
              <select
                id="petGender"
                value={petForm.petGender ? 'true' : 'false'}
                onChange={e =>
                  setPetForm({...petForm, petGender: e.target.value === 'true'})
                }
                className="form-select">
                <option value="true">수컷</option>
                <option value="false">암컷</option>
              </select>
            </div>

            {/* 중성화 여부 */}
            <div className="form-field">
              <label htmlFor="neutering" className="form-label">
                중성화 여부
              </label>
              <select
                id="neutering"
                value={petForm.neutering ? 'true' : 'false'}
                onChange={e =>
                  setPetForm({...petForm, neutering: e.target.value === 'true'})
                }
                className="form-select">
                <option value="true">예</option>
                <option value="false">아니오</option>
              </select>
            </div>

            {/* 출생 연도 */}
            <div>
              <label className="form-label">출생 연도</label>
              <input
                type="number"
                id="petBirth"
                value={petForm.petBirth}
                onChange={petChanged('petBirth')}
                className="form-input"
                required
              />
            </div>
            {/* 무게 (kg) */}
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700 mb-1">
                무게 (kg)
              </label>
              <input
                type="number"
                step="0.1"
                id="weight"
                value={petForm.weight}
                onChange={petChanged('weight')}
                className="form-input"
                required
              />
            </div>

            {/* 성격 (MBTI) */}
            <div>
              <label
                htmlFor="petMbti"
                className="block text-sm font-medium text-gray-700 mb-1">
                성격 (MBTI)
              </label>
              <input
                type="text"
                id="petMbti"
                value={petForm.petMbti}
                onChange={petChanged('petMbti')}
                className="form-input"
                required
              />
            </div>

            {/* 소개 */}
            <div>
              <label className="form-label">소개</label>
              <textarea
                id="petIntroduce"
                value={petForm.petIntroduce}
                onChange={e => setPetForm({...petForm, petIntroduce: e.target.value})}
                className="form-input"
                rows={3}
                required
              />
            </div>

            <div className="modal-actions full-width">
              <button type="submit" className="button button-primary">
                등록
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="button button-secondary ">
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default RegisterPetPage
