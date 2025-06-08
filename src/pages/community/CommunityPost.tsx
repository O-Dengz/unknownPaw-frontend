import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
// CSS 파일 경로를 수정합니다. public 디렉토리의 자산은 일반적으로 루트에서 절대 경로로 참조됩니다.
// import '/assets/css/LineIcons.2.0.css';
// import '/assets/css/animate.css';
// import '/assets/css/bootstrap.min.css';
// import '/assets/css/glightbox.min.css';
// import '/assets/css/main.css';
// import '/assets/css/tiny-slider.css';
import './CommunityPost.css'; // CommunityPost.tsx와 같은 디렉토리에 있다고 가정
import { getImageUrl } from '../../utils/getImageUrl'; // getImageUrl 유틸리티 함수 경로 (src 내부 모듈)
import CommunityComments from './CommunityComments'; // ★ 분리된 CommunityComments 컴포넌트 임포트 ★

// 랜덤 이미지 목록 (이미지 로드 실패 시 대체용)
const randomImages = [
  '/src/assets/무료나눔.png',
  '/src/assets/오댕이.jpg',
  '/src/assets/피카츄 군침싹.jpg',
  '/src/assets/no-img.gif'
];

// 랜덤 이미지 선택 함수
const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * randomImages.length);
  return randomImages[randomIndex];
};

// --- 추가할 함수 시작 ---
const getCommunityImageUrl = (imagePath: string) => {
  if (!imagePath) return getRandomImage();

  // 'COMMUNITY/' 또는 'community/' 접두사 제거
  let fileName = imagePath.replace(/^(COMMUNITY\/|community\/)/, '');

  // 파일 이름 자체에 특수 문자가 있을 경우를 대비해 인코딩
  return `http://localhost:8080/unknownPaw/api/community/images/${encodeURIComponent(fileName)}`;
};
// --- 추가할 함수 끝 ---

// 커뮤니티 게시글 데이터 인터페이스
interface CommunityPost {
  communityId: number;
  title: string;
  content: string;
  likes: number;
  commentCount: number;
  authorName: string;
  authorNickname: string;
  authorProfileImage: string;
  communityCategory: string;
  regDate: string;
  viewCount: number;
  authorId: number;
  communityImages: string[]; // 게시글에 첨부된 이미지 URL 목록
}

