import {DashboardSidebar} from '../../components/DashboardSidebar'
import './myPage.css'

export default function MyFavourite() {
  return (
    <>
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">찜한 게시글</h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <a href="/">홈</a>
                </li>
                <li>찜한 게시글</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <section className="dashboard section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-12 col-12">
              <DashboardSidebar />
            </div>
            <div className="col-lg-9 col-md-12 col-12">
              <div className="main-content">
                <div className='dashboard-block mt-0'>
                  <div className='service-list'>
                    <div className="service-header ">
                      <h3 className="block-title">찜한 게시글</h3>
                      <div className="header-info">
                        <span className="header-info">85</span>
                      </div>
                    </div>
                    <div className="service-items">
                      <div className="item-list-title">
                        <div className="row align-items-center">
                          <div className="col-lg-5 col-md-5 col-12">
                            <p>제목</p>
                          </div>
                          <div className="col-lg-3 col-md-3 col-12">
                            <p>카테고리</p>
                          </div>
                          <div className="col-lg-2 col-md-2 col-12">
                            <p>지역</p>
                          </div>
                          <div className="col-lg-2 col-md-2 col-12 text-end">
                            <p>작업</p>
                          </div>
                        </div>
                      </div>
                   

                  <div className="service-item">
                    <div className="row ">
                      <div className="col-lg-4 col-md-4 col-12">
                        <div className='service-title'>
                          <img
                            src="/assets/images/items-grid/img2.jpg"
                            alt="펫호텔 이미지"
                          />
                            <h3 className="title-info">
                              <h3>
                              프리미엄 펫호텔
                              </h3>
                              <p className='price'>50,000원 / 1박</p>
                              {/* <p className='location'> - 강남점</p> */}
                            </h3>
                        </div>
                      </div>
                    
                      <div className="col-lg-2 col-md-2 col-12">
                        <div className='service-category'><span>펫호텔</span></div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-12">
                      <div className="service-status">
                                <div className="status-bar">
                                  <div className={`status-progress`}></div>
                                </div>
                                <span className="status-text">강남구</span>
                              </div>
                        
                      </div>
                      <div className="col-lg-2 col-md-2 col-12">
                        <div className="action-buttons">
                          <a href="#" className="view-btn">
                            <i className="lni lni-eye"></i>
                          </a>
                          <a href="#" className="delete-btn">
                            <i className="lni lni-trash"></i>
                          </a>
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
    </>
  )
}