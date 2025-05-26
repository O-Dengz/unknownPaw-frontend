import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import toast from 'react-hot-toast'

interface UserProfile {
  mid: number
  email: string
  nickname: string
  profileImagePath: string | null
  pawRate: number
  address: string | null
  phoneNumber: string | null
  emailVerified: boolean
  regDate: string | null
  role: string
  status: string
}

export function DashboardSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, setUser } = useUserStore()

  useEffect(() => {
    if (!user) {
      const memberData = sessionStorage.getItem('member')
      if (memberData) {
        try {
          const parsed: UserProfile = JSON.parse(memberData)
          setUser(parsed)
        } catch (err) {
          console.error('[DashboardSidebar] sessionStorage member 파싱 오류:', err)
        }
      }
    }
  }, [user, setUser])

  const isActive = (path: string) => location.pathname === path

  // 로그아웃 핸들러
  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('member')
    localStorage.removeItem('token')
    toast.success('성공적으로 로그아웃 되었습니다.')
    navigate('/login')
  }

  return (
    <div className="dashboard-sidebar">
      <div className="user-image">
        <img
          src={user?.profileImagePath || '/assets/images/items-grid/author-2.jpg'}
          alt="user"
        />
        <div className="user-info">
          <h3>{user?.nickname || '홍길동'}</h3>
          <Link to={`/member/profile/simple/${user?.mid}`} className="username">
            {user?.email || '@username'}
          </Link>
        </div>
      </div>
      <div className="dashboard-menu">
        <ul>
          <li>
            <Link className={isActive('/dashboard') ? 'active' : ''} to="/dashboard">
              <i className="lni lni-dashboard"></i> 대시보드
            </Link>
          </li>
          <li>
            <Link className={isActive('/profile-settings') ? 'active' : ''} to="/profile-settings">
              <i className="lni lni-pencil-alt"></i> 프로필 수정
            </Link>
          </li>
          <li>
            <Link className={isActive('/my-posts') ? 'active' : ''} to="/my-posts">
              <i className="lni lni-bolt-alt"></i> 내 게시글
            </Link>
          </li>
          <li>
            <Link className={isActive('/myfavourite') ? 'active' : ''} to="/myfavourite">
              <i className="lni lni-heart"></i> 찜한 게시글
            </Link>
          </li>
          <li>
            <Link className={isActive('/postad') ? 'active' : ''} to="/postad">
              <i className="lni lni-circle-plus"></i> 게시글 작성
            </Link>
          </li>
          <li>
            <Link className={isActive('/chatting') ? 'active' : ''} to="/chatting">
              <i className="lni lni-envelope"></i> 채팅
            </Link>
          </li>
          <li>
            <Link className={isActive('/reservation-details') ? 'active' : ''} to="/reservation-details">
              <i className="lni lni-printer"></i> 예약 내역
            </Link>
          </li>
          <li>
            <Link className={isActive('/FAQ') ? 'active' : ''} to="/FAQ">
              <i className="lni lni-home"></i> 자주 묻는 질문
            </Link>
          </li>
        </ul>
        <div className="button">
          <a className="btn" href="#" onClick={handleLogout}>
            로그아웃
          </a>
        </div>
      </div>
    </div>
  )
}