// ===============================================
// CommunityPost 컴포넌트 (게시글 상세 페이지)
// ===============================================
export default function CommunityPost() {
  const { postId } = useParams<{ postId: string }>(); // URL에서 postId 가져오기
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 게시글 정보 불러오기 함수
  const fetchPost = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('로그인이 필요합니다.');
        // 실제 애플리케이션에서는 로그인 페이지로 리다이렉션
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`/api/community/posts/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`게시글을 불러오는데 실패했습니다. (${response.status}: ${errorText})`);
      }

      const data = await response.json();
      if (data) {
        setPost(data);
      } else {
        setError('게시글 데이터가 비어있습니다.');
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError(
        err instanceof Error ? err.message : '게시글을 불러오는데 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  }, []); // 의존성 배열 비움: 함수 자체는 재생성될 필요 없음

  // postId 변경 시 게시글 정보 다시 불러오기
  useEffect(() => {
    if (postId) {
      const numericPostId = Number(postId);
      if (isNaN(numericPostId) || numericPostId <= 0) {
        setError('유효하지 않은 게시글 ID입니다.');
        setLoading(false);
        return;
      }
      fetchPost(numericPostId);
    } else {
      setError('게시글 ID가 없습니다.');
      setLoading(false);
    }
  }, [postId, fetchPost]); // postId와 fetchPost가 변경될 때마다 실행

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>로딩중...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;
  if (!post) return <div style={{ textAlign: 'center', marginTop: '50px' }}>게시글을 찾을 수 없습니다.</div>;

  // 게시글 등록일자를 보기 좋게 포맷팅 (메타 정보용)
  const formatPostRegDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
                  <a href="/">
                    <img
                      src="/assets/images/logo/logo.png"
                      alt="UnknownPaw"
                      style={{ height: '30px' }}
                    />
                  </a>
                </li>
                <li>
                  <a href="/community">커뮤니티</a>
                </li>
                <li>게시글 상세</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Single Area (게시글 본문) */}
      <section className="section blog-single" style={{ padding: '20px 0' }}>
        <div className="container" style={{ marginTop: '-80px' }}>
          <div className="row">
            <div className="col-12">
              <div
                className="single-inner"
                style={{
                  background: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  padding: '32px 28px',
                  marginBottom: '32px'
                }}>
                {/* 제목 */}
                <h1
                  className="post-title"
                  style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    marginBottom: '12px',
                    lineHeight: 1.3
                  }}>
                  {post.title}
                </h1>
                {/* 메타 정보 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '18px',
                    marginBottom: '18px',
                    flexWrap: 'wrap'
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                      src={getImageUrl(post.authorProfileImage) || '/assets/no-img.gif'}
                      alt={post.authorNickname}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid #eee'
                      }}
                    />
                    <span style={{ fontWeight: 500, fontSize: '1.05em' }}>
                      {post.authorNickname}
                    </span>
                  </div>
                  <span style={{ color: '#888', fontSize: '0.98em' }}>
                    <i className="lni lni-calendar"></i>{' '}
                    {formatPostRegDate(post.regDate)}
                  </span>
                  <span style={{ color: '#888', fontSize: '0.98em' }}>
                    <i className="lni lni-eye"></i> {post.viewCount}
                  </span>
                  <span style={{ color: '#888', fontSize: '0.98em' }}>
                    <i className="lni lni-heart"></i> {post.likes}
                  </span>
                  <span style={{ color: '#888', fontSize: '0.98em' }}>
                    <i className="lni lni-comments"></i> {post.commentCount}
                  </span>
                </div>
                {/* 이미지 */}
                {post.communityImages && post.communityImages.length > 0 && ( // post.communityImages가 비어있지 않고 길이가 0보다 클 때만
                  console.log(post.communityImages + '이미지 확인용'),
                  <div style={{ marginBottom: '24px' }}>
                    <img
                      src={getCommunityImageUrl(post.communityImages[0])} // 여기를 수정!
                      alt={post.title}
                      style={{
                        width: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        background: '#f8f8f8'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite loop
                        target.src = getRandomImage(); // Fallback to random image
                      }}
                    />
                  </div>
                )}
                {/* 본문 */}
                <div
                  className="post-content"
                  style={{
                    marginTop: '10px',
                    lineHeight: '1.85',
                    fontSize: '1.13em',
                    color: '#222',
                    minHeight: '120px'
                  }}>
                  {post.content}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 버튼 컨테이너 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px', /* 버튼 사이 간격 */
            marginTop: '20px', /* 상단 여백 */
            marginBottom: '40px' // 댓글 섹션과의 간격
          }}>
          <button
            onClick={() => navigate(-1)}
            className="reserve-button"
            style={{
              background: '#eee',
              color: '#333'
            }}>
            목록으로
          </button>
          {/* 현재 로그인한 사용자가 게시글 작성자인 경우에만 수정 버튼 표시 */}
          {post.authorId === Number(sessionStorage.getItem('mid')) && (
            <button
              onClick={() => navigate(`/community/edit/${post.communityId}`)}
              className="reserve-button"
              style={{
                background: '#f4c150', // 당근마켓 느낌의 색상 (주황색)
                color: '#fff'
              }}>
              수정하기
            </button>
          )}
        </div>

        {/* 댓글 섹션 추가 */}
        <div className="container">
          {/* postId가 유효한 숫자이고 post가 있을 때만 댓글 컴포넌트 렌더링 */}
          {postId && !isNaN(Number(postId)) && Number(postId) > 0 && <CommunityComments />}
        </div>
      </section>
    </>
  );
}
