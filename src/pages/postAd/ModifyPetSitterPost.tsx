import {useCallback, useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import PetSitterForm from './PetSitterForm'
import type {PostFormData} from './PetSitterForm'
import {DashboardSidebar} from '../../components/features/dashboard/DashboardSidebar'

export default function ModifySitterPost() {
  const {postType, postId} = useParams()
  const [initialData, setInitialData] = useState<Partial<PostFormData> | null>(null)
  const [initialImageUrl, setInitialImageUrl] = useState<string | null>(null)
  const [editedData, setEditedData] = useState<PostFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // 🟡 기존 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/posts/${postType}/read/${postId}`, {
          headers: {Authorization: `Bearer ${sessionStorage.getItem('token')}`}
        })
        if (!res.ok) throw new Error('게시글을 불러오지 못했습니다.')
        const data = await res.json()
        setInitialData({
          ...data,
          petExperience: data.petExperience,
          license: data.license,
          images: undefined
        })
        setInitialImageUrl(data.images?.[0]?.imagePath ? data.images[0].imagePath : null)
      } catch (e) {
        setError('게시글 정보를 불러올 수 없습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [postType, postId])

  // 🟢 폼 데이터 변화 감지
  const handleFormDataChange = useCallback(
    (data: PostFormData) => setEditedData(data),
    []
  )

  // 🟢 수정 제출
  const handleSubmit = async () => {
    if (!editedData) {
      alert('수정된 내용이 없습니다.')
      return
    }
    try {
      let response
      if (editedData.images && editedData.images.length > 0) {
        const formData = new FormData()
        formData.append('post', JSON.stringify({...editedData, postId}))
        for (const file of editedData.images) formData.append('file', file)
        response = await fetch(
          `/api/posts/${postType}/modifyWithImage?postId=${postId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`
            },
            body: formData
          }
        )
      } else {
        response = await fetch(`/api/posts/${postType}/modify`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          },
          body: JSON.stringify({...editedData, postId})
        })
      }
      if (!response.ok) throw new Error('수정 실패')
      alert('수정되었습니다!')
      navigate(-1)
    } catch (e) {
      alert('수정 중 오류가 발생했습니다.')
    }
  }

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>{error}</div>
  if (!initialData) return <div>초기 데이터를 불러올 수 없습니다.</div>

  return (
    <section className="dashboard section" style={{paddingTop: '100px'}}>
      <div className="container">
        <div className="row">
          {/* 왼쪽: 대시보드/사이드 메뉴 */}
          <div className="col-lg-3 col-md-4 col-12">
            <DashboardSidebar />
          </div>
          {/* 오른쪽: 게시글 수정 폼 */}
          <div className="col-lg-9 col-md-8 col-12">
            <div className="main-content bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold mb-6">시터 게시글 수정</h2>
              <PetSitterForm
                onDataChange={handleFormDataChange}
                initialData={initialData}
                initialImageUrl={initialImageUrl}
                mode="edit"
              />
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 rounded-lg font-bold text-gray-900">
                  수정하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
