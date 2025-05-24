import {useState, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import PetOwnerForm from './PetOwnerForm'
import PetSitterForm from './PetSitterForm'
import CommunityForm from './CommunityForm' // CommunityForm 컴포넌트 임포트 확인
import {DashboardSidebar} from '../../components/features/dashboard/DashboardSidebar'

interface PostData {
  title: string
  content: string
  serviceCategory?: string
  hourlyRate?: number
  defaultLocation?: string
  walkDate?: string
  petId?: number
  experience?: string
  certificates?: string[]
  communityCategory?: string
  images?: File[]
}

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
      return 'HOTELING'
    case '돌봄':
      return 'CARE'
    default:
      return 'WALK'
  }
}

export default function PostAd() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [category, setCategory] = useState('') // PetOwner | PetSitter | Community (메인 카테고리 선택)
  const [agree, setAgree] = useState(false)

  // 모든 폼 데이터를 하나의 상태로 관리
  const [postData, setPostData] = useState<PostData>({
    title: '',
    content: '',
    serviceCategory: '', // PetOwner/PetSitter용
    hourlyRate: 0,
    defaultLocation: '',
    communityCategory: '', // Community용 필드 추가
    images: [] // 이미지 배열 초기화
  })

  const nextStep = () => {
    if (step === 1 && !category) {
      alert('게시글 유형 카테고리를 선택해주세요') // "펫오너", "펫시터", "커뮤니티"
      return
    }
    setStep(s => Math.min(s + 1, 3))
  }

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1))
  }

  const handleFormDataChange = useCallback((data: Partial<PostData>) => {
    // images는 배열이므로 기존 배열을 유지하면서 새 이미지 추가/교체 로직 필요
    if (data.images !== undefined) {
      setPostData(prev => ({...prev, ...data, images: data.images}))
    } else {
      setPostData(prev => ({...prev, ...data}))
    }
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
      if (!token) {
        alert('로그인이 필요합니다.')
        return
      }

      const memberId = await ensureMemberId(token)
      let postIdToNavigate: number | null = null // 페이지 이동에 사용할 postId

      if (category === 'community') {
        // 🚀 커뮤니티 게시글: FormData로 DTO와 이미지 한 번에 전송
        // 유효성 검사 강화: communityCategory가 선택되었는지 확인
        if (!postData.communityCategory) {
          alert('커뮤니티 게시글 카테고리를 선택해주세요!') // '일반 게시글', '이벤트' 등
          return // 카테고리가 없으면 여기서 중단
        }
        if (!postData.title || !postData.content) {
          alert('제목과 내용을 입력해주세요.')
          return
        }

        const communityFormData = new FormData()

        // 1. DTO (게시글 내용)를 JSON 문자열로 변환 후 Blob으로 감싸서 FormData에 추가
        //    백엔드에서 @RequestPart("community")로 받으므로 "community"라는 이름으로 추가합니다.
        const dto = {
          title: postData.title,
          content: postData.content,
          communityCategory: postData.communityCategory // CommunityForm에서 받아온 값 사용
        }
        communityFormData.append(
          'community', // 🚨 이 부분을 "community"로 변경하여 백엔드와 일치
          new Blob([JSON.stringify(dto)], {type: 'application/json'})
        )

        console.log('커뮤니티 DTO 준비:', dto)

        // 2. 이미지 파일들(images)을 FormData에 추가 (존재하는 경우)
        //    백엔드에서 @RequestPart(value = "images", ...)로 받으므로 "images"라는 이름으로 추가합니다.
        if (postData.images && postData.images.length > 0) {
          postData.images.forEach(file => {
            communityFormData.append('images', file) // 🚨 이 부분을 "images"로 변경하여 백엔드와 일치
          })
          console.log('커뮤니티 이미지 준비:', postData.images.length, '개')
        } else {
          console.log('커뮤니티 게시글에 첨부된 이미지 없음')
        }

        // FormData 내용 확인 (디버깅용)
        for (let [key, value] of communityFormData.entries()) {
          console.log(`Community FormData -> ${key}:`, value)
        }

        // 3. 서버로 FormData 전송 (memberId는 @RequestParam이므로 URL에 포함)
        const postRes = await fetch(
          `/api/community/posts-with-image?memberId=${memberId}`, // 🚨 백엔드 컨트롤러 경로와 일치
          {
            method: 'POST',
            headers: {
              // Content-Type은 FormData 사용 시 브라우저가 자동으로 설정 (boundary 포함)
              // 수동으로 'multipart/form-data'를 설정하면 boundary 누락으로 오류 발생 가능
              Authorization: `Bearer ${token}`
            },
            body: communityFormData // FormData 객체를 body로 사용
          }
        )

        if (!postRes.ok) {
          const errorText = await postRes.text()
          console.error('[커뮤니티 게시글 등록 실패]', errorText, postRes.status)
          throw new Error(errorText || '커뮤니티 게시글 등록에 실패했습니다')
        }
        const response = await postRes.json() // 백엔드에서 postId를 반환
        postIdToNavigate = response // 백엔드가 postId 자체를 body로 반환한다고 가정 (Long 타입)
        console.log('커뮤니티 게시글 등록 성공, postId:', postIdToNavigate)

        // 중요: 커뮤니티의 경우 이미지가 함께 전송되므로, 별도의 이미지 업로드 로직이 필요 없습니다.
      } else {
        // 펫 오너/시터 게시글 (기존 로직 유지)
        const endpointType = toEndpointPath(category)
        const baseUrl = `/api/posts/${endpointType}`

        const dto = {
          title: postData.title,
          content: postData.content,
          serviceCategory: toServiceCategory(postData.serviceCategory as string),
          hourlyRate: postData.hourlyRate,
          defaultLocation: postData.defaultLocation,
          walkDate: postData.walkDate,
          petId: postData.petId,
          postType: toPostTypeEnum(category)
        }

        console.log('펫오너/시터 최종 전송 DTO:', JSON.stringify(dto, null, 2))

        const postRes = await fetch(`${baseUrl}/register?memberId=${memberId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // 여기는 JSON 방식 유지
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(dto)
        })

        if (!postRes.ok) {
          const errorText = await postRes.text()
          console.log('[전송되는 DTO (펫오너/시터)]', dto)
          console.error('[펫오너/시터 게시글 등록 실패]', errorText)
          throw new Error(errorText || '펫오너/시터 게시글 등록에 실패했습니다')
        }
        const response = await postRes.json()
        const actualPostId = response.postId // postId는 response 객체 안에 있다고 가정
        postIdToNavigate = actualPostId

        // 펫 오너/시터의 경우, 기존 이미지 업로드 로직 사용
        if (postData.images?.length && actualPostId) {
          const imgForm = new FormData()
          postData.images.forEach(f => imgForm.append('file', f))
          imgForm.append('targetId', String(actualPostId))

          const imgRes = await fetch(
            `/api/posts/image/upload/${category.toLowerCase()}`,
            {
              method: 'POST',
              headers: {Authorization: `Bearer ${token}`},
              body: imgForm
            }
          )
          if (!imgRes.ok) {
            const imgErrorText = await imgRes.text()
            console.error('[펫오너/시터 이미지 업로드 실패]', imgErrorText)
            // 게시글은 등록되었으나 이미지 업로드 실패 시 사용자에게 알릴 수 있음
            // (여기서는 에러를 던져서 전체 실패로 처리하지만, 정책에 따라 다를 수 있음)
            throw new Error(imgErrorText || '이미지 업로드에 실패했습니다')
          }
          console.log('펫오너/시터 이미지 업로드 성공')
        }
      }

      // 게시글 및 (필요시) 이미지 업로드 성공 후
      if (postIdToNavigate !== null) {
        alert('게시글이 성공적으로 등록되었습니다! 😄')
        navigate('/dashboard') // 또는 상세 페이지로 이동 navigate(`/community/${postIdToNavigate}`);
      } else {
        // postId를 못 받은 경우 (이런 경우는 거의 없어야 함)
        console.error('postId를 응답으로부터 받지 못했습니다.')
        alert('게시글 등록은 되었으나, 페이지 이동에 필요한 정보를 받지 못했습니다.')
        navigate('/dashboard') // 일단 대시보드로
      }
    } catch (err) {
      console.error('게시글 등록 전체 프로세스 에러:', err)
      alert(err instanceof Error ? err.message : '등록 중 오류가 발생했습니다')
    }
  }

  return (
    <section className="dashboard section mt-120">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12">
            <DashboardSidebar />
          </div>
          <div className="col-lg-9 col-md-8 col-12">
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
                            <option value="petowner">펫 오너</option>
                            <option value="petsitter">펫 시터</option>
                            <option value="community">커뮤니티</option>
                          </select>
                        </div>
                      )}
                      {step === 2 && (
                        <>
                          {category === 'petowner' && (
                            <PetOwnerForm onDataChange={handleFormDataChange} />
                          )}
                          {category === 'petsitter' && (
                            <PetSitterForm onDataChange={handleFormDataChange} />
                          )}
                          {category === 'community' && (
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
                            등록
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
