import {useEffect, useState} from 'react'
import axios from 'axios'
import {DashboardSidebar} from '../../components/DashboardSidebar'

interface DashboardSummary {
  postCounts: {petOwner: number; petSitter: number; community: number}
  likedCount: number
  reservations: {walk: number; care: number; hotel: number}
  latestPostTitle: string
  latestPostDate: string
  latestReservationDate: string
}

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)

  // 📌 날짜를 사람이 읽기 좋은 "몇분전" 형식으로 포맷
  const getRelativeTime = (iso: string): string => {
    const now = new Date()
    const date = new Date(iso)
    const diffMs = now.getTime() - date.getTime()

    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(diffMs / (1000 * 60))
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (seconds < 60) return `${seconds}초 전`
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    return `${days}일 전`
  }

  useEffect(() => {
    const fetchData = async () => {
      const mid = Number(sessionStorage.getItem('mid')) || 1
      try {
        const res = await axios.get<DashboardSummary>(
          `http://localhost:8080/unknownPaw/api/member/${mid}/summary`
        )
        setSummary(res.data)
      } catch (error) {
        console.error('📛 summary 데이터 불러오기 실패:', error)
      }
    }

    fetchData()
  }, [])

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
                {summary ? (
                  <>
                    {/* 🔹 통계 카드 */}
                    <div className="dashboard-stats">
                      <div className="row">
                        <div className="col-lg-4 col-md-4 col-12">
                          <div className="stat-card">
                            <div className="stat-icon">
                              <i className="lni lni-write"></i>
                            </div>
                            <div className="stat-info">
                              <h3>
                                {summary.postCounts.petOwner +
                                  summary.postCounts.petSitter +
                                  summary.postCounts.community}
                              </h3>
                              <p>총 게시글 수</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-12">
                          <div className="stat-card featured">
                            <div className="stat-icon">
                              <i className="lni lni-heart"></i>
                            </div>
                            <div className="stat-info">
                              <h3>{summary.likedCount}</h3>
                              <p>좋아요 누른 글</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-12">
                          <div className="stat-card expired">
                            <div className="stat-icon">
                              <i className="lni lni-calendar"></i>
                            </div>
                            <div className="stat-info">
                              <h3>
                                {summary.reservations.walk +
                                  summary.reservations.care +
                                  summary.reservations.hotel}
                              </h3>
                              <p>총 예약 수</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 🔹 활동 내역 + 최근 예약 */}
                    <div className="row">
                      <div className="col-lg-6 col-md-12 col-12">
                        <div className="activity-log dashboard-block">
                          <h3 className="block-title">활동 내역</h3>
                          <ul>
                            <li className="activity-item">
                              <div className="activity-icon">
                                <i className="lni lni-pencil-alt"></i>
                              </div>
                              <div className="activity-content">
                                <h4>최근 게시글</h4>
                                <p>{summary.latestPostTitle}</p>
                                <small className="text-muted">
                                  {getRelativeTime(summary.latestPostDate)}
                                </small>
                              </div>
                            </li>
                            <li className="activity-item">
                              <div className="activity-icon">
                                <i className="lni lni-heart"></i>
                              </div>
                              <div className="activity-content">
                                <h4>좋아요 누른 글</h4>
                                <p>{summary.likedCount}건</p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-12 col-12">
                        <div className="recent-ads dashboard-block">
                          <h3 className="block-title">최근 예약</h3>
                          <ul>
                            <li className="ad-item">
                              <div className="ad-image">
                                <img
                                  src="/assets/images/items-grid/item1.jpg"
                                  alt="예약 이미지"
                                />
                              </div>
                              <div className="ad-content">
                                <h4>최근 예약 날짜</h4>
                                <p>
                                  {summary.latestReservationDate
                                    ? new Date(
                                        summary.latestReservationDate
                                      ).toLocaleString('ko-KR')
                                    : '없음'}
                                </p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>📡 대시보드 로딩 중...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
