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
  onSubmitRequest?: (submitFn: () => Promise<void>) => void
}

export default function CommunityForm({
  onDataChange,
  onSubmitRequest
}: CommunityFormProps) {
  const [member, setMember] = useState<Member | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  // JSX와 일치하도록 상태 변수 이름을 selectedCommunityCategory로 변경
  const [communityCategory, setCommunityCategory] = useState('')
  // 단일 이미지만 처리하는 로직에 맞게 File | null 타입으로 변경
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // 📦 로컬 상태 세션 스토리지 연동
  useEffect(() => {
    const savedTitle = sessionStorage.getItem('community_title')
    const savedContent = sessionStorage.getItem('community_content')
    if (savedTitle) setTitle(savedTitle)
    if (savedContent) setContent(savedContent)
  }, [])

  useEffect(() => {
    sessionStorage.setItem('community_title', title)
    sessionStorage.setItem('community_content', content)
  }, [title, content])

  // 👤 회원 정보 불러오기
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const token = sessionStorage.getItem('token')
        if (!token) throw new Error('로그인이 필요합니다.')

        const res = await fetch('/api/member/profile/simple/me', {
          headers: {Authorization: `Bearer ${token}`}
        })
        if (!res.ok) throw new Error('사용자 정보를 불러오지 못했어요 😢')

        const data = await res.json()
        setMember(data)
      } catch (err) {
        console.error('회원 정보 오류:', err)
        alert(err instanceof Error ? err.message : '알 수 없는 오류입니다.')
      }
    }
    fetchMemberData()
  }, [])

  // 🖼️ 이미지 업로드
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      setImage(file) // 단일 이미지 상태 업데이트
      setPreviewUrl(URL.createObjectURL(file)) // 미리보기 URL 생성
    } else {
      setImage(null)
      setPreviewUrl(null)
    }
  }

  // 🔄 부모에게 변경 알림
  useEffect(() => {
    onDataChange?.({
      title,
      content,
      communityCategory: communityCategory, //
      images: image ? [image] : undefined // 단일 이미지를 배열 형태로 전달
    })
  }, [title, content, communityCategory, image, onDataChange]) // image를 의존성 배열에 추가

  // 📨 제출 처리

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!member?.id) {
      alert('회원 정보를 다시 확인해주세요 😥')
      return
    }

    // ✅ 이 부분이 PostAd.tsx:153(fetch 호출) 이전에 실행되어야 합니다!
    if (!communityCategory) {
      alert('카테고리를 선택해주세요!')
      console.error('카테고리가 선택되지 않았습니다. 요청을 중단합니다.') // 디버깅을 위해 추가
      return // 카테고리가 없으면 여기서 즉시 중단
    }

    console.log('커뮤니티 DTO 준비:', {
      title,
      content,
      communityCategory: communityCategory
    })
    console.log('커뮤니티 이미지 준비:', image ? '1 개' : '없음')

    try {
      const token = sessionStorage.getItem('token')
      if (!token) throw new Error('로그인이 필요합니다.')

      const communityData = {title, content, communityCategory: communityCategory}
      const formData = new FormData()
      formData.append(
        'communityRequestDTO',
        new Blob([JSON.stringify(communityData)], {type: 'application/json'})
      )
      if (image) formData.append('communityImage', image)

      // 백엔드 URL 경로 수정: /api/community/{category}/register -> /api/community/posts-with-image
      // 기존에 URL에 카테고리를 넣는 로직이 있었습니다. 백엔드 컨트롤러와 일치시켜야 합니다.
      // 현재 백엔드 컨트롤러의 @PostMapping("/posts-with-image")는 URL에 카테고리가 없습니다.
      // URL을 백엔드 컨트롤러와 동일하게 변경해야 합니다.
      const url = `/api/community/posts-with-image?memberId=${member.id}` // 수정된 URL

      const res = await fetch(url, {
        // 이 라인이 PostAd.tsx:153 에러의 원인이 되는 fetch 호출입니다.
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`},
        body: formData
      })

      if (!res.ok) {
        const errText = await res.text()
        console.error('응답 실패:', errText)
        throw new Error('게시글 등록에 실패했어요 😢')
      }

      alert('게시글 등록 성공! 🥳')
      resetForm()
      onDataChange?.(true)
    } catch (err) {
      console.error('제출 오류:', err)
      alert(err instanceof Error ? err.message : '예상치 못한 오류 발생!')
    }
  }

  // 🧽 폼 초기화
  const resetForm = () => {
    setTitle('')
    setContent('')
    setCommunityCategory('') // selectedCommunityCategory 초기화
    setImage(null) // image 초기화
    setPreviewUrl(null)
  }

  // 📤 외부 제출 요청 등록 (필요 시)
  useEffect(() => {
    if (onSubmitRequest) {
      // handleSubmit의 타입을 onSubmitRequest가 기대하는 타입에 맞게 캐스팅
      onSubmitRequest(handleSubmit as () => Promise<void>)
    }
  }, [onSubmitRequest, handleSubmit]) // handleSubmit을 의존성 배열에 추가

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

                      {/* ✨ 커뮤니티 카테고리 선택 ✨ */}
                      <div className="form-group mb-6">
                        <label className="text-gray-700 font-medium">
                          커뮤니티 카테고리*
                        </label>
                        <select
                          value={communityCategory}
                          onChange={e => setCommunityCategory(e.target.value)}
                          className="form-control">
                          <option value="" disabled hidden>
                            카테고리 선택
                          </option>{' '}
                          {/* 이 옵션은 선택 불가능 */}
                          <option value="GENERAL">일반 게시글</option>
                          <option value="EVENT">이벤트</option>
                          <option value="ANNOUNCEMENT">공지사항</option>
                          <option value="COMMUNITY">커뮤니티</option>
                        </select>
                        {!communityCategory && (
                          <p className="text-red-500 text-xs mt-1">
                            커뮤니티 카테고리를 선택해주세요.
                          </p>
                        )}
                      </div>

                      <div>
                        {/* 제목 입력 */}
                        <div className="form-group mb-6">
                          <label className="text-gray-700 font-medium">제목*</label>
                          <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                            className="form-control"
                          />
                        </div>

                        {/* 내용 입력 */}
                        <div className="form-group mb-6">
                          <label className="text-gray-700 font-medium">내용</label>
                          <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="내용을 입력하세요"
                            className="form-control"
                            rows={4}
                          />
                        </div>

                        {/* 이미지 업로드 */}
                        <div className="form-group mb-6">
                          <label className="text-gray-700 font-medium">
                            이미지 업로드
                          </label>
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
                </div>

                <div className="main-content bg-white p-8 rounded-xl shadow-lg mt-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-6">
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
