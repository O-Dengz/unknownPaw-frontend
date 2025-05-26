import {useCallback, useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import PetOwnerForm from './PetOwnerForm'
import type {PostFormData} from './PetOwnerForm'
import {DashboardSidebar} from '../../components/features/dashboard/DashboardSidebar'

export default function ModifyPetOwnerPost() {
  const {postType, postId} = useParams()
  const [initialData, setInitialData] = useState<Partial<PostFormData> | null>(null)
  const [initialImageUrl, setInitialImageUrl] = useState<string | null>(null)
  const [editedData, setEditedData] = useState<PostFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const navigate = useNavigate()

  // 기존 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)

      try {
        const res = await fetch(`/api/posts/${postType}/read/${postId}`, {
          headers: {Authorization: `Bearer ${sessionStorage.getItem('token')}`}
        })
        if (!res.ok) throw new Error('게시글을 불러오지 못했습니다.')
        const data = await res.json()
        console.log('불러온 data:', data)
        console.log('불러온 이미지 URL:', data.images?.[0]?.imagePath)
        setInitialData({...data, petId: data.petId})
        setInitialImageUrl(
          data.images?.[0]?.imagePath ? data.images[0].imagePath : null
        )      } catch (e) {
        setError('게시글 정보를 불러올 수 없습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [postType, postId])

  const handleFormDataChange = useCallback(
    (data: PostFormData) => {
      const result = {...data}
      // serviceDate가 있는 경우 형식 변환
      if (result.serviceDate) {
        // YYYY-MM-DD 형식이면 시간 추가
        if (/^\d{4}-\d{2}-\d{2}$/.test(result.serviceDate)) {
          result.serviceDate = result.serviceDate + 'T00:00:00'
        }
        // 이미 올바른 형식이 아니면 변환
        else if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(result.serviceDate)) {
          try {
            const date = new Date(result.serviceDate)
            result.serviceDate = date.toISOString().slice(0, 19)
          } catch (e) {
            console.error('잘못된 날짜 형식:', result.serviceDate)
          }
        }
      }
      setEditedData(result)
    },
    []
  )
  const handleSubmit = async () => {
    if (!editedData) {
      alert("수정된 내용이 없습니다.");
      return;
    }
    if (!postId) {
      alert("잘못된 접근입니다. postId가 없습니다.");
      return;
    }
    try {
      const formData = new FormData();
      
      // post 데이터 추가
      formData.append(
        "post",
        JSON.stringify({
          ...editedData,
          postId: Number(postId),
        })
      );
      
      // postId 추가
      formData.append("postId", postId.toString());
      
      // 이미지 파일 추가 (editedData에서 이미지 파일 가져오기)
      if (editedData.images && editedData.images.length > 0) {
        // 이미지가 File 객체인 경우에만 추가
        const imageFile = editedData.images[0];
        if (imageFile instanceof File) {
          formData.append("file", imageFile);
        }
      }
  
      const response = await fetch(`/api/posts/${postType}/modifyWithImage`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "수정 실패");
      }
  
      alert("수정되었습니다!");
      navigate(-1);
    } catch (e) {
      console.error("수정 중 오류:", e);
      alert("수정 중 오류가 발생했습니다.");
    }
  };
  
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
              <h2 className="text-xl font-bold mb-6">게시글 수정</h2>
              <PetOwnerForm
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
