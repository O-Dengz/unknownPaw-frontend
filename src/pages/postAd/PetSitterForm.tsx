import {useState, useEffect} from 'react'

interface Member {
  id: number
  nickname: string
  gender: boolean
  introduction: string
  pawRate: number | undefined
  emailVerified: boolean
  experience?: string
  certificates?: string[]
}

// Post 기본 인터페이스
interface PostFormData {
  title: string
  content: string
  serviceCategory: string
  desiredHourlyRate: number
  defaultLocation: string
  walkDate?: string
  images?: File[]
  experience?: string
  certificates?: string[]
}

interface PetSitterFormProps {
  onDataChange: (data: PostFormData) => void
}

export default function PetSitterForm({onDataChange}: PetSitterFormProps) {
  const [member, setMember] = useState<Member | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [postData, setPostData] = useState<PostFormData>({
    title: '',
    content: '',
    serviceCategory: '',
    desiredHourlyRate: 0,
    defaultLocation: '',
    experience: '',
    certificates: []
  })

  useEffect(() => {
    // 로그인된 사용자 정보 가져오기
    const fetchMemberData = async () => {
      try {
        const token = sessionStorage.getItem('token') // JWT 토큰 가져오기
        if (!token) {
          throw new Error('로그인이 필요합니다.')
        }

        const response = await fetch('/api/member/profile/simple/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('사용자 정보를 불러오는데 실패했습니다.')
        }

        const data = await response.json()
        setMember(data)

        // 경험과 자격증 정보가 있다면 폼에 자동으로 설정
        if (data.experience || data.certificates) {
          setPostData(prev => ({
            ...prev,
            experience: data.experience,
            certificates: data.certificates
          }))
        }
      } catch (error) {
        console.error('Failed to fetch member data:', error)
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

      onDataChange({
        ...postData,
        images: [file]
      })
    }
  }

  // 폼 데이터가 변경될 때마다 부모 컴포넌트에 알림
  useEffect(() => {
    onDataChange({
      ...postData,
      images: image ? [image] : undefined
    })
  }, [postData, image, onDataChange])

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
            <option value="산책">산책</option>
            <option value="호텔링">호텔링</option>
            <option value="돌봄">돌봄</option>
          </select>
        </div>

        {/* 시급 */}
        <div className="form-group mb-6">
          <label className="text-gray-700 font-medium">시급</label>
          <input
            type="number"
            value={postData.desiredHourlyRate}
            onChange={e =>
              setPostData({...postData, desiredHourlyRate: Number(e.target.value)})
            }
            placeholder="시급을 입력하세요"
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
            <input
              type="file"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
            />
            <p className="text-sm mt-2 text-gray-400">최대 업로드 용량: 10MB</p>
          </div>

          {previewUrl && (
            <div className="mt-4">
              <p className="text-gray-700 font-medium mb-2">미리보기</p>
              <img
                src={previewUrl}
                alt="미리보기"
                className="w-full h-64 object-cover rounded-md border"
              />
            </div>
          )}
        </div>
      </div>

      {/* 펫 시터 정보 표시 섹션 */}
      <div className="main-content bg-white p-8 rounded-xl shadow-lg mt-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-6">👤 펫 시터 정보</h4>
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
            <div className="form-group col-span-2">
              <label className="text-gray-700">반려동물 돌봄 경험</label>
              <textarea
                value={postData.experience}
                onChange={e => setPostData({...postData, experience: e.target.value})}
                placeholder="반려동물 돌봄 경험을 입력해주세요"
                className="form-control"
                rows={3}
              />
            </div>
            <div className="form-group col-span-2">
              <label className="text-gray-700">자격증 및 교육 이수</label>
              <textarea
                value={postData.certificates?.join('\n')}
                onChange={e =>
                  setPostData({
                    ...postData,
                    certificates: e.target.value
                      .split('\n')
                      .filter(cert => cert.trim() !== '')
                  })
                }
                placeholder="자격증 및 교육 이수 내역을 입력해주세요 (한 줄에 하나씩)"
                className="form-control"
                rows={3}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
