import React, {useState} from 'react'
import '../../../public/assets/css/LineIcons.2.0.css'
import '../../../public/assets/css/animate.css'
import '../../../public/assets/css/bootstrap.min.css'
import '../../../public/assets/css/glightbox.min.css'
import '../../../public/assets/css/main.css'
import '../../../public/assets/css/tiny-slider.css'

export function Community() {
  const [rangeValue, setRangeValue] = useState(10)

  return (
    <section className="section latest-news-area blog-list">
      <div className="container">
        {/* 상단 제목 및 네비게이션 */}
        <div className="row align-items-center mb-4">
          <div className="col-lg-6 col-md-6 col-12">
            <div className="breadcrumbs-content">
              <h2 className="page-title">커뮤니티</h2>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <ul className="breadcrumb-nav">
              <li>
                <a href="index.html">Home</a>
              </li>
              <li>Community</li>
            </ul>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="row">
          {/* 게시물 영역 (왼쪽 8컬럼) */}
          <div className="col-lg-8 col-md-7 col-12">
            <div className="row">
              {/* 게시물 아이템 */}
              <div className="col-lg-4 col-md-6 col-12 mb-4">
                <div className="single-news wow fadeInUp" data-wow-delay=".2s">
                  <div className="image">
                    <a href="blog-single-sidebar.html">
                      <img
                        className="thumb"
                        src="\src\assets\123.png"
                        alt="귀여운 강아지"
                      />
                    </a>
                  </div>
                  <div className="content-body">
                    <h4 className="title">
                      <a href="blog-single-sidebar.html">두발로 걸었어요!</a>
                    </h4>
                    <p>
                      저희집 강아지가 두발로 걸었어요!! 쓸개골이 걱정되긴 하지만 너무
                      신기하지 않나요!? 🐾
                    </p>
                    <div className="meta-details">
                      <ul>
                        <li>
                          <a href="#">2025.05.02</a>
                        </li>
                        <li>
                          <a href="#">일상이야기</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 게시물 아이템 */}
              <div className="col-lg-4 col-md-6 col-12 mb-4">
                <div className="single-news wow fadeInUp" data-wow-delay=".2s">
                  <div className="image">
                    <a href="blog-single-sidebar.html">
                      <img
                        className="thumb"
                        src="\src\assets\피카츄 군침싹.jpg"
                        alt="귀여운 강아지"
                      />
                    </a>
                  </div>
                  <div className="content-body">
                    <h4 className="title">
                      <a href="blog-single-sidebar.html">
                        저희집 공주가 사료를 안먹어요..
                      </a>
                    </h4>
                    <p>
                      호불호 없는 강아지 사료 아시는 분 있나요.. 저희집 공주가 사료를
                      안먹어요.. 뭐가 문제일까요..?
                    </p>
                    <div className="meta-details">
                      <ul>
                        <li>
                          <a href="#">2025.05.02</a>
                        </li>
                        <li>
                          <a href="#">일상이야기</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 게시물 아이템 */}
              <div className="col-lg-4 col-md-6 col-12 mb-4">
                <div className="single-news wow fadeInUp" data-wow-delay=".2s">
                  <div className="image">
                    <a href="blog-single-sidebar.html">
                      <img
                        className="thumb"
                        src="\src\assets\무료나눔.png"
                        alt="귀여운 강아지"
                      />
                    </a>
                  </div>
                  <div className="content-body">
                    <h4 className="title">
                      <a href="blog-single-sidebar.html">무료나눔 마감임박!😀</a>
                    </h4>
                    <p>
                      시즌 오프 강아지 패딩, 신발 나눔중입니다. 댓글에 강아지 자랑
                      남겨주시면 채팅 드릴게요 :)
                    </p>
                    <div className="meta-details">
                      <ul>
                        <li>
                          <a href="#">2025.05.01</a>
                        </li>
                        <li>
                          <a href="#">일상이야기</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* 추가 게시물은 위 div 복사해서 붙여넣기! */}
            </div>

            {/* 페이지네이션 */}
            <div className="pagination left blog-grid-page mt-4">
              <ul className="pagination-list">
                <li>
                  <a href="javascript:void(0)">
                    <i className="lni lni-chevron-left"></i>
                  </a>
                </li>
                <li className="active">
                  <a href="javascript:void(0)">1</a>
                </li>
                <li>
                  <a href="javascript:void(0)">2</a>
                </li>
                <li>
                  <a href="javascript:void(0)">3</a>
                </li>
                <li>
                  <a href="javascript:void(0)">
                    <i className="lni lni-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* 사이드바 영역 (오른쪽 4컬럼) */}
          <aside className="col-lg-4 col-md-5 col-12">
            <div className="sidebar blog-grid-page">
              {/* 검색 위젯 */}
              <div className="widget search-widget">
                <h5 className="widget-title">
                  <span>게시글 검색</span>
                </h5>
                <form action="#">
                  <input type="text" placeholder="검색어를 입력하세요." />
                  <button type="submit">
                    <i className="lni lni-search-alt"></i>
                  </button>
                </form>
              </div>

              {/* 인기글 위젯 */}
              <div className="widget popular-feeds mt-5">
                <h5 className="widget-title">
                  <span>인기 게시물</span>
                </h5>
                <div className="popular-feed-loop">
                  <div className="single-popular-feed">
                    <div className="feed-desc">
                      <h6 className="post-title">
                        <a href="#">강아지가 고양이같아요..</a>
                      </h6>
                      <span className="time">
                        <i className="lni lni-calendar"></i> 2025.04.24
                      </span>
                    </div>
                  </div>
                  <div className="single-popular-feed">
                    <div className="feed-desc">
                      <h6 className="post-title">
                        <a href="#">#OOTD 오늘의 댕일리룩.jpg</a>
                      </h6>
                      <span className="time">
                        <i className="lni lni-calendar"></i> 2025.04.22
                      </span>
                    </div>
                  </div>
                  <div className="single-popular-feed">
                    <div className="feed-desc">
                      <h6 className="post-title">
                        <a href="#">님들 님들 이거 봐보셈 급함!!!</a>
                      </h6>
                      <span className="time">
                        <i className="lni lni-calendar"></i> 2025.05.01
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
