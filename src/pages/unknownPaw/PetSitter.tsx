import { Link } from 'react-router-dom';

export function PetSitter() {
  return (
    <div className="pet-sitter-page">
      {/* <!-- Start Items Grid Area --> */}
      <section className="items-grid section custom-padding">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <h2 className="wow fadeInUp" data-wow-delay=".4s">
                  Pet Sitter
                </h2>
                <p className="wow fadeInUp" data-wow-delay=".6s">
                  서비스를 요청하고 제안을 받아보세요!
                </p>
              </div>
            </div>
          </div>
          <div className="single-head">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                {/* <!-- Start Single Grid --> */}
                <div className="single-grid wow fadeInUp" data-wow-delay=".2s">
                  <div className="image">
                    <Link to="/item/1" className="thumbnail">
                      <img src="assets/images/items-grid/img1.jpg" alt="#" />
                    </Link>
                    <div className="author">
                      <div className="author-image">
                        <a href="javascript:void(0)">
                          <img src="assets/images/items-grid/author-1.jpg" alt="#" />
                          <span>Smith jeko</span>
                        </a>
                      </div>
                      <p className="sale">예약하기</p>
                    </div>
                  </div>
                  <div className="content">
                    <div className="top-content">
                      <a href="javascript:void(0)" className="tag">
                        산책
                      </a>
                      <h3 className="title">
                        <Link to="/item/1">강아지보다 잘 달립니다.</Link>
                      </h3>
                      <p className="update-time">2시간 전</p>
                      <ul className="rating">
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <a href="javascript:void(0)">(35)</a>
                        </li>
                      </ul>
                      <ul className="info-list">
                        <li>
                          <a href="javascript:void(0)">
                            <i className="lni lni-map-marker"></i> 서울시 강남구
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0)">
                            <i className="lni lni-timer"></i> May 2, 2025
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="bottom-content">
                      <p className="price">
                        시급: <span>10,000원</span>
                      </p>
                      <a href="javascript:void(0)" className="like">
                        <i className="lni lni-heart"></i>
                      </a>
                    </div>
                  </div>
                </div>
                {/* <!-- End Single Grid --> */}
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                {/* <!-- Start Single Grid --> */}
                <div className="single-grid wow fadeInUp" data-wow-delay=".4s">
                  <div className="image">
                    <Link to="/item/2" className="thumbnail">
                      <img src="assets/images/items-grid/img2.jpg" alt="#" />
                    </Link>
                    <div className="author">
                      <div className="author-image">
                        <a href="javascript:void(0)">
                          <img src="assets/images/items-grid/author-2.jpg" alt="#" />
                          <span>Alex Jui</span>
                        </a>
                      </div>
                      <p className="sale">예약하기</p>
                    </div>
                  </div>
                  <div className="content">
                    <div className="top-content">
                      <a href="javascript:void(0)" className="tag">
                        돌봄
                      </a>
                      <h3 className="title">
                        <Link to="/item/2">반려견의 일상, 세심하게 돌봐드려요!</Link>
                      </h3>
                      <p className="update-time">3시간 전</p>
                      <ul className="rating">
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <a href="javascript:void(0)">(20)</a>
                        </li>
                      </ul>
                      <ul className="info-list">
                        <li>
                          <a href="javascript:void(0)">
                            <i className="lni lni-map-marker"></i> 부산시 부산진구
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0)">
                            <i className="lni lni-timer"></i> May 2, 2025
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="bottom-content">
                      <p className="price">
                        시급: <span>30,000원</span>
                      </p>
                      <a href="javascript:void(0)" className="like">
                        <i className="lni lni-heart"></i>
                      </a>
                    </div>
                  </div>
                </div>
                {/* <!-- End Single Grid --> */}
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                {/* <!-- Start Single Grid --> */}
                <div className="single-grid wow fadeInUp" data-wow-delay=".6s">
                  <div className="image">
                    <Link to="/item/3" className="thumbnail">
                      <img src="assets/images/items-grid/img3.jpg" alt="#" />
                    </Link>
                    <div className="author">
                      <div className="author-image">
                        <a href="javascript:void(0)">
                          <img src="assets/images/items-grid/author-3.jpg" alt="#" />
                          <span>Devid Milan</span>
                        </a>
                      </div>
                      <p className="sale">예약하기</p>
                    </div>
                    <p className="item-position">
                      <i className="lni lni-bolt"></i> Featured
                    </p>
                  </div>
                  <div className="content">
                    <div className="top-content">
                      <a href="javascript:void(0)" className="tag">
                        산책
                      </a>
                      <h3 className="title">
                        <Link to="/item/3">활발한 강아지? 걱정 마세요, 함께 뛰어놀아요!</Link>
                      </h3>
                      <p className="update-time">3시간 전</p> 
                      <ul className="rating">
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <a href="javascript:void(0)">(55)</a>
                        </li>
                      </ul>
                      <ul className="info-list">
                        <li>
                          <a href="javascript:void(0)">
                            <i className="lni lni-map-marker"></i> 서울시 송파구
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0)">
                            <i className="lni lni-timer"></i> May 2, 2025
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="bottom-content">
                      <p className="price">
                        시급: <span>15,000원</span>
                      </p>
                      <a href="javascript:void(0)" className="like">
                        <i className="lni lni-heart"></i>
                      </a>
                    </div>
                  </div>
                </div>
                {/* <!-- End Single Grid --> */}
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                {/* <!-- Start Single Grid --> */}
                <div className="single-grid wow fadeInUp" data-wow-delay=".2s">
                  <div className="image">
                    <Link to="/item/4" className="thumbnail">
                      <img src="assets/images/items-grid/img4.jpg" alt="#" />
                    </Link>
                    <div className="author">
                      <div className="author-image">
                        <a href="javascript:void(0)">
                          <img src="assets/images/items-grid/author-4.jpg" alt="#" />
                          <span>Jesia Jully</span>
                        </a>
                      </div>
                      <p className="sale">예약하기</p>
                    </div>
                  </div>
                  <div className="content">
                    <div className="top-content">
                      <a href="javascript:void(0)" className="tag">
                        돌봄
                      </a>
                      <h3 className="title">
                        <Link to="/item/4">"편안하고 안전한 돌봄 서비스, 믿고 맡기세요!"</Link>
                      </h3>
                      <p className="update-time">4시간 전</p>
                      <ul className="rating">
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <a href="javascript:void(0)">(35)</a>
                        </li>
                      </ul>
                      <ul className="info-list">
                        <li>
                          <a href="javascript:void(0)">
                            <i className="lni lni-map-marker"></i> 성남시 분당구
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0)">
                            <i className="lni lni-timer"></i> May 2, 2025
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="bottom-content">
                      <p className="price">
                        시급: <span>10,000원</span>
                      </p>
                      <a href="javascript:void(0)" className="like">
                        <i className="lni lni-heart"></i>
                      </a>
                    </div>
                  </div>
                </div>
                {/* <!-- End Single Grid --> */}
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                {/* <!-- Start Single Grid --> */}
                <div className="single-grid wow fadeInUp" data-wow-delay=".4s">
                  <div className="image">
                    <Link to="/item/5" className="thumbnail">
                      <img src="assets/images/items-grid/img5.jpg" alt="#" />
                    </Link>
                    <div className="author">
                      <div className="author-image">
                        <a href="javascript:void(0)">
                          <img src="assets/images/items-grid/author-5.jpg" alt="#" />
                          <span>Thomas Deco</span>
                        </a>
                      </div>
                      <p className="sale">예약하기</p>
                    </div>
                    <p className="item-position">
                      <i className="lni lni-bolt"></i> Featured
                    </p>
                  </div>
                  <div className="content">
                    <div className="top-content">
                      <a href="javascript:void(0)" className="tag">
                        산책
                      </a>
                      <h3 className="title">
                        <Link to="/item/5">반려견 산책, 전문가에게 맡겨주세요!</Link>
                      </h3>
                      <p className="update-time">5시간 전</p>
                      <ul className="rating">
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <a href="javascript:void(0)">(35)</a>
                        </li>
                      </ul>
                      <ul className="info-list">
                        <li>
                          <a href="javascript:void(0)">
                            <i className="lni lni-map-marker"></i> 부산시 기장군  
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0)">
                            <i className="lni lni-timer"></i> May 25, 2023
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="bottom-content">
                      <p className="price">
                        시급: <span>15,000원</span>
                      </p>
                      <a href="javascript:void(0)" className="like">
                        <i className="lni lni-heart"></i>
                      </a>
                    </div>
                  </div>
                </div>
                {/* <!-- End Single Grid --> */}
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                {/* <!-- Start Single Grid --> */}
                <div className="single-grid wow fadeInUp" data-wow-delay=".6s">
                  <div className="image">
                    <Link to="/item/6" className="thumbnail">
                      <img src="assets/images/items-grid/img6.jpg" alt="#" />
                    </Link>
                    <div className="author">
                      <div className="author-image">
                        <a href="javascript:void(0)">
                          <img src="assets/images/items-grid/author-6.jpg" alt="#" />
                          <span>Jonson zack</span>
                        </a>
                      </div>
                      <p className="sale">예약하기</p>
                    </div>
                  </div>
                  <div className="content">
                    <div className="top-content">
                      <a href="javascript:void(0)" className="tag">
                        산책
                      </a>
                      <h3 className="title">
                        <Link to="/item/6">반려견 산책, 안전하고 즐겁게 돌봐드려요!</Link>
                      </h3>
                      <p className="update-time">7시간 전</p>
                      <ul className="rating">
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <i className="lni lni-star-filled"></i>
                        </li>
                        <li>
                          <a href="javascript:void(0)">(20)</a>
                        </li>
                      </ul>
                      <ul className="info-list">
                        <li>
                          <a href="javascript:void(0)">
                            <i className="lni lni-map-marker"></i> 부산시 강서구
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0)">
                            <i className="lni lni-timer"></i> May 2, 2025
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="bottom-content">
                      <p className="price">
                        시급: <span>15,000원</span>
                      </p>
                      <a href="javascript:void(0)" className="like">
                        <i className="lni lni-heart"></i>
                      </a>
                    </div>
                  </div>
                </div>
                {/* <!-- End Single Grid --> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- /End Items Grid Area --> */}
    </div>
  );
}
