import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

interface CommunityPost {
  title: string
  content: string
  communityCategory: string
  imageUrl?: string
}

export default function ModifyCommunityPost() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<CommunityPost | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return

      try {
        const token = sessionStorage.getItem('token')
        if (!token) throw new Error('로그인이 필요합니다.')

        const res = await fetch(`/api/community/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!res.ok) throw new Error('게시글을 불러올 수 없습니다.')

        const data = await res.json()
        setPost(data)
        setTitle(data.title)
        setContent(data.content)
        setCategory(data.communityCategory)
        setPreviewUrl(data.imageUrl || null)
      } catch (err) {
        console.error(err)
        alert(err instanceof Error ? err.message : '오류 발생')
      }
    }

    fetchPost()
  }, [postId])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleUpdate = async () => {
    if (!title || !content || !category || !postId) {
      alert('모든 항목을 입력해주세요')
      return
    }

    try {
      const token = sessionStorage.getItem('token')
      if (!token) throw new Error('로그인이 필요합니다.')

      const formData = new FormData()
      formData.append(
        'communityRequestDTO',
        new Blob([JSON.stringify({ title, content, communityCategory: category })], {
          type: 'application/json'
        })
      )
      if (image) formData.append('communityImage', image)

      const res = await fetch(`/api/community/posts/${postId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText)
      }

      alert('수정 완료! 🎉')
      navigate('/community')
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : '수정 실패')
    }
  }

  const handleDelete = async () => {
    if (!postId) return
    const confirmed = window.confirm('정말 삭제하시겠습니까?')
    if (!confirmed) return

    try {
      const token = sessionStorage.getItem('token')
      if (!token) throw new Error('로그인이 필요합니다.')

      const res = await fetch(`/api/community/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('삭제 실패')

      alert('삭제 완료!')
      navigate('/community')
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : '삭제 실패')
    }
  }

  if (!post) return <div className="text-center p-6">로딩 중...</div>

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-center mb-6">커뮤니티 글 수정</h2>

      <div className="form-group mb-4">
        <label className="font-medium">카테고리*</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-control">
          <option value="" disabled hidden>카테고리 선택</option>
          <option value="GENERAL">일반 게시글</option>
          <option value="EVENT">이벤트</option>
          <option value="ANNOUNCEMENT">공지사항</option>
          <option value="COMMUNITY">커뮤니티</option>
        </select>
      </div>

      <div className="form-group mb-4">
        <label className="font-medium">제목*</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="form-group mb-4">
        <label className="font-medium">내용*</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="form-control"
          rows={10}
        />
      </div>

      <div className="form-group mb-4">
        <label className="font-medium">이미지</label>
        <div className="border-2 border-dashed p-4 rounded-lg text-center cursor-pointer" onClick={() => document.getElementById('imageInput')?.click()}>
          <div className="text-4xl mb-1">+</div>
          <p>파일 선택</p>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {previewUrl && (
          <div className="mt-4">
            <img src={previewUrl} alt="미리보기" className="max-h-64 rounded-md border mx-auto" />
          </div>
        )}
      </div>

      <div className="flex gap-4 justify-center mt-6">
        <button onClick={handleUpdate} className="btn btn-primary">수정하기</button>
        <button onClick={handleDelete} className="btn btn-danger">삭제하기</button>
      </div>
    </div>
  )
}
