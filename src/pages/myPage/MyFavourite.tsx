import {Link} from 'react-router-dom'
import {DashboardSidebar} from '../../components/features/dashboard/DashboardSidebar'
import './myPage.css'
import Header from '../../components/Layout/Header'

export default function MyFavourite() {
  return (
    <>
      <Header />
      <main>
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
                  <div className="dashboard-block mt-0">
                    <div className="service-list">
                      <div className="service-header ">
                        <h3 className="block-title">찜한 게시글</h3>
                        <div className="header-info">
                          <span className="header-info">85</span>
                        </div>
                      </div>
                      <p>
                        <div className="item-list-title">
                          <div className="row align-items-center">
                            <div className="col-lg-4 col-md-4 col-12 text-center">
                              <p>제목</p>
                            </div>
                            <div className="col-lg-2 col-md-2 col-12 text-center">
                              <p>카테고리</p>
                            </div>
                            <div className="col-lg-4 col-md-4 col-12 text-center">
                              <p>지역</p>
                            </div>
                            <div className="col-lg-2 col-md-2 col-12 text-center">
                              <p>작업</p>
                            </div>
                          </div>
                        </div>
                      </p>
                      <div className="service-items">
                        {/* 첫번째 게시물  */}
                        <div className="service-item">
                          <div className="row ">
                            <div className="col-lg-4 col-md-4 col-12">
                              <div className="service-title">
                                <img
                                  src="/assets/images/items-grid/img2.jpg"
                                  alt="펫호텔 이미지"
                                />
                                <h3 className="title-info">
                                  <h3>프리미엄 펫호텔</h3>
                                  <p className="price">50,000원 / 1박</p>
                                </h3>
                              </div>
                            </div>

                            <div className="col-lg-2 col-md-2 col-12">
                              <div className="service-category">
                                <span>펫호텔</span>
                              </div>
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
                              <div className="service-actions">
                                <Link to={`/post/`} className="action-btn view">
                                  <i className="lni lni-eye"></i>
                                </Link>
                                <Link to="#" className="action-btn delete">
                                  <i className="lni lni-trash"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* 두번째 게시글 */}
                        <div className="service-item">
                          <div className="row ">
                            <div className="col-lg-4 col-md-4 col-12">
                              <div className="service-title">
                                <img
                                  src="/assets/images/items-grid/img2.jpg"
                                  alt="펫호텔 이미지"
                                />
                                <h3 className="title-info">
                                  <h3>프로펫 미용실</h3>
                                  <p className="price">35,000원</p>
                                </h3>
                              </div>
                            </div>

                            <div className="col-lg-2 col-md-2 col-12">
                              <div className="service-category">
                                <span>애견미용</span>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-12">
                              <div className="service-status">
                                <div className="status-bar">
                                  <div className={`status-progress`}></div>
                                </div>
                                <span className="status-text">부산진구</span>
                              </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-12">
                              <div className="service-actions">
                                <Link to={`/post/`} className="action-btn view">
                                  <i className="lni lni-eye"></i>
                                </Link>
                                <Link to="#" className="action-btn delete">
                                  <i className="lni lni-trash"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* 세번째 게시글 */}
                        <div className="service-item">
                          <div className="row ">
                            <div className="col-lg-4 col-md-4 col-12">
                              <div className="service-title">
                                <img
                                  src="/assets/images/items-grid/img2.jpg"
                                  alt="펫호텔 이미지"
                                />
                                <h3 className="title-info">
                                  <h3>골든리트리버와 매일 아침 뛰어주실 분 구해요</h3>
                                  <p className="price">13,000원 / 시간당</p>
                                </h3>
                              </div>
                            </div>

                            <div className="col-lg-2 col-md-2 col-12">
                              <div className="service-category">
                                <span>산책</span>
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-12">
                              <div className="service-status">
                                <div className="status-bar">
                                  <div className={`status-progress`}></div>
                                </div>
                                <span className="status-text">연제구</span>
                              </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-12">
                              <div className="service-actions">
                                <Link to={`/post/`} className="action-btn view">
                                  <i className="lni lni-eye"></i>
                                </Link>
                                <Link to="#" className="action-btn delete">
                                  <i className="lni lni-trash"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pagination">
                          <ul className="pagination-list">
                            <li>
                              <Link to="#">1</Link>
                            </li>
                            <li className="active">
                              <Link to="#">2</Link>
                            </li>
                            <li>
                              <Link to="#">3</Link>
                            </li>
                            <li>
                              <Link to="#">4</Link>
                            </li>
                            <li>
                              <Link to="#">
                                <i className="lni lni-chevron-right"></i>
                              </Link>
                            </li>
                          </ul>
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
