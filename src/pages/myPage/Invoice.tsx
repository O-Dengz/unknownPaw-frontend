import React from 'react'
import {Link} from 'react-router-dom'
import {DashboardSidebar} from '../../components/features/dashboard/DashboardSidebar'
import Header from '../../components/Layout/Header'

// 백앤드에서 산책,돌봄,호텔 데이터를 받아옵니다.
// 하단의 serviceHistoryData 를 맵을 통해 뿌려서 내용이 몇개든 자동으로 반복 렌더링 되는 구조입니다.
type ServiceHistoryItem = {
  id: number
  type: '산책' | '돌봄' | '호텔'
  date: string
  owner: string
  petName: string
  duration: string
  price: string
  rating: string
}

const serviceHistoryData: ServiceHistoryItem[] = [
  {
    id: 1,
    type: '돌봄',
    date: '2024-03-15',
    owner: '정효은',
    petName: '멍멍이',
    duration: '4시간',
    price: '₩40,000',
    rating: '★★★★★'
  },
  {
    id: 2,
    type: '산책',
    date: '2024-03-10',
    owner: '배원영',
    petName: '해피',
    duration: '1시간',
    price: '₩15,000',
    rating: '★★★★☆'
  }
]

// 기능구현 tsx 주석처리
export default function Invoice() {
  return (
    <>
      <Header />
      <main>
        {/* <div className="service-list">
  {serviceHistoryData.map(service => (
    <div key={service.id} className="single-service">
      <div className="service-info">
        <div className="service-header">
          <h4>{service.type} 서비스</h4>
        </div>
        <div className="service-details">
          <p><strong>날짜:</strong> {service.date}</p>
          <p><strong>펫 주인:</strong> {service.owner}</p>
          <p><strong>반려동물:</strong> {service.petName}</p>
          <p><strong>서비스 시간:</strong> {service.duration}</p>
          <p><strong>금액:</strong> {service.price}</p>
          <p><strong>평점:</strong> <span className="rating">{service.rating}</span></p>
        </div>
      </div>
      <div className="service-actions">
        <Link to={`/service-details/${service.id}`} className="btn btn-primary">
          상세보기
        </Link>
      </div>
    </div>
  ))}
</div> */}

        {/* 상단의 검은 부분 현재 위치 알려줍니다. breadcrumbs <- 현재위치 */}
        <div className="breadcrumbs">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-6 col-12">
                <div className="breadcrumbs-content">
                  <h1 className="page-title">산책및 돌봄내역</h1>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-12">
                <ul className="breadcrumb-nav">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>산책및 돌봄내역</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 화면 옆 사이드바 */}
        <section className="dashboard section">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-4 col-12">
                <DashboardSidebar />
              </div>

              <div className="col-lg-9 col-md-8 col-12">
                <div className="main-content">
                  <div className="dashboard-block mt-0">
                    <h3 className="block-title">산책및 돌봄내역</h3>
                    <div className="inner-block">
                      <div className="service-history">
                        <div className="row">
                          <div className="col-12">
                            <div className="service-list">
                              <div className="single-service">
                                <div className="service-info">
                                  <div className="service-header">
                                    <h4>돌봄 서비스</h4>
                                  </div>
                                  <div className="service-details">
                                    <p>
                                      <strong>날짜:</strong> 2024-03-15
                                    </p>
                                    <p>
                                      <strong>펫 주인:</strong> 정효은
                                    </p>
                                    <p>
                                      <strong>반려동물:</strong> 멍멍이
                                    </p>
                                    <p>
                                      <strong>서비스 시간:</strong> 4시간
                                    </p>
                                    <p>
                                      <strong>금액:</strong> ₩40,000
                                    </p>
                                    <p>
                                      <strong>평점:</strong>{' '}
                                      <span className="rating">★★★★★</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="service-actions">
                                  <Link to="/service-details" className="btn btn-primary">
                                    상세보기
                                  </Link>
                                </div>
                              </div>

                              <div className="single-service">
                                <div className="service-info">
                                  <div className="service-header">
                                    <h4>산책 서비스</h4>
                                  </div>
                                  <div className="service-details">
                                    <p>
                                      <strong>날짜:</strong> 2024-03-10
                                    </p>
                                    <p>
                                      <strong>펫 주인:</strong> 배원영
                                    </p>
                                    <p>
                                      <strong>반려동물:</strong> 해피
                                    </p>
                                    <p>
                                      <strong>서비스 시간:</strong> 1시간
                                    </p>
                                    <p>
                                      <strong>금액:</strong> ₩15,000
                                    </p>
                                    <p>
                                      <strong>평점:</strong>{' '}
                                      <span className="rating">★★★★☆</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="service-actions">
                                  <Link to="/service-details" className="btn btn-primary">
                                    상세보기
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
