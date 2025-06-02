import {useState, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import PetOwnerForm from './PetOwnerForm'
import PetSitterForm from './PetSitterForm'
import CommunityForm from './CommunityForm'
import {DashboardSidebar} from '../../components/features/dashboard/DashboardSidebar'

const toPostTypeEnum = (category: string): string => {
  const normalized = category.trim().toLowerCase()
  if (normalized === 'petowner') return 'PET_OWNER'
  if (normalized === 'petsitter') return 'PET_SITTER'
  if (normalized === 'community') return 'COMMUNITY'
  throw new Error('유효하지 않은 카테고리입니다.')
}

const toEndpointPath = (category: string): string => {
  const normalized = category.trim().toLowerCase()
  if (normalized === 'petowner') return 'petowner'
  if (normalized === 'petsitter') return 'petsitter'
  if (normalized === 'community') return 'community'
  throw new Error('유효하지 않은 카테고리입니다.')
}

const toServiceCategory = (category: string): string => {
  const normalized = category.trim().toUpperCase()
  if (['WALK', 'HOTEL', 'CARE'].includes(normalized)) return normalized
  throw new Error('유효하지 않은 서비스 카테고리입니다.')
}

interface PostData {
  title: string
  content: string
  serviceCategory: string
  hourlyRate: number
  defaultLocation: string
  serviceDate?: string
  images?: File[]
  petId?: number
  petExperience?: string
  license?: string[]
}

export default function PostAd() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [category, setCategory] = useState('') // PetOwner | PetSitter | Community
  const [agree, setAgree] = useState(false)

  const [postData, setPostData] = useState<PostData>({
    title: '',
    content: '',
    serviceCategory: '',
    hourlyRate: 0,
    defaultLocation: ''
  })

  const nextStep = () => {
    if (step === 1 && !category) {
      alert('카테고리를 선택해주세요')
      return
    }
    setStep(s => Math.min(s + 1, 3))
  }

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1))
  }

  const handleFormDataChange = useCallback((data: Partial<PostData>) => {
    const result: Partial<PostData> = {...data}
    // serviceDate가 "YYYY-MM-DD"라면 자동 변환
    if (result.serviceDate && /^\d{4}-\d{2}-\d{2}$/.test(result.serviceDate)) {
      result.serviceDate = result.serviceDate + 'T00:00:00'
    }
    setPostData(prev => ({...prev, ...result}))
  }, [])
  const ensureMemberId = async (token: string): Promise<string> => {
    const mid = sessionStorage.getItem('mid')
    if (mid) return mid

    const res = await fetch('/api/member/profile/simple/me', {
      headers: {Authorization: `Bearer ${token}`}
    })
    if (!res.ok) throw new Error('회원 정보를 불러오지 못했습니다')
    const me = await res.json()
    sessionStorage.setItem('mid', String(me.mid))
    return String(me.mid)
  }

  const handleSubmit = async () => {
    if (!agree) {
      alert('이용약관에 동의해주세요')
      return
    }

    try {
      const token = sessionStorage.getItem('token')
      if (!token) throw new Error('로그인이 필요합니다')

      const memberId = await ensureMemberId(token)
      const endpointType = toEndpointPath(category)

      // 커뮤니티 게시글인 경우 다른 엔드포인트 사용
      if (category === 'Community') {
        const formData = new FormData()
        const communityDTO = {
          title: postData.title,
          content: postData.content,
          communityCategory: postData.serviceCategory || 'GENERAL' // 선택된 카테고리 사용, 없으면 GENERAL
        }
        formData.append(
          'community',
          new Blob([JSON.stringify(communityDTO)], {
            type: 'application/json'
          })
        )

        if (postData.images && postData.images.length > 0) {
          postData.images.forEach(file => formData.append('images', file))
        }

        const response = await fetch(`/api/community/posts?memberId=${memberId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(errorText || '게시글 등록에 실패했습니다')
        }

        alert('게시글이 성공적으로 등록되었습니다! 😄')
        navigate('/community/posts')
        return
      }

      // 기존 펫시터/펫오너 게시글 로직
      const postDTO = {
        title: postData.title,
        content: postData.content,
        serviceCategory: toServiceCategory(postData.serviceCategory),
        hourlyRate: String(postData.hourlyRate),
        defaultLocation: postData.defaultLocation,
        serviceDate: postData.serviceDate,
        petId: postData.petId,
        petExperience: postData.petExperience,
        license: postData.license
      }

      let endpoint
      let body: string | FormData
      let headers: Record<string, string>

      if (postData.images && postData.images.length > 0) {
        endpoint = `/api/posts/${endpointType}/registerWithImage?memberId=${memberId}`
        body = new FormData()
        body.append('post', JSON.stringify(postDTO))
        postData.images.forEach(file => (body as FormData).append('file', file))
        headers = {Authorization: `Bearer ${token}`}
      } else {
        endpoint = `/api/posts/${endpointType}/register?memberId=${memberId}`
        body = JSON.stringify(postDTO)
        headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }

      const postRes = await fetch(endpoint, {
        method: 'POST',
        headers,
        body
      })

      if (!postRes.ok) {
        const errorText = await postRes.text()
        throw new Error(errorText || '게시글 등록에 실패했습니다')
      }

      alert('게시글이 성공적으로 등록되었습니다! 😄')
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : '등록 중 오류가 발생했습니다')
    }
  }
  return (
    <div className="page-wrapper">
      {/* --- Breadcrumb --------------------------------------------------- */}
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="page-title">게시글 작성</h1>
            </div>
            <div className="col-lg-6">
              <ul className="breadcrumb-nav">
                <li>
                  <a href="/">홈</a>
                </li>
                <li>게시글 작성</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* --- 본문 --------------------------------------------------------- */}
      <section className="dashboard section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-12">
              <DashboardSidebar />
            </div>
            <div className="col-lg-9 col-md-8 col-14">
              <div className="main-content">
                <div className="dashboard-stats">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="main-content bg-white p-8 rounded-xl shadow-lg">
                        <div className="settings-tabs mb-4">
                          <button
                            className={`tab-button ${step === 1 ? 'active' : ''}`}
                            onClick={() => setStep(1)}>
                            카테고리 설정
                          </button>
                          <button
                            className={`tab-button ${step === 2 ? 'active' : ''}`}
                            onClick={() => setStep(2)}>
                            상세 내용
                          </button>
                          <button
                            className={`tab-button ${step === 3 ? 'active' : ''}`}
                            onClick={() => setStep(3)}>
                            이용약관
                          </button>
                        </div>

                        <h2 className="text-2xl font-bold mb-8">게시글 작성</h2>

                        {step === 1 && (
                          <div className="form-group">
                            <label className="text-gray-700 font-medium">카테고리*</label>
                            <select
                              className="form-control"
                              value={category}
                              onChange={e => setCategory(e.target.value)}>
                              <option value="">카테고리 선택</option>
                              <option value="PetOwner">펫 오너</option>
                              <option value="PetSitter">펫 시터</option>
                              <option value="Community">커뮤니티</option>
                            </select>
                          </div>
                        )}

                        {step === 2 && (
                          <>
                            {category === 'PetOwner' && (
                              <PetOwnerForm onDataChange={handleFormDataChange} />
                            )}
                            {category === 'PetSitter' && (
                              <PetSitterForm onDataChange={handleFormDataChange} />
                            )}
                            {category === 'Community' && (
                              <CommunityForm onDataChange={handleFormDataChange} />
                            )}
                          </>
                        )}

                        {step === 3 && (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
                            {/* 약관 내용 */}
                            <div className="flex items-center mt-4">
                              <input
                                type="checkbox"
                                id="agree"
                                checked={agree}
                                onChange={e => setAgree(e.target.checked)}
                                className="mr-2"
                              />
                              <label htmlFor="agree" className="text-sm">
                                위 이용약관에 동의합니다
                              </label>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between mt-6">
                          {step > 1 && (
                            <button
                              onClick={prevStep}
                              className="reserve-button"
                              style={{width: '120px'}}>
                              이전
                            </button>
                          )}
                          {step < 3 ? (
                            <button
                              onClick={nextStep}
                              className="reserve-button"
                              style={{width: '120px'}}>
                              다음
                            </button>
                          ) : (
                            <button
                              onClick={handleSubmit}
                              className="reserve-button"
                              style={{width: '120px'}}>
                              등록하기
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
