import {useState} from 'react'
import {useParams} from 'react-router-dom'
import './memberProfile.css'
import Header from '../../components/Layout/Header'
import {Footer} from '../../components/Layout/Footer'

export default function MemberProfile() {
  const {mid} = useParams()

  // 실제 데이터 연동은 나중에 구현
  const mockProfile = {
    nickname: '멍멍이아빠',
    introduction: '반려견과 함께 즐거운 산책을 즐기고 있어요!',
    profileImage: '/assets/images/default-profile.jpg',
    location: '서울시 강남구',
    activeFrom: '2023년 12월',
    walkCount: 128,
    totalWalkTime: '156시간',
    pawRate: 4.8,
    pets: [
      {name: '몽이', breed: '골든리트리버', age: 3},
      {name: '두리', breed: '포메라니안', age: 2}
    ],
    matchedUsers: 45,
    verifications: ['본인인증', '반려견등록증', '전문가인증'],
    reviews: [
      {
        id: 1,
        content: '시간 약속을 잘 지키시고 반려견을 진심으로 사랑하시는 분이에요!',
        rating: 5,
        author: '치와와맘'
      },
      {
        id: 2,
        content: '산책 매너가 좋으시고 다른 반려견들과도 잘 어울려요',
        rating: 5,
        author: '댕댕이집사'
      }
    ],
    posts: [
      {
        id: 1,
        title: '비오는 날 산책하는 꿀팁',
        likes: 128,
        comments: 45
      },
      {
        id: 2,
        title: '우리 동네 강아지 산책하기 좋은 곳',
        likes: 256,
        comments: 82
      }
    ]
  }

  return (
    <>
      <Header />
      <main>
        <div>
          <div className="breadcrumbs">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6 col-md-6 col-12">
                  <div className="breadcrumbs-content">
                    <h1 className="page-title">프로필 크기 맞추기 용</h1>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-12">
                  <ul className="breadcrumb-nav">
                    <li>
                      <a href="/">멤버 프로필</a>
                    </li>
                    <li>00 멤버 프로필</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard section">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  {/* 기본 프로필 섹션 */}
                  <div className="member-profile-container">
                    <div className="profile-header">
                      <div className="profile-image">
                        <img
                          src="/assets/images/items-grid/author-3.jpg"
                          alt={`${mockProfile.nickname}의 프로필`}
                        />
                      </div>
                      <div className="profile-info">
                        <div className="profile-top">
                          <h2 className="nickname">{mockProfile.nickname}</h2>
                          <div className="verification-badges">
                            {mockProfile.verifications.map((badge, index) => (
                              <span key={index} className="badge">
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="introduction">{mockProfile.introduction}</p>
                        <div className="profile-details">
                          <div className="detail-item">
                            <i className="lni lni-map-marker"></i>
                            <span>{mockProfile.location}</span>
                          </div>
                          <div className="detail-item">
                            <i className="lni lni-calendar"></i>
                            <span>{mockProfile.activeFrom}부터 활동 중</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 산책 통계 섹션 */}
                    <div className="walk-stats">
                      <div className="stat-item">
                        <div className="stat-value">{mockProfile.walkCount}</div>
                        <div className="stat-label">산책 횟수</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">{mockProfile.totalWalkTime}</div>
                        <div className="stat-label">총 산책시간</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">{mockProfile.pawRate}</div>
                        <div className="stat-label">발자국 지수</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">{mockProfile.matchedUsers}</div>
                        <div className="stat-label">매칭된 산책메이트</div>
                      </div>
                    </div>

                    {/* 반려견 정보 섹션 */}
                    <div className="pets-section">
                      <h3 className="section-title">반려견 정보</h3>
                      <div className="pets-list">
                        {mockProfile.pets.map((pet, index) => (
                          <div key={index} className="pet-card">
                            <div className="pet-image">
                              <img src="/assets/images/pet/dog-1.jpg" alt={pet.name} />
                            </div>
                            <div className="pet-info">
                              <h4>{pet.name}</h4>
                              <p>{pet.breed}</p>
                              <p>{pet.age}살</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 후기 섹션 */}
                    <div className="reviews-section">
                      <h3 className="section-title">받은 후기</h3>
                      <div className="reviews-list">
                        {mockProfile.reviews.map(review => (
                          <div key={review.id} className="review-card">
                            <div className="review-header">
                              <span className="review-author">{review.author}</span>
                              <div className="review-rating">
                                {[...Array(review.rating)].map((_, i) => (
                                  <i key={i} className="lni lni-star-filled"></i>
                                ))}
                              </div>
                            </div>
                            <p className="review-content">{review.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 게시글 섹션 */}
                    <div className="posts-section">
                      <h3 className="section-title">작성한 게시글</h3>
                      <div className="posts-list">
                        {mockProfile.posts.map(post => (
                          <div key={post.id} className="post-card">
                            <h4 className="post-title">강아지 훈련 도와드리겠습니다.</h4>
                            <div className="post-stats">
                              <span>
                                <i className="lni lni-heart"></i> 10
                              </span>
                              <span>
                                <i className="lni lni-comments"></i> 2
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 게시글 섹션 */}
                    <div className="posts-section">
                      <h3 className="section-title">커뮤니티 게시글</h3>
                      <div className="posts-list">
                        {mockProfile.posts.map(post => (
                          <div key={post.id} className="post-card">
                            <h4 className="post-title">{post.title}</h4>
                            <div className="post-stats">
                              <span>
                                <i className="lni lni-heart"></i> {post.likes}
                              </span>
                              <span>
                                <i className="lni lni-comments"></i> {post.comments}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
