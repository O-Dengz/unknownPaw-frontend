import {useState, useEffect} from 'react' // useEffect와 useState import
import {Link, useParams} from 'react-router-dom'
import './memberProfile.css'
import Header from '../../components/Layout/Header'
import {Footer} from '../../components/Layout/Footer'
import PawRating from '../../components/PawRating'
import ScrollToTopButton from '../../components/ScrollToTopButton'
import {getImageUrl} from '@/utils/getImageUrl' // Import getImageUrl
import { getPetImageUrl } from '@/utils/getPetImageUrl'

interface MemberResponseDTO {
  mid: number
  email: string
  nickname: string
  profileImagePath?: string
  pawRate?: number
  emailVerified?: boolean
  role?: string
  status?: string
  regDate?: string
}

interface PetDTO {
  petId: number
  petName: string
  breed: string
  petBirth?: string
  petMbti?: string
  weight?: number
  petIntroduce?: string
  petImagePath?: string
}

interface PostDTO {
  postId: number
  title: string
  content: string
  serviceCategory?: string
  hourlyRate: number
  likes?: number
  chatCount?: number
  defaultLocation: string
  regDate: string
  email?: string
  postTypeUrlSegment?: string
  image?: {
    imageId: number
    imagePath: string
    isMain: boolean
  }[]
  member?: MemberResponseDTO
}

