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

                {step === 1 && (
                  <h2 className="text-2xl font-bold mb-8">게시글 작성</h2>
                )}

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
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '24px',
                    padding: '20px',
                    background: 'linear-gradient(to bottom, #f8fafc, #ffffff)',
                    borderRadius: '16px'
                  }}>
                    {/* 서비스 소개 */}
                    <div style={{
                      background: 'white',
                      padding: '32px',
                      borderRadius: '16px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: '1px solid rgba(226, 232, 240, 0.8)'
                    }}>
                      <h3 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: '#1e293b',
                        marginBottom: '20px',
                        letterSpacing: '-0.5px'
                      }}>
                        서비스 이용약관
                      </h3>
                      <p style={{
                        fontSize: '16px',
                        lineHeight: '1.7',
                        color: '#475569',
                        marginBottom: '16px'
                      }}>
                        본 게시글을 통해 진행되는 반려견 돌봄 활동(이하 '케어 서비스')은 "모르는 개 산책(이하 '플랫폼')"을 통해 연결된
                        보호자(이하 '의뢰인')와 돌보미(이하 '케어자') 간의 자율적인 계약에 따라 이루어집니다.
                      </p>
                      <p style={{
                        fontSize: '16px',
                        lineHeight: '1.7',
                        color: '#475569'
                      }}>
                        플랫폼은 중개 및 커뮤니티 서비스만을 제공하며, 케어 서비스의
                        실제 이행 및 그 과정에서 발생하는 문제(사고, 분쟁, 보상 등)에 대해 직접적인 책임을 지지 않습니다.
                      </p>
                    </div>

                    {/* 제1조 */}
                    <div style={{
                      background: 'white',
                      padding: '32px',
                      borderRadius: '16px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: '1px solid rgba(226, 232, 240, 0.8)'
                    }}>
                      <h4 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#1e293b',
                        marginBottom: '20px',
                        letterSpacing: '-0.5px'
                      }}>
                        제1조 [케어 활동 전 확인 의무]
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          marginBottom: '16px',
                          padding: '12px',
                          background: '#f8fafc',
                          borderRadius: '8px'
                        }}>
                          <span style={{
                            color: '#3b82f6',
                            marginRight: '12px',
                            fontSize: '20px'
                          }}>•</span>
                          <span style={{
                            fontSize: '16px',
                            lineHeight: '1.6',
                            color: '#475569'
                          }}>
                            의뢰인과 케어자는 서비스 이전에 반려견의 성향, 건강 상태 등을 충분히 협의해야 합니다.
                          </span>
                        </li>
                        <li style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          padding: '12px',
                          background: '#f8fafc',
                          borderRadius: '8px'
                        }}>
                          <span style={{
                            color: '#3b82f6',
                            marginRight: '12px',
                            fontSize: '20px'
                          }}>•</span>
                          <span style={{
                            fontSize: '16px',
                            lineHeight: '1.6',
                            color: '#475569'
                          }}>
                            의뢰인은 반려견의 예방접종, 기초훈련 여부 등을 반드시 확인해야 합니다.
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* 제2조 */}
                    <div style={{
                      background: 'white',
                      padding: '32px',
                      borderRadius: '16px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: '1px solid rgba(226, 232, 240, 0.8)'
                    }}>
                      <h4 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#1e293b',
                        marginBottom: '20px',
                        letterSpacing: '-0.5px'
                      }}>
                        제2조 [서비스 이용 규칙]
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          marginBottom: '16px',
                          padding: '12px',
                          background: '#f8fafc',
                          borderRadius: '8px'
                        }}>
                          <span style={{
                            color: '#3b82f6',
                            marginRight: '12px',
                            fontSize: '20px'
                          }}>•</span>
                          <span style={{
                            fontSize: '16px',
                            lineHeight: '1.6',
                            color: '#475569'
                          }}>
                            모든 서비스는 플랫폼을 통해 예약하고 결제해야 합니다.
                          </span>
                        </li>
                        <li style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          padding: '12px',
                          background: '#f8fafc',
                          borderRadius: '8px'
                        }}>
                          <span style={{
                            color: '#3b82f6',
                            marginRight: '12px',
                            fontSize: '20px'
                          }}>•</span>
                          <span style={{
                            fontSize: '16px',
                            lineHeight: '1.6',
                            color: '#475569'
                          }}>
                            서비스 이용 중 발생하는 문제는 플랫폼의 고객센터를 통해 해결할 수 있습니다.
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* 제3조 */}
                    <div style={{
                      background: 'white',
                      padding: '32px',
                      borderRadius: '16px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: '1px solid rgba(226, 232, 240, 0.8)'
                    }}>
                      <h4 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#1e293b',
                        marginBottom: '20px',
                        letterSpacing: '-0.5px'
                      }}>
                        제3조 [개인정보 보호]
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          marginBottom: '16px',
                          padding: '12px',
                          background: '#f8fafc',
                          borderRadius: '8px'
                        }}>
                          <span style={{
                            color: '#3b82f6',
                            marginRight: '12px',
                            fontSize: '20px'
                          }}>•</span>
                          <span style={{
                            fontSize: '16px',
                            lineHeight: '1.6',
                            color: '#475569'
                          }}>
                            회원의 개인정보는 서비스 제공을 위해 필요한 최소한의 정보만 수집합니다.
                          </span>
                        </li>
                        <li style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          padding: '12px',
                          background: '#f8fafc',
                          borderRadius: '8px'
                        }}>
                          <span style={{
                            color: '#3b82f6',
                            marginRight: '12px',
                            fontSize: '20px'
                          }}>•</span>
                          <span style={{
                            fontSize: '16px',
                            lineHeight: '1.6',
                            color: '#475569'
                          }}>
                            수집된 정보는 서비스 제공 외의 목적으로는 사용되지 않습니다.
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* 동의 체크박스 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '20px',
                      background: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: '1px solid rgba(226, 232, 240, 0.8)'
                    }}>
                      <input
                        type="checkbox"
                        id="agree"
                        checked={agree}
                        onChange={e => setAgree(e.target.checked)}
                        style={{
                          width: '20px',
                          height: '20px',
                          marginRight: '12px',
                          accentColor: '#3b82f6'
                        }}
                      />
                      <label
                        htmlFor="agree"
                        style={{
                          fontSize: '16px',
                          fontWeight: '500',
                          color: '#1e293b'
                        }}>
                        약관에 동의합니다.
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
      </section>
    </div>
  )
}
