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
  switch (category.trim().toLowerCase()) {
    case 'petowner':
      return 'pet_owner'
    case 'petsitter':
      return 'pet_sitter'
    case 'community':
      return 'community'
    default:
      throw new Error('유효하지 않은 카테고리입니다.')
  }
}

const toServiceCategory = (kor: string): string => {
  switch (kor) {
    case '산책':
      return 'WALK'
    case '호텔링':
      return 'HOTEL'
    case '돌봄':
      return 'CARE'
    default:
      return 'WALK'
  }
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

      // 1️⃣ postDTO 데이터 구성
      const postDTO = {
        title: postData.title,
        content: postData.content,
        serviceCategory: postData.serviceCategory,
        hourlyRate: String(postData.hourlyRate),
        defaultLocation: postData.defaultLocation,
        serviceDate: postData.serviceDate,
        petId: postData.petId,
        petExperience: postData.petExperience,
        license: postData.license
      }

      console.log('전송하는 serviceCategory:', postData.serviceCategory)

      // 2️⃣ 이미지 유무에 따라 분기
      let endpoint
      let body: string | FormData
      let headers: Record<string, string>

      if (postData.images && postData.images.length > 0) {
        // 이미지가 있다면 ➡️ registerWithImage + FormData
        endpoint = `/api/posts/${endpointType}/registerWithImage?memberId=${memberId}`
        body = new FormData()
        body.append('post', JSON.stringify(postDTO)) // ⭐️ 백엔드에서 postJson으로 받음
        postData.images.forEach(file => (body as FormData).append('file', file))
        headers = {Authorization: `Bearer ${token}`} // Content-Type 지정 X!
      } else {
        // 이미지가 없다면 ➡️ register + JSON
        endpoint = `/api/posts/${endpointType}/register?memberId=${memberId}`
        body = JSON.stringify(postDTO)
        headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }

      // 3️⃣ fetch 실행
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
    <section className="dashboard section" style={{paddingTop: '100px'}}>
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
                      <h2 className="text-2xl font-bold mb-8">게시글 작성</h2>
                      <div className="flex justify-between mb-10">
                        {['카테고리 설정', '상세 내용', '이용약관'].map((label, idx) => {
                          const n = idx + 1
                          return (
                            <div key={n} className="text-center flex-1">
                              <div
                                className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold ${
                                  step === n
                                    ? 'bg-[var(--primary)] text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}>
                                {n}
                              </div>
                              <div
                                className={`mt-2 text-sm ${
                                  step === n ? 'text-[var(--primary)]' : 'text-gray-500'
                                }`}>
                                {label}
                              </div>
                            </div>
                          )
                        })}
                      </div>

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
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                            이전
                          </button>
                        )}
                        {step < 3 ? (
                          <button
                            onClick={nextStep}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ml-auto">
                            다음
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ml-auto">
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
  )
}
