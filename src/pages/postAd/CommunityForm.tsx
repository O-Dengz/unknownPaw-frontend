import {useState, useEffect} from 'react'
import axios from 'axios'

interface Member {
  id: number
  nickname: string
  gender: boolean
  introduction: string
  pawRate: number
  emailVerified: boolean
}

interface CommunityFormProps {
  onDataChange: (data: any) => void
}

export default function CommunityForm({onDataChange}: CommunityFormProps) {
  const [member, setMember] = useState<Member | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('') // 커뮤니티 내용 상태
  const [category, setCategory] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [image, setImage] = useState<File | null>(null)

  useEffect(() => {
    // 로그인된 사용자 정보 가져오기
    const fetchMemberData = async () => {
      try {
        const response = await axios.get<Member>('/api/members/me')
        setMember(response.data)
      } catch (error) {
        console.error('Failed to fetch member data:', error)
      }
    }

    fetchMemberData()
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!member) {
      alert('회원 정보를 불러올 수 없습니다.')
      return
    }

    try {
      const formData = {
        title,
        content,
        category,
        memberId: member.id,
        postType: 'COMMUNITY'
      }

      const response = await axios.post('/api/posts/community', formData)

      if (response.status === 201) {
        alert('게시글이 성공적으로 등록되었습니다.')
        // 필요한 경우 페이지 이동 또는 상태 초기화
      }
    } catch (error) {
      console.error('Failed to submit form:', error)
      alert('게시글 등록에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <section className="dashboard section">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3 col-md-4 col-12"></div>

            {/* Main Content */}
            <div className="col-lg-12 col-md-12 col-11 mx-auto">
              <div className="main-content">
                <div className="dashboard-stats">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-12">
                      {/* ✅ 카테고리 타이틀 */}
                      <h2 className="text-2xl font-bold text-center text-gray-800 mb-15">
                        커뮤니티 글쓰기
                      </h2>
                      {/* 서비스 카테고리 */}
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
                        <p className="text-sm mt-2 text-gray-400">
                          최대 업로드 용량: 10MB
                        </p>
                      </div>

                      {/* 🌟 미리보기 추가 */}
                      {previewUrl && (
                        <div className="form-group mb-6">
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

                {/* 작성자 정보 섹션 */}
                <div className="main-content bg-white p-8 rounded-xl shadow-lg mt-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-10">
                    👤 작성자 정보
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
                        <input
                          type="text"
                          value={`${member.pawRate} / 5.0`}
                          readOnly
                          className="form-control bg-gray-100"
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-gray-700">이메일 인증</label>
                        <input
                          type="text"
                          value={member.emailVerified ? '인증됨' : '미인증'}
                          readOnly
                          className="form-control bg-gray-100"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit 버튼 */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg">
              게시글 등록
            </button>
          </div>
        </div>
      </section>
    </form>
  )
}
