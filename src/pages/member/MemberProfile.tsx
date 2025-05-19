import {useState, useEffect} from 'react' // useEffect와 useState import
import {Link, useParams} from 'react-router-dom'
import './memberProfile.css'
import {post} from 'axios'
import PawRating from '../../components/PawRating'
import {useToken} from '../../hooks'

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
    console.log('>>> useEffect callback running. mid value:', mid, '<<<') // useEffect 시작 로그 유지

    if (!mid) {
      console.log('>>> mid is NOT valid, skipping fetches <<<') // mid 유효성 로그 유지
      setErrorBasic('회원 ID를 찾을 수 없습니다.')
      setErrorPets('회원 ID를 찾을 수 없습니다.')
      setErrorPosts('회원 ID를 찾을 수 없습니다.')
      setLoadingBasic(false)
      setLoadingPets(false) // mid 없으면 다른 데이터도 로딩 종료
      setLoadingPosts(false)
      return // mid 없으면 API 호출 실행 안 함
    }

    // ✨ 토큰 변수를 useEffect 스코프 안에 선언
    const token = sessionStorage.getItem('token') // 또는 localStorage.getItem('jwtToken');
    console.log('>>> Retrieved token:', token, '<<<') // 가져온 토큰 값 확인
    // ✨✨✨ 토큰이 없을 때 API 호출을 건너뛰고 에러 상태를 설정하는 로직을 여기에 둡니다.
    if (!token) {
      console.warn('>>> Token is missing. Skipping authenticated fetches. <<<')
      setErrorBasic('로그인이 필요하거나 세션이 만료되었습니다.')
      setErrorPets('로그인이 필요합니다.')
      setErrorPosts('로그인이 필요합니다.')
      setLoadingBasic(false)
      setLoadingPets(false)
      setLoadingPosts(false)
      // ✨ 토큰이 없을 때 로그인 페이지로 리다이렉트하는 로직을 여기에 추가할 수 있습니다.
      // import { useNavigate } from 'react-router-dom';
      // const navigate = useNavigate();
      // navigate('/login');
      return // 토큰이 없으면 여기서 종료
    }

    const fetchBasicInfo = async () => {
      console.log('>>> fetchBasicInfo function called <<<')
      setLoadingBasic(true) // 로딩 시작
      setErrorBasic(null) // 이전 에러 초기화

      try {
        console.log('Fetching profile for mid:', mid) // ✨ 추가: 페칭 시작 로그
        const response = await fetch(
          `http://localhost:8080/unknownPaw/api/member/profile/simple/${mid}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (!response.ok) {
          const errorBody = await response
            .json()
            .catch(() => ({message: 'Failed to parse error body'})) // 403 또는 401 에러 시 사용자에게 로그인 필요 메시지 표시
          if (response.status === 403 || response.status === 401) {
            throw new Error('로그인이 필요하거나 세션이 만료되었습니다.')
          }
          throw new Error(errorBody.message || `HTTP error! status: ${response.status}`)
        }
        const data: MemberResponseDTO = await response.json() // 타입 지정
        console.log('Received basic info:', data, '<<<')
        setMemberDTO(data)
      } catch (e: any) {
        console.error('Fetching basic info failed:', e)
        setErrorBasic(`회원 기본 정보를 불러오는데 실패했습니다: ${e.message}`)
      } finally {
        setLoadingBasic(false) // 로딩 종료
        console.log('>>> Fetching basic info process finished <<<')
      }
    }

    // ✨✨✨ 펫 목록 호출 함수
    const fetchPets = async () => {
      console.log('>>> fetchPets function called 펫 목록 <<<')
      setLoadingPets(true)
      setErrorPets(null)
      try {
        console.log(
          '>>> Attempting to fetch pets from URL:',
          `http://localhost:8080/unknownPaw/api/member/${mid}/pets`,
          '<<<'
        )
        // ✨✨✨ 새로운 펫 목록 API 엔드포인트 호출
        const response = await fetch(
          `http://localhost:8080/unknownPaw/api/member/${mid}/pets`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

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
        console.log('>>> Received pets data:', data, '<<<')
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
        console.log(
          '>>> Attempting to fetch posts from URL:',
          `http://localhost:8080/unknownPaw/api/member/${mid}/posts`,
          '<<<'
        )

        const response = await fetch(
          `http://localhost:8080/unknownPaw/api/member/${mid}/posts`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

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
        console.log('>>> Received posts data:', data, '<<<')
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
      console.log('MID and token are valid. Proceeding with authenticated fetches.')
      fetchBasicInfo()
      fetchPets()
      fetchPosts()
    } else if (!mid) {
      // mid가 없을 때 처리 (기존 로직 유지 또는 개선)
      console.log('MID is missing. Cannot fetch profile data.')
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
    return () => {
      console.log('>>> useEffect cleanup running for mid:', mid, '<<<')
    }
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
    console.log('>>> Rendering "Not Found" state (memberDTO is null) <<<')
    return <div className="profile-notfound">회원 기본 정보를 찾을 수 없습니다.</div>
  }

  // --- 데이터가 모두 로드되었을 때 화면 표시 ---
  console.log('>>> Rendering Member Profile with data <<<')
  return (
    <div className="dashboard section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="box-jali">oo</div> {/* 전체 컨테이너 */}
            <div className="member-profile-container">
              {/* --- 1. 회원 기본 정보 섹션 --- */}
              <div className="profile-header">
                <div className="profile-image">
                  <img
                    src={
                      memberDTO.profileImagePath?.trim()
                        ? memberDTO.profileImagePath
                        : '/assets/images/items-grid/author-3.jpg'
                    }
                    alt={`${memberDTO.nickname} 프로필 이미지`}
                    className="profile-image"
                  />
                </div>
                <div className="profile-info">
                  <div className="profile-top"></div>
                  <div className="author-name">
                    닉네임: <strong>{memberDTO.nickname || '정보 없음'}</strong>
                  </div>
                  <ul className="paw-rating">
                    <li>
                      <PawRating rating={memberDTO.pawRate || 0} />
                      {/* <PawRating rating={3.1} /> */}
                      <p>({memberDTO.pawRate?.toFixed(1)})</p>
                    </li>
                  </ul>
                  <p className="introduction"></p>
                </div>
                <div className="verification-badges">
                  <span className="badge">
                    {memberDTO.emailVerified ? '이메일 인증 완료' : '이메일 인증 안됨'}
                  </span>
                </div>
              </div>

              {/* --- 2. 회원의 Pet 정보 섹션 --- */}
              <section className="profile-section ">
                <h3 className="section-title">반려동물 정보</h3>
                {/* ✨✨✨ pets 상태를 확인하여 데이터 표시 또는 정보 없음 메시지 표시 */}
                {pets && pets.length > 0 ? ( // pets 배열이 존재하고 비어있지 않으면
                  <div className="pets-list">
                    {pets.map(
                      (
                        pet,
                        index // 펫 목록을 순회하며 각 펫 정보를 표시
                      ) => (
                        <div key={`${pet.petId}-${index}`} className="pet-card">
                          {' '}
                          {/* 각 펫 아이템 컨테이너, 고유 key 필수 */}
                          <div className="pet-image">
                            <img
                              src={
                                pet.petImagePath?.trim()
                                  ? pet.petImagePath
                                  : '/assets/images/pet/dog-1.jpg'
                              }
                              alt={`${pet.petName} 이미지`}
                              className="pet-image"
                            />
                          </div>
                          <div className="pet-info">
                            <h4>
                              이름: <strong>{pet.petName || '정보 없음'}</strong>
                            </h4>{' '}
                            {/* 펫 이름 표시 */}
                            <p>품종: {pet.breed || '정보 없음'}</p> {/* 펫 품종 표시 */}
                            <p>MBTI: {pet.petMbti || '정보 없음'}</p> {/* 펫 MBTI 표시 */}
                            <p>생년월일: {pet.petBirth || '정보 없음'}</p>{' '}
                            {/* 펫 생일 표시 */}
                            <p>
                              몸무게:{' '}
                              {pet.weight !== undefined ? pet.weight + 'kg' : '정보 없음'}
                            </p>{' '}
                            {/* 펫 몸무게 표시 */}
                            <p>소개: {pet.petIntroduce || '정보 없음'}</p>{' '}
                            {/* 펫 소개 표시 */}
                            {/* ... PetDTO의 다른 필드들도 필요하다면 여기서 표시 ... */}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  // ✨✨✨ pets 상태가 null이거나 비어있으면 "정보 없음" 메시지 표시
                  <p>등록된 반려동물이 없습니다.</p>
                )}
              </section>
              {/* --- 3. 회원이 작성한 Post 정보 섹션 --- */}
              <section className="profile-section ">
                <h3 className="section-title">작성한 게시글</h3>
                {/* ✨✨✨ posts 상태를 확인하여 데이터 표시 또는 정보 없음 메시지 표시 */}
                {posts && posts.length > 0 ? ( // posts 배열이 존재하고 비어있지 않으면
                  <div className="posts-list">
                    {posts.map(
                      (
                        post,
                        index // 게시글 목록을 순회하며 각 게시글 정보를 표시
                      ) => (
                        <div key={`${post.postId}-${index}`} className="post-card">
                          <Link
                            to={`/posts/${post.postTypeUrlSegment}/read/${post.postId}`}>
                            {' '}
                            {/* 각 게시글 아이템 컨테이너, 고유 key 필수 */}
                            {post?.image && ( // 게시글 대표 이미지 경로가 있다면 이미지 표시
                              <img
                                src={
                                  post.image?.find(img => img.isMain)?.imagePath ??
                                  post.image[0].imagePath
                                }
                                alt={`${post.title} 대표 이미지`}
                                className="post-image"
                              />
                            )}
                            <h4 className="post-title">{post.title || '제목 없음'}</h4>{' '}
                            {/* 게시글 제목 표시 */}
                            <p>카테고리: {post.serviceCategory || '정보 없음'}</p>{' '}
                            {/* 게시글 카테고리 표시 */}
                            {/* 시터글인 경우에만 시급 표시 (hourlyRate는 Optional일 수 있으니 체크) */}
                            {post.serviceCategory === 'petsitter' &&
                              post.hourlyRate !== undefined && (
                                <p>시급: {post.hourlyRate}원</p>
                              )}
                            <p>지역: {post.defaultLocation || '정보 없음'}</p>{' '}
                            {/* 지역 표시 */}
                            <p>
                              작성일:{' '}
                              {post.regDate
                                ? new Date(post.regDate).toLocaleDateString()
                                : '정보 없음'}
                            </p>{' '}
                            {/* 날짜 형식화 */}
                            <div className="post-stats">
                              <span>
                                <i className="lni lni-heart"></i>{' '}
                                {post.likes !== undefined ? post.likes : '정보 없음'}
                              </span>
                              <span>
                                <i className="lni lni-comments"></i>{' '}
                                {post.chatCount !== undefined
                                  ? post.chatCount
                                  : '정보 없음'}
                              </span>
                            </div>
                          </Link>
                          {/* 좋아요 수 표시 */}
                          {/* ... PostDTO의 다른 필드들도 필요하다면 여기서 표시 ... */}
                          {/* 필요하다면 각 게시글 클릭 시 상세 페이지로 이동하는 Link 추가 */}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  // ✨✨✨ posts 상태가 null이거나 비어있으면 "정보 없음" 메시지 표시
                  <p>작성한 게시글이 없습니다.</p>
                )}
              </section>
              {/* ... 프로필 페이지의 나머지 레이아웃 요소들 ... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
