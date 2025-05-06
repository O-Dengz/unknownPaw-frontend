import React from 'react';
import { useParams } from 'react-router-dom';
import '../../../public/assets/css/LineIcons.2.0.css';
import '../../../public/assets/css/animate.css';
import '../../../public/assets/css/bootstrap.min.css';
import '../../../public/assets/css/glightbox.min.css';
import '../../../public/assets/css/main.css';
import '../../../public/assets/css/tiny-slider.css';
import './Post.css';
import { Div } from '../../components';

export function ItemDetails() {
  const { id } = useParams();
  const [liked, setLiked] = React.useState(false);

  // 정적 데이터
  const item = {
    id: id,
    title: "푸들 산책 시켜주실분",
    content: "우리 푸들과 함께 산책해주실 분을 찾습니다.\n\n- 요구사항\n* 주 3회 이상 산책 가능\n* 강아지 경험자 우대\n* 오후 시간대 가능\n\n- 급여: 시간당 10,000원\n- 위치: 서울시 강남구",
    writer: "Smith jeko",
    createdAt: "2시간 전",
    imageUrl: "/assets/images/items-grid/img1.jpg",
    authorImage: "/assets/images/items-grid/author-1.jpg",
    location: "서울시 강남구",
    price: "10,000원",
    tag: "산책",
    rating: 5,
    ratingCount: 35,
    views: 120,
    footprint: 55.7
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <>
<div className="breadcrumbs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="breadcrumbs-content">
                <h1 className="page-title">자리 채우기 용</h1>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <ul className="breadcrumb-nav">
                <li>
                  <a href="/">홈</a>
                </li>
                <li>포스트 자리 채우기 용 (헤더 이슈)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    
    
    <div className="item-details">
      <div className="container">
        <div className="item-main-row">
          {/* 좌측: 이미지 + 셀러 정보 */}
          <div className="item-left-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={item.imageUrl} alt="상품 이미지" className="main-image" />
            {/* 판매자 정보 - 이미지 아래 */}
            <div className="author-info-area">
              <div className="post-author-profile">
                <img src={item.authorImage} alt="프로필" className="post-author-image" />
                <div className="author-meta">
                  <div className="author-name">{item.writer}</div>
                  <div className="author-location">{item.location}</div>
                </div>
              </div>
              <div className="author-temp-box">
                <div className="author-temp-row">
                  <span className="author-temp-value">{item.footprint}°C</span>
                  <span className="author-temp-emoji" role="img" aria-label="paw">🐾</span>
                </div>
                <div className="author-paw-label">발자국 지수</div>
              </div>
            </div>
          </div>
          {/* 우측: 정보 */}
          <div className="item-right-area">
            <h2 className="item-title">{item.title}</h2>
            <div className="item-price">{item.price}</div>
           <div className="post-service-category" style={{ display: 'flex', alignItems: 'center', }}> 
              <p style={{ marginRight: '6px' }}>산책</p>
              <span style={{ color: '#888' }}> · 2시간 전</span>
            </div>
            <div className="item-notice">
            우리 푸들과 함께 산책해주실 분을 찾습니다. <br/>
            - 요구사항<br/>
            * 주 3회 이상 산책 가능<br/>
            * 강아지 경험자 우대<br/>
            * 오후 시간대 가능<br/><br/>
            
            - 급여: 시간당 10,000원<br/>
            - 위치: 서울시 강남구<br/>
            </div>
            <div className="post-summary">
              <span>조회수 123</span>
              <p>· </p>
              <span>채팅 4</span>
              <p>· </p>
              <span>좋아요 12</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', alignItems: 'center' }}>
              <button className="reserve-button">예약하기</button>
              <button className="reserve-button"><i className="lni lni-heart"></i></button>
            </div>
            </div>
        </div>
        {/* 지도 영역 */}
        <div className="map-area">
          {/* 지도 컴포넌트가 들어갈 자리 */}
          <iframe
            id="gmap_canvas"
            src="https://maps.google.com/maps?q=부산광역시+부산진구+부전동+163-1&t=&z=15&ie=UTF8&iwloc=&output=embed"
            height={300}
            width={1300}
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            />
        </div>
        <button className="report-button">🚨 신고하기</button>
      </div>
    </div>
    </>
  );
}