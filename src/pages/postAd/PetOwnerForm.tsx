import {useState, useEffect} from 'react'

interface Pet {
  petId: number
  petName: string
  breed: string
  petBirth: string
  petGender: boolean
  weight: number
  mbti: string
  neutering: boolean
  introduction: string
}

interface Member {
  id: number
  nickname: string
  gender: boolean
  introduction: string
  pawRate: number | undefined
  emailVerified: boolean
  pets: Pet[]
}
export interface PetOwnerFormProps {
  onDataChange: (data: PostFormData) => void
  initialData?: Partial<PostFormData>
  initialImageUrl?: string | null
  mode?: 'create' | 'edit'
}

// Post 기본 인터페이스
export interface PostFormData {
  title: string
  content: string
  serviceCategory: string
  hourlyRate: number
  defaultLocation: string
  serviceDate?: string
  images?: File[]
  petId?: number
}

export default function PetOwnerForm({
  onDataChange,
  initialData,
  initialImageUrl,
  mode = 'create'
}: PetOwnerFormProps) {
  const [postData, setPostData] = useState<PostFormData>({
    title: '',
    content: '',
    serviceCategory: '',
    hourlyRate: 0,
    defaultLocation: '',
    serviceDate: ''
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null)
  useEffect(() => {
    setPreviewUrl(initialImageUrl || null)
  }, [initialImageUrl])
  const [member, setMember] = useState<Member | null>(null)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [image, setImage] = useState<File | null>(null)

  // 1. member와 initialData(수정모드)가 들어오면 폼에 값 채우기
  useEffect(() => {
    if (member && initialData && mode === 'edit') {
      // (1) 기존 pet 선택
      const found = member.pets.find(pet => pet.petId === initialData.petId)
      if (found) setSelectedPet(found)
      // (2) postData 채우기
      setPostData(prev => ({...prev, ...initialData}))
    }
  }, [member, initialData, mode])

  // 2. 폼 데이터가 바뀔 때 부모에게 전달
  useEffect(() => {
    if (selectedPet && postData.title !== '') {
      onDataChange({
        ...postData,
        petId: selectedPet.petId,
        images: image ? [image] : undefined
      })
    }
  }, [postData, selectedPet, image, onDataChange])

  // 3. 마운트시 멤버 정보 가져오기
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const token = sessionStorage.getItem('token')
        if (!token) throw new Error('로그인이 필요합니다.')

        const response = await fetch('/api/member/profile/simple/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) throw new Error('사용자 정보를 불러오는데 실패했습니다.')

        const data = await response.json()
        setMember(data)
        if (data?.pets?.length > 0) setSelectedPet(data.pets[0])
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : '사용자 정보를 불러오는데 실패했습니다.'
        )
      }
    }
    fetchMemberData()
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setPostData(prev => ({...prev, images: [file]}))
    }
  }

  // 폼 데이터가 변경될 때마다 부모 컴포넌트에 알림
  useEffect(() => {
    if (selectedPet) {
      onDataChange({
        ...postData,
        petId: selectedPet.petId,
        images: image ? [image] : undefined
      })
    }
  }, [postData, selectedPet, image, onDataChange])

  return (
    <div>
      <div className="main-content bg-white p-8 rounded-xl shadow-lg">
        {/* 글 제목 */}
        <div className="form-group mb-6">
          <label className="text-gray-700 font-medium">제목*</label>
          <input
            type="text"
            value={postData.title}
            onChange={e => setPostData({...postData, title: e.target.value})}
            placeholder="제목을 입력하세요"
            className="form-control"
          />
        </div>

        {/* 글 내용 */}
        <div className="form-group mb-6">
          <label className="text-gray-700 font-medium">내용</label>
          <textarea
            value={postData.content}
            onChange={e => setPostData({...postData, content: e.target.value})}
            placeholder="내용을 입력하세요"
            className="form-control"
            rows={4}
          />
        </div>

        {/* 서비스 카테고리 */}
        <div className="form-group mb-6">
          <label className="text-gray-700 font-medium">서비스 카테고리</label>
          <select
            value={postData.serviceCategory}
            onChange={e => setPostData({...postData, serviceCategory: e.target.value})}
            className="form-control">
            <option value="">카테고리를 선택하세요</option>
            <option value="WALK">산책</option>
            <option value="HOTEL">호텔링</option>
            <option value="CARE">돌봄</option>
          </select>
        </div>

        {/* 시급 */}
        <div className="form-group mb-6">
          <label className="text-gray-700 font-medium">시급</label>
          <input
            type="number"
            value={postData.hourlyRate}
            onChange={e => setPostData({...postData, hourlyRate: Number(e.target.value)})}
            placeholder="시급을 입력하세요"
            className="form-control"
          />
        </div>

        {/* 산책 희망 날짜 */}
        <div className="form-group mb-6">
          <label className="text-gray-700 font-medium">산책 희망 날짜</label>
          <input
            type="date"
            value={postData.serviceDate || ''}
            onChange={e => setPostData({...postData, serviceDate: e.target.value})}
            className="form-control"
          />
        </div>

        {/* 기본 위치 */}
        <div className="form-group mb-6">
          <label className="text-gray-700 font-medium">기본 위치</label>
          <input
            type="text"
            value={postData.defaultLocation}
            onChange={e => setPostData({...postData, defaultLocation: e.target.value})}
            placeholder="기본 위치를 입력하세요"
            className="form-control"
          />
        </div>

        {/* 이미지 업로드 */}
        <div className="form-group mb-6">
          <label className="text-gray-700 font-medium">이미지 업로드</label>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center text-gray-500 relative">
            <div className="text-4xl mb-2">+</div>
            <p>파일 선택</p>

            {/* 꼭 부모가 relative여야 inset-0이 동작합니다 */}
            <input
              type="file"
              onChange={handleImageUpload}
              style={{display: 'block'}}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              accept="image/*"
            />
            <p className="text-sm mt-2 text-gray-400">최대 업로드 용량: 10MB</p>
          </div>

          {previewUrl && (
            <div className="mt-4">
              <p className="text-gray-700 font-medium mb-2">미리보기</p>
              <img
                src={`http://localhost:8080/unknownPaw/${previewUrl}`}
                alt="미리보기"
                className="w-full h-64 object-cover rounded-md border"
              />
            </div>
          )}
        </div>
      </div>

      {/* 펫 오너 정보 표시 섹션 */}
      <div className="main-content bg-white p-8 rounded-xl shadow-lg mt-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-6">👞 펫 오너 정보</h4>
        {member && (
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="text-gray-700">닉네임</label>
              <input
                type="text"
                value={member.nickname}
                readOnly
                className="form-control bg-gray-100"
              />
            </div>
            <div className="form-group">
              <label className="text-gray-700">성별</label>
              <input
                type="text"
                value={member.gender ? '남성' : '여성'}
                readOnly
                className="form-control bg-gray-100"
              />
            </div>
            <div className="form-group col-span-2">
              <label className="text-gray-700">소개</label>
              <textarea
                value={member.introduction}
                readOnly
                className="form-control bg-gray-100"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label className="text-gray-700">평점</label>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400">⭐</span>
                <p>
                  {member && member.pawRate !== undefined
                    ? member.pawRate.toFixed(1)
                    : '평점 없음'}
                </p>
              </div>
            </div>
            <div className="form-group">
              <label className="text-gray-700">이메일 인증</label>
              <span
                className={`ml-2 inline-block px-2 py-1 rounded-full text-sm ${
                  member.emailVerified
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                {member.emailVerified ? '인증 완료' : '미인증'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 반려동물 선택 및 정보 표시 섹션 */}
      <div className="main-content bg-white p-8 rounded-xl shadow-lg mt-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-6">🐾 반려동물 정보</h4>

        {/* 반려동물 선택 */}
        {member && member.pets && member.pets.length > 0 && (
          <div className="form-group mb-6">
            <label className="text-gray-700 font-medium">반려동물 선택</label>
            <select
              value={selectedPet?.petId || ''}
              onChange={e => {
                const pet = member.pets.find(p => p.petId === Number(e.target.value))
                setSelectedPet(pet || null)
              }}
              className="form-control">
              {member.pets.map(pet => (
                <option key={pet.petId} value={pet.petId}>
                  {pet.petName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 선택된 반려동물 정보 표시 */}
        {selectedPet && (
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="text-gray-700">이름</label>
              <input
                type="text"
                value={selectedPet.petName}
                readOnly
                className="form-control bg-gray-100"
              />
            </div>
            <div className="form-group">
              <label className="text-gray-700">품종</label>
              <input
                type="text"
                value={selectedPet.breed}
                readOnly
                className="form-control bg-gray-100"
              />
            </div>
            <div className="form-group">
              <label className="text-gray-700">생년월일</label>
              <input
                type="text"
                value={selectedPet.petBirth}
                readOnly
                className="form-control bg-gray-100"
              />
            </div>
            <div className="form-group">
              <label className="text-gray-700">성별</label>
              <input
                type="text"
                value={selectedPet.petGender ? '수컷' : '암컷'}
                readOnly
                className="form-control bg-gray-100"
              />
            </div>
            <div className="form-group">
              <label className="text-gray-700">체중</label>
              <input
                type="text"
                value={`${selectedPet.weight}kg`}
                readOnly
                className="form-control bg-gray-100"
              />
            </div>
            <div className="form-group">
              <label className="text-gray-700">MBTI</label>
              <input
                type="text"
                value={selectedPet.mbti}
                readOnly
                className="form-control bg-gray-100"
              />
            </div>
            <div className="form-group">
              <label className="text-gray-700">중성화 여부</label>
              <input
                type="text"
                value={selectedPet.neutering ? '예' : '아니오'}
                readOnly
                className="form-control bg-gray-100"
              />
            </div>
            <div className="form-group col-span-2">
              <label className="text-gray-700">소개</label>
              <textarea
                value={selectedPet.introduction}
                readOnly
                className="form-control bg-gray-100"
                rows={3}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
