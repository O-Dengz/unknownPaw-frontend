import {useState, useEffect} from 'react'

interface Member {
  id: number
  nickname: string
  gender: boolean
  introduction: string
  pawRate: number | undefined
  emailVerified: boolean
}

interface CommunityFormProps {
  onDataChange?: (data: any) => void
}

export default function CommunityForm({onDataChange}: CommunityFormProps) {
  const [member, setMember] = useState<Member | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [image, setImage] = useState<File | null>(null)

  // 🔁 세션 스토리지에서 제목/내용 복구
  useEffect(() => {
    const savedTitle = sessionStorage.getItem('community_title')
    const savedContent = sessionStorage.getItem('community_content')
    if (savedTitle) setTitle(savedTitle)
    if (savedContent) setContent(savedContent)
  }, [])

  // 💾 제목/내용 저장
  useEffect(() => {
    sessionStorage.setItem('community_title', title)
    sessionStorage.setItem('community_content', content)
  }, [title, content])

  // 🙋 회원 정보 불러오기
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
        console.log('🐶 받은 데이터:', data)
        setMember(data)
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

  // 🖼️ 이미지 업로드 + 미리보기
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  // 📨 게시글 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!member || !member.id) {
      alert('회원 정보를 불러올 수 없습니다. 다시 로그인해주세요.')
      return
    }

    if (!category) {
      alert('카테고리를 선택해주세요.')
      return
    }

    try {
      const formData = new FormData()
      const communityData = {
        title,
        content,
        communityCategory: category
      }

      formData.append(
        'communityRequestDTO',
        new Blob([JSON.stringify(communityData)], {
          type: 'application/json'
        })
      )

      if (image) {
        formData.append('communityImage', image)
      }

      const token = sessionStorage.getItem('token')
      if (!token) {
        alert('로그인이 필요합니다.')
        return
      }

      const response = await fetch(
        `/api/community/${category}/register?memberId=${member.id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      )

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Error response:', errorData)
        throw new Error('게시글 등록에 실패했습니다.')
      }

      alert('게시글이 성공적으로 등록되었습니다! 🥳')

      // 초기화
      setTitle('')
      setContent('')
      setCategory('')
      setImage(null)
      setPreviewUrl(null)
      if (onDataChange) onDataChange(true)
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
    }
  }

  // 💡 변경 시 부모에게 알림
  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        title,
        content,
        serviceCategory: category,
        hourlyRate: 0,
        defaultLocation: '',
        images: image ? [image] : undefined
      })
    }
  }, [title, content, category, image, onDataChange])

  return (
    <form onSubmit={handleSubmit}>
      <section className="dashboard section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-12"></div>
            <div className="col-lg-12 col-md-12 col-11 mx-auto">
              <div className="main-content">
                <div className="dashboard-stats">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-12">
                      <h2 className="text-2xl font-bold text-center text-gray-800 mb-15">
                        커뮤니티 글쓰기
                      </h2>

                      {/* 카테고리 선택 */}
                      <div className="form-group mb-6">
                        <label className="text-gray-700 font-medium">카테고리</label>
                        <select
                          value={category}
                          onChange={e => setCategory(e.target.value)}
                          className="form-control"
                          required>
                          <option value="">카테고리를 선택하세요</option>
                          <option value="GENERAL">일반</option>
                          <option value="EVENT">이벤트</option>
                          <option value="ANNOUNCEMENT">공지사항</option>
                          <option value="COMMUNITY">커뮤니티</option>
                        </select>
                      </div>

                      {/* 제목 */}
                      <div className="form-group">
                        <label className="text-gray-700 font-medium">제목*</label>
                        <input
                          type="text"
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          placeholder="제목을 입력하세요"
                          className="form-control"
                          required
                        />
                      </div>

                      {/* 내용 */}
                      <label className="text-gray-700 font-medium">내용</label>
                      <div className="form-group mb-6">
                        <textarea
                          value={content}
                          onChange={e => setContent(e.target.value)}
                          placeholder="내용을 입력하세요"
                          className="form-control"
                          rows={4}
                          required
                        />
                      </div>

                      {/* 이미지 업로드 */}
                      <div className="form-group mb-6">
                        <label className="text-gray-700 font-medium">이미지 업로드</label>
                        <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center text-gray-500 relative">
                          {/* 숨겨진 파일 인풋 */}
                          <input
                            type="file"
                            id="image-upload-input"
                            onChange={handleImageUpload}
                            className="hidden"
                            accept="image/*"
                          />

                          {/* + 버튼을 클릭 시 input 트리거 */}
                          <button
                            type="button"
                            onClick={() => {
                              const fileInput = document.getElementById(
                                'image-upload-input'
                              ) as HTMLInputElement
                              fileInput?.click()
                            }}
                            className="text-4xl mb-2 hover:text-gray-700 transition-colors duration-200">
                            +
                          </button>

                          <p>파일 선택</p>
                          <p className="text-sm mt-2 text-gray-400">
                            최대 업로드 용량: 10MB
                          </p>
                        </div>

                        {previewUrl && (
                          <div className="form-group mb-6 mt-4">
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
                  </div>
                </div>

                <div className="main-content bg-white p-8 rounded-xl shadow-lg mt-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-6">
                    👤 펫 시터 정보
                  </h4>
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
                            {member.pawRate !== undefined
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </form>
  )
}
