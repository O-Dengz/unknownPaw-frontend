import {useState, useEffect} from 'react'
import {DashboardSidebar} from '../../components/features/dashboard/DashboardSidebar'
import {useUserStore} from '@/store/userStore'
import {Link} from 'react-router-dom'

/* ────────── 남는 타입은 PetSummary 하나뿐 ────────── */
interface PetSummary {
  petId: number
  petName: string
  breed: string
  imagePath?: string | null
}

export default function Dashboard() {
  /* zustand */
  const {user, setUser} = useUserStore()

  /* local state */
  const [pets, setPets] = useState<PetSummary[]>([])
  const [isLoading, setLoading] = useState(true)

  /* 회원‧펫 데이터 로딩 */
  useEffect(() => {
    ;(async () => {
      if (!user) {
        const raw = sessionStorage.getItem('member')
        if (raw) {
          try {
            setUser(JSON.parse(raw))
          } catch (e) {
            console.error('[Dashboard] member 파싱 오류', e)
          }
        }
      }

      /* 펫 요약 불러오기 (필요 시) */
      const token = sessionStorage.getItem('token')
      if (token) {
        try {
          const res = await fetch('/api/pet/me/summary', {
            headers: {Authorization: `Bearer ${token}`}
          })
          if (res.ok) setPets(await res.json())
        } catch (e) {
          console.error('[Dashboard] 펫 로딩 실패', e)
        }
      }

      setLoading(false)
    })()
  }, [user, setUser])

  if (isLoading) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{textAlign: 'center', padding: '50px'}}>
          로딩중...
        </div>
      </div>
    )
  }

  /* ======================= JSX ======================= */
  return (
    <div className="page-wrapper">
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">대시보드</h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>대시보드</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="dashbard selection">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-12">
              <DashboardSidebar />
            </div>

            <div className="col-lg-9 col-md-8 col-12">
              <div className="main-content">
                {/* --- 예약 통계 카드 --- */}
                {/* 그대로 유지, 필요 없으면 삭제 가능 */}

                {/* --- 내 정보 & 펫 정보 --- */}
                <div className="row">
                  {/* 내 정보 */}
                  <div className="col-lg-6 col-md-12 col-12">
                    <div className="dashboard-block">
                      <h3 className="block-title">내 정보</h3>
                      {user ? (
                        <ul className="profile-summary">
                          <li>
                            <strong>닉네임</strong> : {user.nickname}
                          </li>
                          <li>
                            <strong>이메일</strong> : {user.email}
                          </li>
                          <li>
                            <strong>전화번호</strong> : {user.phoneNumber ?? '-'}
                          </li>
                          <li>
                            <strong>주소</strong> : {user.address ?? '-'}
                          </li>
                          <li>
                            <strong>가입일</strong> :{' '}
                            {user.regDate
                              ? new Date(user.regDate).toLocaleDateString()
                              : '-'}
                          </li>
                        </ul>
                      ) : (
                        <p>프로필 정보를 불러오는 중…</p>
                      )}
                    </div>
                  </div>

                  {/* 펫 정보 */}
                  <div className="col-lg-6 col-md-12 col-12">
                    <div className="dashboard-block">
                      <h3 className="block-title">펫 정보</h3>
                      {pets.length ? (
                        <ul className="pet-summary">
                          {pets.map(p => (
                            <li key={p.petId} className="pet-item">
                              <img
                                src={
                                  p.imagePath
                                    ? `/api/pets/image/${p.petId}/${p.imagePath
                                        .split('/')
                                        .pop()}`
                                    : '/assets/images/pet/default-thumb.jpg'
                                }
                                alt={p.petName}
                              />
                              <div className="pet-text">
                                <strong>{p.petName}</strong>
                                <span>{p.breed}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>등록된 반려동물이 없습니다.</p>
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
  )
}
