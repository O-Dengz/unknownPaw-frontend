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
                <div className="favourite-header">
                  <h3 className="block-title">찜한 게시글</h3>
                  <div className="favourite-count">
                    <span className="featured">85</span>
                  </div>
                </div>

                <div className="my-items">
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

                  <div className="single-item-list">
                    <div className="row align-items-center">
                      <div className="col-lg-5 col-md-5 col-12">
                        <div className="item-image">
                          <img
                            src="/assets/images/items-grid/img2.jpg"
                            alt="펫호텔 이미지"
                          />
                          <div className="content">
                            <h3 className="title">
                              <a href="#">프리미엄 펫호텔 - 강남점</a>
                            </h3>
                            <span className="price">50,000원 / 1박</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-3 col-12">
                        <p>펫호텔</p>
                      </div>
                      <div className="col-lg-2 col-md-2 col-12">
                        <p>강남구</p>
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

                  <div className="single-item-list">
                    <div className="row align-items-center">
                      <div className="col-lg-5 col-md-5 col-12">
                        <div className="item-image">
                          <img
                            src="/assets/images/items-grid/img1.jpg"
                            alt="애견미용 이미지"
                          />
                          <div className="content">
                            <h3 className="title">
                              <a href="#">프로펫 미용실 - 서초점</a>
                            </h3>
                            <span className="price">35,000원 부터</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-3 col-12">
                        <p>애견미용</p>
                      </div>
                      <div className="col-lg-2 col-md-2 col-12">
                        <p>서초구</p>
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

                  <div className="single-item-list">
                    <div className="row align-items-center">
                      <div className="col-lg-5 col-md-5 col-12">
                        <div className="item-image">
                          <img
                            src="/assets/images/items-grid/img3.jpg"
                            alt="훈련소 이미지"
                          />
                          <div className="content">
                            <h3 className="title">
                              <a href="#">멍멍 도그트레이닝</a>
                            </h3>
                            <span className="price">회당 40,000원</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-3 col-12">
                        <p>훈련</p>
                      </div>
                      <div className="col-lg-2 col-md-2 col-12">
                        <p>송파구</p>
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

                  <div className="pagination">
                    <ul className="pagination-list">
                      <li>
                        <a href="#" className="active">
                          1
                        </a>
                      </li>
                      <li>
                        <a href="#">2</a>
                      </li>
                      <li>
                        <a href="#">3</a>
                      </li>
                      <li>
                        <a href="#">4</a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="lni lni-chevron-right"></i>
                        </a>
                      </li>
                    </ul>
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
