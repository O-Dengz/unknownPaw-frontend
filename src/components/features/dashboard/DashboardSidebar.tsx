import {useLocation, useNavigate} from 'react-router-dom'
import {useUserStore} from '@/store/userStore'
import toast from 'react-hot-toast'
import {getImageUrl} from '@/utils/getImageUrl'
import {Link} from 'react-router-dom'

export function DashboardSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const {user} = useUserStore()

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
        {user ? (
          <img
            src={
              user.profileImagePath
                ? getImageUrl(user.profileImagePath)
                : '/assets/images/items-grid/author-2.jpg'
            }
            alt={user.nickname || '프로필 이미지'}
          />
        ) : (
          <div
            className="loading-placeholder"
            style={{width: '100%', height: '100%', backgroundColor: '#f0f0f0'}}
          />
        )}
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
            <Link
              className={isActive('/profile-settings') ? 'active' : ''}
              to="/profile-settings">
              <i className="lni lni-pencil-alt"></i> 프로필 수정
            </Link>
          </li>
          <li>
            <Link className={isActive('/my-posts') ? 'active' : ''} to="/my-posts">
              <i className="lni lni-bolt-alt"></i> 내 게시글
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
            <Link
              className={isActive('/reservation-details') ? 'active' : ''}
              to="/reservation-details">
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
