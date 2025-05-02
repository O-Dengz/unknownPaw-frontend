import {useLocation} from 'react-router-dom'

interface DashboardSidebarProps {
  userName?: string
  userImage?: string
  username?: string
}

export function DashboardSidebar({
  userName = '홍길동',
  userImage = '/assets/images/items-grid/author-2.jpg',
  username = '@username'
}: DashboardSidebarProps) {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="dashboard-sidebar">
      <div className="user-image">
        <img src={userImage} alt="user" />
        <div className="user-info">
          <h3>{userName}</h3>
          <a href="#" className="username">
            {username}
          </a>
        </div>
      </div>
      <div className="dashboard-menu">
        <ul>
          <li>
            <a className={isActive('/dashboard') ? 'active' : ''} href="/dashboard">
              <i className="lni lni-dashboard"></i> 대시보드
            </a>
          </li>
          <li>
            <a
              className={isActive('/profile-settings') ? 'active' : ''}
              href="/profile-settings">
              <i className="lni lni-pencil-alt"></i> 프로필 수정
            </a>
          </li>
          <li>
            <a className={isActive('/my-items') ? 'active' : ''} href="/my-items">
              <i className="lni lni-bolt-alt"></i> 내 게시글
            </a>
          </li>
          <li>
            <a
              className={isActive('/favourite-items') ? 'active' : ''}
              href="/favourite-items">
              <i className="lni lni-heart"></i> 찜한 게시글
            </a>
          </li>
          <li>
            <a className={isActive('/post-item') ? 'active' : ''} href="/post-item">
              <i className="lni lni-circle-plus"></i> 게시글 작성
            </a>
          </li>
          <li>
            <a
              className={isActive('/bookmarked-items') ? 'active' : ''}
              href="/bookmarked-items">
              <i className="lni lni-bookmark"></i> 북마크
            </a>
          </li>
          <li>
            <a className={isActive('/chatting') ? 'active' : ''} href="/chatting">
              <i className="lni lni-envelope"></i> 채팅
            </a>
          </li>
          <li>
            <a
              className={isActive('/delete-account') ? 'active' : ''}
              href="/delete-account">
              <i className="lni lni-close"></i> 회원 탈퇴
            </a>
          </li>
          <li>
            <a className={isActive('/invoice') ? 'active' : ''} href="/invoice">
              <i className="lni lni-printer"></i> 거래 내역
            </a>
          </li>
          <li>
            <a className={isActive('/FAQ') ? 'active' : ''} href="/FAQ">
              <i className="lni lni-home"></i> 자주 묻는 질문
            </a>
          </li>
        </ul>
        <div className="button">
          <a className="btn" href="#" onClick={e => e.preventDefault()}>
            로그아웃
          </a>
        </div>
      </div>
    </div>
  )
}
