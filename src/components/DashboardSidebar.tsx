import {useState, useEffect} from 'react' // useState 추가
import {Link, useLocation} from 'react-router-dom'
import {useUserStore} from '../store/userStore'

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
  const {user, setUser} = useUserStore()
  // user 상태 가져오기
  const currentUser = useUserStore(state => state.user)

  // 회원 정보를 저장할 state 정의
  // useEffect 훅을 컴포넌트 본문 안으로 이동
  useEffect(() => {
    if (!user) {
      const memberData = sessionStorage.getItem('member')
      const token = sessionStorage.getItem('token')
      if (memberData) {
        try {
          const parsed: UserProfile = JSON.parse(memberData)
          console.log('[DashboardSidebar] 로그인된 사용자 정보:', parsed)
          setUser(parsed)
        } catch (err) {
          console.error('[DashboardSidebar] sessionStorage member 파싱 오류:', err)
        }
      } else {
        console.log('[DashboardSidebar] 로그인 정보가 없습니다.')
      }
      if (token) {
      }
    }
  }, [user, setUser]) // 빈 배열은 컴포넌트가 처음 마운트될 때 한 번만 실행되도록 합니다.

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="dashboard-sidebar">
      <div className="user-image">
        {/* state 값 사용 */}
        <img
          src={user?.profileImagePath || '/assets/images/items-grid/author-2.jpg'}
          alt="user"
        />
        <div className="user-info">
          {/* state 값 사용 */}
          <h3>{user?.nickname || '홍길동'}</h3>
          <Link to={`/member/profile/simple/${user?.mid}`} className="username">
            {user?.email || '@username'}
          </Link>
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
            <a className={isActive('/myfavourite') ? 'active' : ''} href="/myfavourite">
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
