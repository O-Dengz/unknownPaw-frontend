import { useState, useCallback } from 'react'
import {useNavigate} from 'react-router-dom'
import PetOwnerForm from './PetOwnerForm'
import PetSitterForm from './PetSitterForm'
import CommunityForm from './CommunityForm'
import {DashboardSidebar} from '../../components/DashboardSidebar'

// 공통 Post 데이터 타입 정의
interface PostData {
  title: string
  content: string
  serviceCategory: string
  desiredHourlyRate: number
  defaultLocation: string
  walkDate?: string
  images?: File[]
  petId?: number
  experience?: string
  certificates?: string[]
}

interface ActivityLog {
  icon: string
  title: string
  time: string
}

interface RecentAd {
  image: string
  title: string
  time: string
}

export default function PostAd() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState('')
  const [agree, setAgree] = useState(false)
  const [postData, setPostData] = useState<PostData>({
    title: '',
    content: '',
    serviceCategory: '',
    desiredHourlyRate: 0,
    defaultLocation: ''
  })

  const nextStep = () => {
    if (step === 1 && !category) {
      alert('카테고리를 선택해주세요.')
      return
    }
    setStep(prev => Math.min(prev + 1, 3))
  }

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const handleSubmit = async () => {
    if (!agree) {
      alert('이용약관에 동의해주세요.')
      return
    }

    try {
      const token = sessionStorage.getItem('token')
      if (!token) {
        throw new Error('로그인이 필요합니다.')
      }

      const formData = new FormData()

      // 기본 데이터를 JSON으로 추가
      formData.append(
        'postData',
        JSON.stringify({
          ...postData,
          postType: category.toUpperCase()
        })
      )

      // 이미지가 있다면 추가
      if (postData.images) {
        Array.from(postData.images).forEach(image => {
          formData.append('images', image)
        })
      }

      const response = await fetch(`/api/posts/${category.toLowerCase()}/register`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('게시글 등록에 실패했습니다.')
      }

      const result = await response.json()
      console.log('등록 성공! 🎉', result)
      alert('게시글이 성공적으로 등록되었습니다! 😄')
      navigate('/dashboard') // 등록 후 대시보드로 이동
    } catch (error) {
      console.error('등록 실패 😭', error)
      alert(error instanceof Error ? error.message : '게시글 등록에 실패했습니다.')
    }
  }

  const handleFormDataChange = useCallback(
    (data: Partial<PostData>) => setPostData(prev => ({ ...prev, ...data })),
    []             
  )

  return (
    <section className="dashboard section">
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 col-md-4 col-12">
            <DashboardSidebar />
          </div>

          {/* Main Content */}
          <div className="col-lg-9 col-md-8 col-14">
            <div className="main-content">
              <div className="dashboard-stats">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-12">
                    <div className="main-content bg-white p-8 rounded-xl shadow-lg">
                      <h2 className="text-2xl font-bold mb-30">게시글 작성</h2>

                      {/* Stepper */}
                      <div className="flex justify-between mb-10">
                        {['카테고리 설정', '상세 내용', '이용약관'].map((label, i) => {
                          const stepNum = i + 1
                          return (
                            <div key={stepNum} className="text-center flex-1">
                              <div
                                className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold ${
                                  step === stepNum
                                    ? 'bg-[var(--primary)] text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}>
                                {stepNum}
                              </div>
                              <div
                                className={`mt-2 text-sm ${
                                  step === stepNum
                                    ? 'text-[var(--primary)]'
                                    : 'text-gray-500'
                                }`}>
                                {label}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Step 1 - Category Selection */}
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

                      {/* Step 2 - Form Content */}
                      {step === 2 && (
                        <div>
                          {category === 'PetOwner' && (
                            <PetOwnerForm onDataChange={handleFormDataChange} />
                          )}
                          {category === 'PetSitter' && (
                            <PetSitterForm onDataChange={handleFormDataChange} />
                          )}
                          {category === 'Community' && (
                            <CommunityForm onDataChange={handleFormDataChange} />
                          )}
                        </div>
                      )}

                      {/* Step 3 - Terms and Conditions */}
                      {step === 3 && (
                        <div>
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
                            <h3 className="text-lg font-semibold mb-4">이용약관</h3>
                            <div className="text-sm text-gray-600 mb-4 space-y-4">
                              <p>
                                <strong>1. 서비스 이용 약관</strong>
                                <br />본 약관은 UnknownPaw(이하 "회사")가 제공하는
                                반려동물 돌봄 서비스(이하 "서비스")의 이용 조건을
                                정합니다.
                              </p>
                              <p>
                                <strong>2. 게시물 관련 규정</strong>
                                <br />
                                - 게시물의 저작권은 작성자에게 있으며, 서비스 내 게시물로
                                인해 발생하는 문제는 작성자 본인에게 책임이 있습니다.
                                <br />- 회사는 서비스의 품질 향상을 위해 게시물을 활용할
                                수 있습니다.
                              </p>
                              <p>
                                <strong>3. 서비스 이용 규칙</strong>
                                <br />
                                - 허위 정보 기재 및 타인을 사칭하는 행위를 금지합니다.
                                <br />
                                - 불법적이거나 부적절한 내용의 게시를 금지합니다.
                                <br />- 타인의 권리를 침해하거나 불쾌감을 주는 행위를
                                금지합니다.
                              </p>
                              <p>
                                <strong>4. 책임과 의무</strong>
                                <br />
                                - 서비스 이용 중 발생하는 문제에 대해 회사는 관련 법령이
                                정하는 범위 내에서 책임을 집니다.
                                <br />- 회원은 자신의 계정과 관련된 모든 활동에 대해
                                책임을 져야 합니다.
                              </p>
                              <p>
                                <strong>5. 개인정보 보호</strong>
                                <br />- 회사는 관련 법령이 정하는 바에 따라 회원의
                                개인정보를 보호하며, 이용자 정보는 서비스 제공과 관련된
                                목적으로만 사용됩니다.
                              </p>
                            </div>
                            <div className="flex items-center">
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
                        </div>
                      )}

                      {/* Navigation Buttons */}
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
