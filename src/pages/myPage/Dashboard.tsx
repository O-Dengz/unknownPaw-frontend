import {useState} from 'react'
import {DashboardSidebar} from '../../components/DashboardSidebar'

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

export default function Dashboard() {
  const [activityLogs] = useState<ActivityLog[]>([
    {
      icon: 'lni lni-alarm',
      title: '프로필 정보가 업데이트되었습니다',
      time: '12분 전'
    },
    {
      icon: 'lni lni-alarm',
      title: '비밀번호가 변경되었습니다',
      time: '59분 전'
    },
    {
      icon: 'lni lni-alarm',
      title: '펫호텔 예약이 확정되었습니다',
      time: '5시간 전'
    },
    {
      icon: 'lni lni-alarm',
      title: '새로운 미용 예약이 등록되었습니다',
      time: '8시간 전'
    },
    {
      icon: 'lni lni-alarm',
      title: '프리미엄 회원으로 업그레이드되었습니다',
      time: '1일 전'
    }
  ])

  const [recentAds] = useState<RecentAd[]>([
    {
      image: '/assets/images/items-grid/item1.jpg',
      title: '강아지 미용 서비스',
      time: '12분 전'
    },
    {
      image: '/assets/images/items-grid/item2.jpg',
      title: '고양이 호텔 예약',
      time: '5일 전'
    },
    {
      image: '/assets/images/items-grid/item3.jpg',
      title: '강아지 훈련 서비스',
      time: '1주일 전'
    },
    {
      image: '/assets/images/items-grid/item4.jpg',
      title: '고양이 미용 서비스',
      time: '3주일 전'
    }
  ])

  const handleRemove = (index: number) => {
    // 삭제 로직 구현
  }

  return (
    <div>
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
                  <a href="/">
                    <img src="/assets/images/logo/logo.png" alt="UnknownPaw" style={{ height: '30px' }} />
                  </a>
                </li>
                <li>대시보드</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <section className="dashboard section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-12">
              <DashboardSidebar />
            </div>
            <div className="col-lg-9 col-md-8 col-12">
              <div className="main-content">
                <div className="dashboard-stats">
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-12">
                      <div className="stat-card">
                        <div className="stat-icon">
                          <i className="lni lni-checkmark-circle"></i>
                        </div>
                        <div className="stat-info">
                          <h3>12</h3>
                          <p>총 예약 건수</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12">
                      <div className="stat-card featured">
                        <div className="stat-icon">
                          <i className="lni lni-bolt"></i>
                        </div>
                        <div className="stat-info">
                          <h3>3</h3>
                          <p>진행중인 예약</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12">
                      <div className="stat-card expired">
                        <div className="stat-icon">
                          <i className="lni lni-emoji-sad"></i>
                        </div>
                        <div className="stat-info">
                          <h3>2</h3>
                          <p>만료된 예약</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-6 col-md-12 col-12">
                    <div className="activity-log dashboard-block">
                      <h3 className="block-title">활동 내역</h3>
                      <ul>
                        {activityLogs.map((log, index) => (
                          <li key={index} className="activity-item">
                            <div className="activity-icon">
                              <i className="lni lni-alarm"></i>
                            </div>
                            <div className="activity-content">
                              <h4>{log.title}</h4>
                              <p>{log.time}</p>
                            </div>
                            <button
                              className="remove-btn"
                              onClick={() => handleRemove(index)}>
                              <i className="lni lni-close"></i>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12 col-12">
                    <div className="recent-ads dashboard-block">
                      <h3 className="block-title">최근 예약</h3>
                      <ul>
                        {recentAds.map((ad, index) => (
                          <li key={index} className="ad-item">
                            <div className="ad-image">
                              <img
                                src={'/assets/images/items-grid/img2.jpg'}
                                alt={ad.title}
                              />
                            </div>
                            <div className="ad-content">
                              <h4>{ad.title}</h4>
                              <p>{ad.time}</p>
                            </div>
                            <button
                              className="remove-btn"
                              onClick={() => handleRemove(index)}>
                              <i className="lni lni-close"></i>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
