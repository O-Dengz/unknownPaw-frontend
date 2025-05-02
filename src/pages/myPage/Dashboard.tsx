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
      title: 'Your Profile Updated!',
      time: '12 Minutes Ago'
    },
    {
      icon: 'lni lni-alarm',
      title: 'You change your password',
      time: '59 Minutes Ago'
    },
    {
      icon: 'lni lni-alarm',
      title: 'Your ads approved!',
      time: '5 Hours Ago'
    },
    {
      icon: 'lni lni-alarm',
      title: 'You submit a new ads',
      time: '8 hours Ago'
    },
    {
      icon: 'lni lni-alarm',
      title: 'You subscribe as a pro user!',
      time: '1 day Ago'
    }
  ])

  const [recentAds] = useState<RecentAd[]>([
    {
      image: '/assets/images/items-grid/item1.jpg',
      title: 'iPhone 11 Pro Max',
      time: '12 Minutes Ago'
    },
    {
      image: '/assets/images/items-grid/item2.jpg',
      title: 'Polaris 600 Assault 144',
      time: '5 days Ago'
    },
    {
      image: '/assets/images/items-grid/item3.jpg',
      title: 'Brand New Bagpack',
      time: '1 week Ago'
    },
    {
      image: '/assets/images/items-grid/item4.jpg',
      title: 'Honda Civic VTi 2023',
      time: '3 week Ago'
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
                <h1 className="page-title">Dashboard</h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <a href="/">Home</a>
                </li>
                <li>Dashboard</li>
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
                          <h3>340</h3>
                          <p>Total Ad Posted</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12">
                      <div className="stat-card featured">
                        <div className="stat-icon">
                          <i className="lni lni-bolt"></i>
                        </div>
                        <div className="stat-info">
                          <h3>23</h3>
                          <p>Featured Ads</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12">
                      <div className="stat-card expired">
                        <div className="stat-icon">
                          <i className="lni lni-emoji-sad"></i>
                        </div>
                        <div className="stat-info">
                          <h3>45</h3>
                          <p>Expired Ads</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-6 col-md-12 col-12">
                    <div className="activity-log dashboard-block">
                      <h3 className="block-title">My Activity Log</h3>
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
                      <h3 className="block-title">Recent Ads</h3>
                      <ul>
                        {recentAds.map((ad, index) => (
                          <li key={index} className="ad-item">
                            <div className="ad-image">
                              <img src={ad.image} alt={ad.title} />
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
