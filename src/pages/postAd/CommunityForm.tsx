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

  // 카테고리 변경 시 폼 초기화
  useEffect(() => {
    if (communityCategory) {
      setTitle('')
      setContent('')
      setImage(null)
      setPreviewUrl(null)
      sessionStorage.removeItem('community_title')
      sessionStorage.removeItem('community_content')
    }
  }, [communityCategory])

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
        // alert(err instanceof Error ? err.message : '알 수 없는 오류입니다.') // Canvas에서 alert 사용 지양
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
      // alert('회원 정보를 다시 확인해주세요 😥') // Canvas에서 alert 사용 지양
      console.error('회원 정보를 다시 확인해주세요 😥');
      return
    }

    if (!communityCategory) {
      // alert('카테고리를 선택해주세요!') // Canvas에서 alert 사용 지양
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
        'community', // 백엔드 @RequestPart("community")와 일치
        new Blob([JSON.stringify(communityData)], {type: 'application/json'})
      )
      // ⭐ 이 부분을 수정합니다: 'communityImage' -> 'images'
      if (image) formData.append('images', image) // ⭐ 백엔드 @RequestPart(value = "images")와 일치

      // 백엔드 URL 경로: /api/community/posts (POST)
      const url = `/api/community/posts?memberId=${member.id}` 

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          // 'Content-Type': 'multipart/form-data'는 FormData 사용 시 자동으로 설정됩니다.
          // 직접 설정하면 Boundary가 누락되어 오류가 발생할 수 있습니다.
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      if (!res.ok) {
        const errText = await res.text()
        console.error('응답 실패:', errText)
        throw new Error(`게시글 등록에 실패했어요 😢 (${errText})`)
      }

      // alert('게시글 등록 성공! 🥳') // Canvas에서 alert 사용 지양
      console.log('게시글 등록 성공! 🥳');
      resetForm()
      onDataChange?.(true)
    } catch (err) {
      console.error('제출 오류:', err)
      // alert(err instanceof Error ? err.message : '예상치 못한 오류 발생!') // Canvas에서 alert 사용 지양
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target

    // 카테고리가 변경되면 폼 초기화
    if (name === 'communityCategory') {
      setTitle('')
      setContent('')
      setImage(null)
      setPreviewUrl(null)
      sessionStorage.removeItem('community_title')
      sessionStorage.removeItem('community_content')
      setCommunityCategory(value) // 이 부분을 먼저 업데이트하여 useEffect가 올바르게 감지하도록 함
    }

    // 모든 변경사항에 대해 onDataChange 호출
    // 카테고리 변경 시 초기화 로직 후 호출되어야 함
    if (name !== 'communityCategory') {
      onDataChange?.({[name]: value})
    } else {
      // 카테고리 변경 시 초기화된 상태로 전달
      onDataChange?.({
        communityCategory: value,
        title: '',
        content: '',
        images: undefined
      })
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    onDataChange?.({title: e.target.value})
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    onDataChange?.({content: e.target.value})
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      onDataChange?.({images: [file]})
    }
  }

  // 이미지 삭제 핸들러 개선
  const handleRemoveImage = () => {
    setImage(null)
    setPreviewUrl(null)
    // 부모에게 이미지 삭제 알림 (images: undefined)
    onDataChange?.({images: undefined})
    // 파일 입력 필드 초기화 (동일 파일 재선택 위해)
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) (fileInput as HTMLInputElement).value = ''
  }

  return (
    <>
      {' '}
      {/* Component should only return the inner content */}
      {/* === 커뮤니티 글쓰기 폼 카드 === */}
      {/* This card will be placed inside the layout provided by PostAd.tsx */}
      <div className="main-content bg-white p-8 rounded-xl shadow-lg mb-6">
        {' '}
        {/* mb-6 added for spacing */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-15">
          커뮤니티 글쓰기
        </h2>
        {/* ✨ 커뮤니티 카테고리 선택 ✨ */}
        <div className="form-group mb-6">
          <label className="text-gray-700 font-medium">커뮤니티 카테고리*</label>
          <select
            name="communityCategory"
            value={communityCategory}
            onChange={handleChange}
            className="form-control">
            <option value="" disabled hidden>
              카테고리 선택
            </option>
            <option value="GENERAL">일반 게시글</option>
            <option value="EVENT">이벤트</option>
            <option value="ANNOUNCEMENT">공지사항</option>
            <option value="COMMUNITY">커뮤니티</option>
          </select>
          {!communityCategory && (
            <p className="text-red-500 text-xs mt-1">카테고리를 선택해주세요</p>
          )}
        </div>
        {/* 제목 */}
        <div className="form-group mb-6">
          <label className="text-gray-700 font-medium">제목*</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleTitleChange}
            className="form-control"
            placeholder="제목을 입력하세요"
          />
        </div>
        {/* 내용 */}
        <div className="form-group mb-6">
          <label className="text-gray-700 font-medium">내용*</label>
          <textarea
            name="content"
            value={content}
            onChange={handleContentChange}
            className="form-control"
            rows={10}
            placeholder="내용을 입력하세요"
          />
        </div>
        {/* === 이미지 업로드 섹션 === */}
        <div className="form-group mb-6">
          <label className="text-gray-700 font-medium">이미지</label>
          {/* File selection area */}
          <div
            className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center text-gray-500 relative cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => document.getElementById('imageInput')?.click()}>
            <div className="text-4xl mb-1">+</div>
            <p style={{marginBottom: '0.5rem'}}>파일 선택</p>
            {/* Actual file input */}
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-sm mt-1 text-gray-400">최대 업로드 용량: 5MB</p>
          </div>

          {/* Image preview and delete button */}
          {previewUrl && (
            <div className="mt-4 relative w-full max-w-xs mx-auto">
              {' '}
              {/* Preview container */}
              <img
                src={previewUrl}
                alt="미리보기"
                className="w-full h-auto object-cover rounded-md border"
                style={{maxHeight: '300px'}} // Height limit
              />
              {/* Delete button */}
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 shadow-md transition-colors">
                {/* Delete icon (svg) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>{' '}
      {/* End of 커뮤니티 글쓰기 폼 카드 */}
      {/* === 작성자 정보 카드 === */}
      <div className="main-content bg-white p-8 rounded-xl shadow-lg mt-6">
        {' '}
        {/* mt-6 for spacing */}
        <h4 className="text-xl font-semibold text-gray-800 mb-6">👤 작성자 정보</h4>
        {member && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {' '}
            {/* Responsive grid */}
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
            <div className="form-group col-span-1 md:col-span-2">
              {' '}
              {/* Responsive col-span */}
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
      </div>{' '}
      {/* End of 작성자 정보 카드 */}
    </>
  )
}
