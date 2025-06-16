import {useState, useEffect} from 'react'
import {resolvePreviewSrc} from '@/utils/resolvePreviewSrc'

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
  mode = 'create'
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
    serviceDate: '',
    petExperience: '',
    license: [],
    images: []
  })

  // (1) 최초 mount + 수정모드일 때 initialData로 값 채우기
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setPostData(prev => ({
        ...prev,
        ...initialData,
        petExperience: initialData.petExperience ?? '',
        license: initialData.license ?? [],
        images: []
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
      if (file.size > 10 * 1024 * 1024) {
        alert('10MB를 초과한 파일은 업로드할 수 없습니다.')
        return
      }
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
        {/* 글 제목과 서비스 카테고리 */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="col-span-3">
            <label className="text-gray-700 font-medium">제목*</label>
            <input
              type="text"
              value={postData.title}
              onChange={e => setPostData({...postData, title: e.target.value})}
              placeholder="제목을 입력하세요"
              className="form-control"
            />
          </div>
          <div className="col-span-2 flex items-end">
            <div className="flex gap-2 w-full">
              <button
                type="button"
                onClick={() => setPostData({...postData, serviceCategory: 'WALK'})}
                className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  postData.serviceCategory === 'WALK'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                🐕 산책
              </button>
              <button
                type="button"
                onClick={() => setPostData({...postData, serviceCategory: 'HOTEL'})}
                className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  postData.serviceCategory === 'HOTEL'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                🏠 호텔링
              </button>
              <button
                type="button"
                onClick={() => setPostData({...postData, serviceCategory: 'CARE'})}
                className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  postData.serviceCategory === 'CARE'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                🐾 돌봄
              </button>
            </div>
          </div>
        </div>
<br/>
        {/* 글 내용 */}
        <div className="form-group mb-6">
          <label className="text-gray-700 font-medium">내용*</label>
          <textarea
            value={postData.content}
            onChange={e => setPostData({...postData, content: e.target.value})}
            placeholder="내용을 입력하세요"
            className="form-control"
            rows={4}
          />
        </div>

        {/* 시급과 희망 서비스 날짜 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="form-group">
            <label className="text-gray-700 font-medium">시급*</label>
            <input
              type="number"
              value={postData.hourlyRate}
              onChange={e => setPostData({...postData, hourlyRate: Number(e.target.value)})}
              placeholder="시급을 입력하세요"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="text-gray-700 font-medium">희망 서비스 날짜</label>
            <input
              type="date"
              value={postData.serviceDate || ''}
              onChange={e => setPostData({...postData, serviceDate: e.target.value})}
              className="form-control"
            />
          </div>
        </div>

        {/* 기본 위치 */}
        <div className="form-group mb-6">
          <label className="text-gray-700 font-medium">기본 위치*</label>
          <input
            type="text"
            value={postData.defaultLocation}
            onChange={e => setPostData({...postData, defaultLocation: e.target.value})}
            placeholder="기본 위치를 입력하세요"
            className="form-control"
          />
        </div>

        {/* 펫시터 경험 */}
        <div className="form-group mb-6">
          <label className="text-gray-700 font-medium">돌봄 경험 (회수)</label>
          <input
            type="number"
            value={postData.petExperience || ''}
            onChange={e => setPostData({...postData, petExperience: e.target.value})}
            placeholder="돌봄 경험 횟수를 입력하세요"
            className="form-control"
            min="0"
          />
        </div>

        {/* 자격증 입력 */}
        <div className="form-group mb-6">
          <label className="text-gray-700 font-medium">자격증</label>
          <input
            type="text"
            value={postData.license?.join(', ') || ''}
            onChange={e =>
              setPostData({
                ...postData,
                license: e.target.value.split(',').map(str => str.trim())
              })
            }
            placeholder="자격증이 여러 개면 콤마(,)로 구분"
            className="form-control"
          />
        </div>

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
                src={resolvePreviewSrc(previewUrl)}
                className="w-full h-64 object-cover rounded-md border"
              />
            </div>
          )}
        </div>
      </div>

      {/* --- 펫시터 정보 표시 --------------------------------------------------- */}
      <div className="main-content bg-white p-8 rounded-xl shadow-lg mt-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-6">👟 펫시터 정보</h4>
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
                  {member.pawRate !== undefined ? member.pawRate.toFixed(1) : '평점 없음'}
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
    </div>
  )
}