export default function MemberProfile() {
  const {mid} = useParams() // URL 파라미터에서 mid를 가져옴

  // 백엔드에서 받을 MemberResponseDTO 타입의 데이터를 저장할 상태 변수
  const [memberDTO, setMemberDTO] = useState<MemberResponseDTO | null>(null)
  const [loadingBasic, setLoadingBasic] = useState(true) // 상태 이름 명확히 변경
  const [errorBasic, setErrorBasic] = useState<string | null>(null) // 상태 이름 명확히 변경

  const [pets, setPets] = useState<PetDTO[] | null>(null)
  const [loadingPets, setLoadingPets] = useState(true)
  const [errorPets, setErrorPets] = useState<string | null>(null)

  const [posts, setPosts] = useState<PostDTO[] | null>(null)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [errorPosts, setErrorPosts] = useState<string | null>(null)

  // 컴포넌트가 마운트되거나 mid가 변경될 때 데이터를 가져옵니다.
  useEffect(() => {
    if (!mid) {
      setErrorBasic('회원 ID를 찾을 수 없습니다.')
      setErrorPets('회원 ID를 찾을 수 없습니다.')
      setErrorPosts('회원 ID를 찾을 수 없습니다.')
      setLoadingBasic(false)
      setLoadingPets(false) // mid 없으면 다른 데이터도 로딩 종료
      setLoadingPosts(false)
      return // mid 없으면 API 호출 실행 안 함
    }

    const token = sessionStorage.getItem('token')
    if (!token) {
      console.warn('>>> Token is missing. Skipping authenticated fetches. <<<')
      setErrorBasic('로그인이 필요하거나 세션이 만료되었습니다.')
      setErrorPets('로그인이 필요합니다.')
      setErrorPosts('로그인이 필요합니다.')
      setLoadingBasic(false)
      setLoadingPets(false)
      setLoadingPosts(false)
      return // 토큰이 없으면 여기서 종료
    }

    const fetchBasicInfo = async () => {
      setLoadingBasic(true)
      setErrorBasic(null)

      try {
        const response = await fetch(`/api/member/profile/simple/${mid}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        })

        if (!response.ok) {
          const errorBody = await response
            .json()
            .catch(() => ({message: 'Failed to parse error body'}))
          if (response.status === 403 || response.status === 401) {
            throw new Error('로그인이 필요하거나 세션이 만료되었습니다.')
          }
          throw new Error(errorBody.message || `HTTP error! status: ${response.status}`)
        }
        const data: MemberResponseDTO = await response.json()
        console.log('Profile Image Path:', data.profileImagePath) // 여기에 로그 추가
        setMemberDTO(data)
      } catch (e: any) {
        console.error('Fetching basic info failed:', e)
        setErrorBasic(`회원 기본 정보를 불러오는데 실패했습니다: ${e.message}`)
      } finally {
        setLoadingBasic(false)
      }
    }

    // ✨✨✨ 펫 목록 호출 함수
    const fetchPets = async () => {
      setLoadingPets(true)
      setErrorPets(null)
      try {
        // ✨✨✨ 새로운 펫 목록 API 엔드포인트 호출
        const response = await fetch(`/api/member/${mid}/pets`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const errorBody = await response
            .json()
            .catch(() => ({message: 'Failed to parse error body'}))
          if (response.status === 403 || response.status === 401) {
            throw new Error('로그인이 필요합니다.')
          }
          throw new Error(errorBody.message || `HTTP error! status: ${response.status}`)
        }

        const data: PetDTO[] = await response.json() // ✨✨✨ List<PetDTO> 타입을 예상

        setPets(data) // ✨✨✨ 상태 업데이트
      } catch (e: any) {
        console.error('Fetching pets failed: ', e)
        setErrorPets(`반려동물 정보를 불러오는데 실패했습니다: ${e.message}`)
      } finally {
        setLoadingPets(false)
      }
    }

    // ✨✨✨ 게시글 목록 호출 함수
    const fetchPosts = async () => {
      setLoadingPosts(true)
      setErrorPosts(null)
      try {
        const response = await fetch(`/api/member/${mid}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        })

        if (!response.ok) {
          const errorBody = await response
            .json()
            .catch(() => ({message: 'Failed to parse error body'}))
          console.error(
            '>>> HTTP error response:',
            response.status,
            'Body:',
            errorBody,
            '<<<'
          )
          if (response.status === 403 || response.status === 401) {
            throw new Error('로그인이 필요합니다.')
          }
          throw new Error(errorBody.message || `HTTP error! status: ${response.status}`)
        }

        const data: PostDTO[] = await response.json() // ✨✨✨ List<PostDTO> 타입을 예상

        setPosts(data) // ✨✨✨ 상태 업데이트
      } catch (e: any) {
        console.error('Fetching posts failed:', e)
        setErrorPosts(`작성한 게시글 정보를 불러오는데 실패했습니다: ${e.message}`)
      } finally {
        setLoadingPosts(false)
      }
    }

    // ✨✨✨ 토큰이 존재할 때만 API 호출을 시도하도록 조건을 추가하는 것이 좋습니다.
    // 또는 토큰이 없을 때 로그인 페이지로 리다이렉트하는 로직을 여기에 추가합니다.
    if (mid && token) {
      // mid가 있고 토큰도 있을 때만 fetch 실행

      fetchBasicInfo()
      fetchPets()
      fetchPosts()
    } else if (!mid) {
      // mid가 없을 때 처리 (기존 로직 유지 또는 개선)

      setErrorBasic('회원 ID를 찾을 수 없습니다.')
      setErrorPets('회원 ID를 찾 수 없습니다.')
      setErrorPosts('회원 ID를 찾 수 없습니다.')
      setLoadingBasic(false)
      setLoadingPets(false)
      setLoadingPosts(false)
    } else if (!token) {
      // 토큰이 없을 때 처리 (기존 로직 유지 또는 개선)
      console.warn(
        'MID exists, but token is missing. Cannot perform authenticated fetches.'
      )
      setErrorBasic('로그인이 필요하거나 세션이 만료되었습니다.')
      setErrorPets('로그인이 필요합니다.')
      setErrorPosts('로그인이 필요합니다.')
      setLoadingBasic(false)
      setLoadingPets(false)
      setLoadingPosts(false)
      // 필요하다면 여기서 로그인 페이지로 리다이렉트
    }

    // 클린업 함수 (필요 시)
    return () => {}
  }, [mid])

  // --- 데이터 로딩 및 에러 상태 표시 ---
  if (loadingBasic || loadingPets || loadingPosts) {
    return <div className="profile-loading">프로필 정보 로딩 중...</div>
  }

  // 에라가 하나라도 있다면 에러 메시지 표시
  if (errorBasic || errorPets || errorPosts) {
    return (
      <div className="profile-error">
        <h2>오류 발생</h2>
        {errorBasic && <p>기본 정보: {errorBasic}</p>}
        {errorPets && <p>반려동물 정보: {errorPets}</p>}
        {errorPosts && <p>게시글 정보: {errorPosts}</p>}
      </div>
    )
  }

  if (!memberDTO) {
    return <div className="profile-notfound">회원 기본 정보를 찾을 수 없습니다.</div>
  }

  // --- 데이터가 모두 로드되었을 때 화면 표시 ---
  return (
    <>
      <Header />
      <main>
        <ScrollToTopButton />

        {/* 페이지 상단 브레드크럼 + 제목 */}
        <div className="breadcrumbs">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-6 col-12">
                <div className="breadcrumbs-content">
                  <h1 className="page-title">프로필</h1>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-12">
                <ul className="breadcrumb-nav">
                  <li>
                    <a href="/">홈</a>
                  </li>
                  <li>멤버 프로필</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 프로필 본문 */}
        <div className="dashboard section">
          <div className="container">
            <div className="row">
              <div className="col-12">
                {/* --- 회원 프로필 섹션 --- */}
                <div className="member-profile-container">
                  <div className="profile-header">
                    <div className="profile-image">
                      <img
                        src={
                          memberDTO.profileImagePath
                            ? getImageUrl(memberDTO.profileImagePath) // Use getImageUrl
                            : '/assets/images/items-grid/author-3.jpg'
                        }
                      />
                    </div>
                    <div className="profile-info">
                      <div className="author-name">
                        닉네임: <strong>{memberDTO.nickname || '정보 없음'}</strong>
                      </div>
                      <ul className="paw-rating">
                        <li>
                          <PawRating rating={memberDTO.pawRate || 0} />
                          <p>({memberDTO.pawRate?.toFixed(1)})</p>
                        </li>
                      </ul>
                    </div>
                    <div className="verification-badges">
                      <span className="badge">
                        {memberDTO.emailVerified
                          ? '이메일 인증 완료'
                          : '이메일 인증 안됨'}
                      </span>
                    </div>
                  </div>

                  {/* --- 반려동물 정보 섹션 --- */}
                  <section className="profile-section">
                    <h3 className="section-title">반려동물 정보</h3>
                    {pets && pets.length > 0 ? (
                      <div className="pets-list">
                        {pets.map((pet, index) => (
                          <div key={`${pet.petId}-${index}`} className="pet-card">
                            <div className="pet-image">
                              <img
                                src={
                                  getPetImageUrl(pet.petId, pet.petImagePath, pet.thumbnailPath) // ✨ 여기에 getPetImageUrl 사용
                                }
                                alt={`${pet.petName} 이미지`}
                                className="pet-image"
                              />
                            </div>
                           <div className="pet-info">
                              <h4>
                                이름: <strong>{pet.petName || '정보 없음'}</strong>
                              </h4>
                              <p>품종: {pet.breed || '정보 없음'}</p>
                              <p>MBTI: {pet.petMbti || '정보 없음'}</p>
                              <p>생년월일: {pet.petBirth || '정보 없음'}</p>
                              <p>
                                몸무게:{' '}
                                {pet.weight !== undefined
                                  ? `${pet.weight}kg`
                                  : '정보 없음'}
                              </p>
                              <p>소개: {pet.petIntroduce || '정보 없음'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>등록된 반려동물이 없습니다.</p>
                    )}
                  </section>

                  {/* --- 작성한 게시글 섹션 --- */}
                  <section className="profile-section">
                    <h3 className="section-title">작성한 게시글</h3>
                    {posts && posts.length > 0 ? (
                      <div className="posts-list">
                        {posts.map((post, index) => (
                          <div key={`${post.postId}-${index}`} className="post-card">
                            <Link
                              to={`/posts/${post.postTypeUrlSegment}/read/${post.postId}`}>
                              {post?.image && (
                                <img
                                  src={
                                    post.image.find(img => img.isMain)?.imagePath ??
                                    post.image[0].imagePath
                                  }
                                  alt={`${post.title} 대표 이미지`}
                                  className="post-image"
                                />
                              )}
                              <h4 className="post-title">{post.title || '제목 없음'}</h4>
                              <p>카테고리: {post.serviceCategory || '정보 없음'}</p>
                              {post.serviceCategory === 'petsitter' &&
                                post.hourlyRate !== undefined && (
                                  <p>시급: {post.hourlyRate}원</p>
                                )}
                              <p>지역: {post.defaultLocation || '정보 없음'}</p>
                              <p>
                                작성일:{' '}
                                {post.regDate
                                  ? new Date(post.regDate).toLocaleDateString()
                                  : '정보 없음'}
                              </p>
                              <div className="post-stats">
                                <span>
                                  <i className="lni lni-heart"></i>{' '}
                                  {post.likes ?? '정보 없음'}
                                </span>
                                <span>
                                  <i className="lni lni-comments"></i>{' '}
                                  {post.chatCount ?? '정보 없음'}
                                </span>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>작성한 게시글이 없습니다.</p>
                    )}
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
