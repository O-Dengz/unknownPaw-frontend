import React from 'react';
import { useParams } from 'react-router-dom';
import '../../../public/assets/css/LineIcons.2.0.css';
import '../../../public/assets/css/animate.css';
import '../../../public/assets/css/bootstrap.min.css';
import '../../../public/assets/css/glightbox.min.css';
import '../../../public/assets/css/main.css';
import '../../../public/assets/css/tiny-slider.css';

// 스타일 정의
const styles = {
  mainImageSection: {
    marginBottom: '30px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  imageContainer: {
    width: '100%',
    height: '400px',
    position: 'relative' as const
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const
  },
  authorInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  authorImage: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }
};

export function ItemDetails() {
  const { id } = useParams();

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
    <div className="item-details" style={{ marginTop: '60px', marginBottom: '80px' }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-12">
            <div className="single-grid wow fadeInUp" data-wow-delay=".2s">
              {/* 배경 이미지 섹션 */}
              <div className="image" style={{ position: 'relative' }}>
                <div className="thumbnail">
                  <img src={item.imageUrl} alt="#" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
                </div>
              </div>

              {/* 프로필 및 정보 섹션 */}
              <div className="content" style={{ padding: '20px' }}>
                <div className="row">
                  {/* 왼쪽: 프로필 정보 */}
                  <div className="col-md-6">
                    <div className="profile-section">
                      <div className="author-info" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginBottom: '15px' 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img src={item.authorImage} alt="#" style={{ 
                            width: '50px', 
                            height: '50px', 
                            borderRadius: '50%',
                            marginRight: '10px'
                          }} />
                          <div>
                            <h4 style={{ margin: '0' }}>{item.writer}</h4>
                          </div>
                        </div>
                        <div style={{ 
                          textAlign: 'right',
                          color: '#2563eb',
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}>
                          {item.footprint}
                          <div style={{ 
                            fontSize: '0.9rem',
                            marginTop: '5px'
                          }}>
                            Paw Rate
                          </div>
                        </div>
                      </div>
                      <div className="title-section">
                        <h2 style={{ margin: '0 0 10px 0' }}>{item.title}</h2>
                        <div style={{ color: '#666' }}>
                          <span className="tag">{item.tag}</span>
                          <span style={{ margin: '0 10px' }}>|</span>
                          <span>{item.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 오른쪽: 빈 공간 */}
                  <div className="col-md-6">
                  </div>
                </div>

                {/* 글 내용 */}
                <div className="item-content" style={{ margin: '30px 0' }}>
                  {item.content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>

                {/* 조회수 및 신고하기 */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '10px',
                  marginBottom: '15px',
                  color: '#666'
                }}>
                  <div style={{ 
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <img 
                      src={item.imageUrl} 
                      alt="위치 사진" 
                      style={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}>
                      위치사진예시
                    </div>
                  </div>
                  <div className="views">
                    조회수: {item.views}
                  </div>
                  <button style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <i className="lni lni-flag"></i>
                    게시글 신고하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 고정된 하단 액션 박스 */}
      <div style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'white',
        padding: '15px 0',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        zIndex: '1000'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span className="like" onClick={handleClick} style={{ 
              cursor: 'pointer',
              fontSize: '1.2rem',
              color: '#666',
              flex: '1',
              textAlign: 'left'
            }}>
              <i className="lni lni-heart"></i>
            </span>
            <span className="price" style={{ 
              fontWeight: 'bold',
              fontSize: '1.1rem',
              flex: '1',
              textAlign: 'center'
            }}>
              시급: {item.price}
            </span>
            <button className="btn btn-primary" style={{ 
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              flex: '1',
              textAlign: 'center',
              maxWidth: '120px'
            }}>
              예약하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 