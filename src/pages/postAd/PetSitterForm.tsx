import {useState, useEffect} from 'react'

interface Member {
  id: number
  nickname: string
  gender: boolean
  introduction: string
  pawRate: number | undefined
  emailVerified: boolean
  petExperience?: string
  license?: string[]
}

export interface PostFormData {
  title: string
  content: string
  serviceCategory: string
  hourlyRate: number
  defaultLocation: string
  serviceDate?: string
  images?: File[]
  petExperience?: string
  license?: string[]
}

interface PetSitterFormProps {
  onDataChange: (data: PostFormData) => void
  initialData?: Partial<PostFormData>
  initialImageUrl?: string | null
  mode?: 'create' | 'edit'
}

export default function PetSitterForm({
  onDataChange,
  initialData,
  initialImageUrl,
  mode = 'create',
}: PetSitterFormProps) {
  const [member, setMember] = useState<Member | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null)

  const [postData, setPostData] = useState<PostFormData>({
    title: '',
    content: '',
    serviceCategory: '',
    hourlyRate: 0,
    defaultLocation: '',
    petExperience: '',
    license: []
  })

  // (1) 최초 mount + 수정모드일 때 initialData로 값 채우기
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setPostData(prev => ({
        ...prev,
        ...initialData,
        petExperience: initialData.petExperience ?? '',
        license: initialData.license ?? []
      }))
      setPreviewUrl(initialImageUrl || null)
    }
  }, [initialData, initialImageUrl, mode])

  // (2) 회원정보 fetch
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

        // 새 글 작성 시, 프로필 기반 자동 세팅
        if (mode === 'create') {
          setPostData(prev => ({
            ...prev,
            petExperience: data.petExperience || '',
            license: data.license || []
          }))
        }
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : '사용자 정보를 불러오는데 실패했습니다.'
        )
      }
    }
    fetchMemberData()
  }, [mode])

  // (3) 이미지 업로드
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setPostData(prev => ({...prev, images: [file]}))
    }
  }

  // (4) 부모로 데이터 전달
  useEffect(() => {
    onDataChange({
      ...postData,
      images: image ? [image] : undefined
    })
  }, [postData, image, onDataChange])

  // (5) 렌더링
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
        {/* ...생략: 나머지 입력란 동일... */}

        {/* 이미지 업로드 */}
        <div className="form-group mb-6">
          <label className="text-gray-700 font-medium">이미지 업로드</label>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center text-gray-500 relative">
            <div className="text-4xl mb-2">+</div>
            <p>파일 선택</p>
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
                src={
                  previewUrl.startsWith('blob:')
                    ? previewUrl
                    : `http://localhost:8080/unknownPaw/${previewUrl}`
                }
                alt="미리보기"
                className="w-full h-64 object-cover rounded-md border"
              />
            </div>
          )}
        </div>
        {/* 이하 동일 */}
      </div>
      {/* 시터 정보 표시는 그대로~ */}
    </div>
  )
}