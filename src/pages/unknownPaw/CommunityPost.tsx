import {useParams} from 'react-router-dom'
import '../../../public/assets/css/LineIcons.2.0.css'
import '../../../public/assets/css/animate.css'
import '../../../public/assets/css/bootstrap.min.css'
import '../../../public/assets/css/glightbox.min.css'
import '../../../public/assets/css/main.css'
import '../../../public/assets/css/tiny-slider.css'
import './CommunityPost.css'

export default function CommunityPost() {
  const {postId} = useParams()

  return (
    <>
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">커뮤니티 게시글 상세</h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <a href="/">홈</a>
                </li>
                <li>게시글 상세</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Single Area */}
      <section className="section blog-single">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-12 col-12">
              <div className="single-inner">
                <div className="post-thumbnils">
                  <img src="\src\assets\123.png" alt="게시글 썸네일" />
                </div>
                <div className="post-details">
                  <div className="detail-inner">
                    <h2 className="post-title">게시글 제목 (ID: {postId})</h2>
                    <ul className="custom-flex post-meta">
                      <li>
                        <i className="lni lni-calendar"></i>
                        2025년 5월 2일
                      </li>
                      <li>
                        <i className="lni lni-comments"></i>
                        댓글 35개
                      </li>
                      <li>
                        <i className="lni lni-eye"></i>
                        조회수 55
                      </li>
                    </ul>
                    <p>
                      이곳은 게시글 본문 내용이 들어가는 공간입니다. <br />
                      진지한 글도, 웃긴 이야기, 정보글도 다 환영이에요! 😁
                    </p>
                  </div>
                </div>
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
                          <a href="#">님들 님들 님들 이거 봐보셈 급함!!!!</a>
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
    </>
  )
}
