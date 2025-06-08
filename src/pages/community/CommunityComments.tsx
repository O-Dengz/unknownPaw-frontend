import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getImageUrl } from '../../utils/getImageUrl';


// 댓글 데이터 인터페이스 정의
interface Comment {
  commentId: number;
  content: string;
  authorNickname: string;
  authorProfileImage: string; // 회원 프로필 이미지 경로 또는 파일명 (예: "member/파일명.jpg")
  regDate: string;
  authorId: number;
  // TODO: 좋아요, 답글 등 추가 필드가 있다면 여기에 정의
}

// JWT 토큰 디코딩 함수 (이제 댓글 작성 시 memberId 추출에 사용되지 않으므로 제거 가능하지만, 혹시 다른 곳에서 쓸까봐 남겨둡니다.)
const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT 토큰 디코딩 실패:", e);
    return null;
  }
};

// CommunityComments 컴포넌트 (댓글 목록 및 작성)
export default function CommunityComments() {
  // URL에서 postId를 가져와 이 컴포넌트에서 직접 사용합니다.
  const { postId: postIdParam } = useParams<{ postId: string }>();
  const postId = Number(postIdParam); // 숫자로 변환

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 현재 로그인한 사용자의 ID (sessionStorage에서 가져옴)
  const [currentMemberId, setCurrentMemberId] = useState<number | null>(null);

  // 댓글 수정 관련 상태
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState<string>('');

  // 삭제 모달 관련 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState<number | null>(null);


  // 컴포넌트 마운트 시 sessionStorage에서 현재 사용자 ID를 가져와 설정
  useEffect(() => {
    const memberIdFromSession = sessionStorage.getItem('mid'); // 'mid' 키로 가져옵니다.
    if (memberIdFromSession && !isNaN(Number(memberIdFromSession))) {
      setCurrentMemberId(Number(memberIdFromSession));
    }
  }, []);

  // 댓글 목록 불러오기 함수
  const fetchComments = useCallback(async () => {
    // postId가 유효한 숫자인지 확인
    if (isNaN(postId) || postId <= 0) {
      setError('유효하지 않은 게시글 ID입니다.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        window.location.href = '/login';
        return;
      }

      console.log(`댓글 불러오기 요청: /api/community/posts/${postId}/comments`);
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`댓글을 불러오는데 실패했습니다. (${response.status}: ${errorText})`);
      }

      const data = await response.json();
      console.log('댓글 API 응답 데이터:', data); // API 응답 데이터 로깅

      if (Array.isArray(data)) {
        // API 응답 데이터를 Comment 인터페이스에 맞게 매핑합니다.
        const mappedComments: Comment[] = data.map((item: any) => ({
          commentId: item.commentId,
          content: item.content,
          authorNickname: item.nickname, // API의 'nickname'을 'authorNickname'에 매핑
          authorProfileImage: item.profileImageUrl, // API의 'profileImageUrl'을 'authorProfileImage'에 매핑
          regDate: item.createdAt, // API의 'createdAt'을 'regDate'에 매핑
          authorId: item.memberId, // API의 'memberId'를 'authorId'에 매핑
        }));

        // 최신 댓글이 위에 오도록 정렬
        const sortedComments = mappedComments.sort((a, b) => new Date(b.regDate).getTime() - new Date(a.regDate).getTime());
        setComments(sortedComments);
      } else {
        console.error('API 응답이 배열이 아닙니다:', data);
        setComments([]);
      }
    } catch (err) {
      console.error('댓글 불러오기 오류:', err);
      setError(err instanceof Error ? err.message : '댓글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [postId]); // postId가 변경될 때마다 fetchComments 함수 재생성

  // 컴포넌트 마운트 시 또는 postId 변경 시 댓글 불러오기
  useEffect(() => {
    if (!isNaN(postId) && postId > 0) {
      fetchComments();
    }
  }, [postId, fetchComments]);

  // 댓글 작성 처리 함수
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      const memberId = sessionStorage.getItem('mid'); // 'mid' 키로 가져옵니다.

      console.log("Session Storage에서 가져온 mid (memberId로 사용):", memberId);
      console.log("Session Storage에서 가져온 token:", token);

      // 토큰과 memberId 모두 유효한지 확인 (memberId는 숫자로 변환 가능해야 함)
      if (!token || !memberId || isNaN(Number(memberId))) { 
        console.error("DEBUG: 댓글 작성을 위해 유효한 로그인 정보(토큰 및 숫자 형태의 회원 ID)가 필요합니다. token:", token ? "존재함" : "없음", "memberId:", memberId);
        setError('댓글 작성을 위해 유효한 로그인 정보(토큰 및 회원 ID)가 필요합니다.');
        setIsSubmitting(false);
        window.location.href = '/login'; // 로그인 페이지로 이동
        return;
      }

      // 백엔드 컨트롤러에 맞춰 URL 경로와 memberId 요청 파라미터 추가
      console.log(`댓글 작성 요청: /api/community/posts/${postId}/comment?memberId=${memberId}, 내용: ${newCommentContent}`);
      const response = await fetch(`/api/community/posts/${postId}/comment?memberId=${memberId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // 인증 토큰 헤더에 포함
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newCommentContent }), // CommentDTO에 맞게 content만 전송
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`댓글 작성에 실패했습니다. (${response.status}: ${errorText})`);
      }

      setNewCommentContent(''); // 입력 필드 초기화
      await fetchComments(); // 댓글 목록 새로고침
    } catch (err) {
      console.error('댓글 작성 오류:', err);
      setError(err instanceof Error ? err.message : '댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 등록일자를 보기 좋게 포맷팅 (댓글용)
  const formatRegDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ==================== 댓글 수정/삭제 핸들러 ====================

  // 수정 버튼 클릭
  const handleEditClick = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(currentContent);
  };

  // 수정 취소 버튼 클릭
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentContent('');
  };

  // 댓글 수정 요청
  const handleUpdateComment = async (commentId: number) => {
    if (!editedCommentContent.trim()) {
      setError('댓글 내용은 비워둘 수 없습니다.');
      return;
    }
    if (currentMemberId === null) {
      setError('로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.');
      window.location.href = '/login';
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('로그인이 필요합니다.');
      window.location.href = '/login';
      return;
    }

    try {
      console.log(`댓글 수정 요청: /api/community/comment/${commentId}?memberId=${currentMemberId}, 내용: ${editedCommentContent}`);
      const response = await fetch(`/api/community/comment/${commentId}?memberId=${currentMemberId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type을 'text/plain'으로 설정하거나, JSON.stringify를 사용하지 않을 경우 생략 가능
          // 'Content-Type': 'application/json', // <--- 이 부분은 유지해도 무방하나, 바디에 문자열만 보낼 경우 불필요
        },
        body: editedCommentContent, // ⭐ JSON.stringify() 제거! 순수한 문자열 전송
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`댓글 수정에 실패했습니다. (${response.status}: ${errorText})`);
      }

      // 성공 시 목록 새로고침 및 수정 상태 초기화
      await fetchComments();
      handleCancelEdit();
    } catch (err) {
      console.error('댓글 수정 오류:', err);
      setError(err instanceof Error ? err.message : '댓글 수정에 실패했습니다.');
    }
  };

  // 삭제 버튼 클릭 (모달 띄우기)
  const handleDeleteClick = (commentId: number) => {
    setCommentToDeleteId(commentId);
    setShowDeleteModal(true);
  };

  // 삭제 모달 닫기
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCommentToDeleteId(null);
  };

  // 삭제 확인 (API 요청)
  const handleConfirmDelete = async () => {
    if (commentToDeleteId === null || currentMemberId === null) {
      setError('삭제할 댓글 또는 로그인 정보가 유효하지 않습니다.');
      handleCloseDeleteModal();
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('로그인이 필요합니다.');
      window.location.href = '/login';
      return;
    }

    try {
      console.log(`댓글 삭제 요청: /api/community/comment/${commentToDeleteId}?memberId=${currentMemberId}`);
      const response = await fetch(`/api/community/comment/${commentToDeleteId}?memberId=${currentMemberId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`댓글 삭제에 실패했습니다. (${response.status}: ${errorText})`);
      }

      // 성공 시 목록 새로고침 및 모달 닫기
      await fetchComments();
      handleCloseDeleteModal();
    } catch (err) {
      console.error('댓글 삭제 오류:', err);
      setError(err instanceof Error ? err.message : '댓글 삭제에 실패했습니다.');
    }
  };


  return (
    <div className="community-comments-section" style={{
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      padding: '24px',
      marginBottom: '32px'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 600,
        marginBottom: '20px',
        color: '#333'
      }}>댓글 ({comments.length})</h3>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      {/* 댓글 작성 폼 */}
      <form onSubmit={handleSubmitComment} style={{ marginBottom: '30px' }}>
        <textarea
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder="댓글을 작성해주세요..."
          rows={4}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1em',
            resize: 'vertical',
            marginBottom: '10px',
            boxSizing: 'border-box'
          }}
          disabled={isSubmitting}
        ></textarea>
        <button
          type="submit"
          disabled={!newCommentContent.trim() || isSubmitting}
          style={{
            background: isSubmitting ? '#ccc' : '#f4c150', // 당근마켓 느낌의 색상 (주황색)
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '1em',
            fontWeight: 'bold',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          {isSubmitting ? '작성 중...' : '댓글 작성'}
        </button>
      </form>

      {/* 댓글 목록 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>댓글 로딩 중...</div>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
          아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
        </div>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.commentId} className="comment-item" style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '20px',
              paddingBottom: '20px',
              borderBottom: '1px solid #eee'
            }}>
              <img
                src={getImageUrl(comment.authorProfileImage)} // getImageUrl 함수 사용
                alt={comment.authorNickname}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid #eee',
                  flexShrink: 0
                }}
                onError={(e) => { // 이미지 로드 실패 시 대체 이미지
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite loop
                  target.src = '/assets/no-img.gif'; // 기본 대체 이미지 (public/assets/no-img.gif)
                }}
              />
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{ fontWeight: 600, fontSize: '1.05em', color: '#333' }}>
                    {comment.authorNickname}
                  </span>
                  <span style={{ fontSize: '0.85em', color: '#888' }}>
                    {formatRegDate(comment.regDate)}
                  </span>
                </div>
                
                {/* 댓글 수정 중일 때 */}
                {editingCommentId === comment.commentId ? (
                  <div style={{ marginTop: '10px' }}>
                    <textarea
                      value={editedCommentContent}
                      onChange={(e) => setEditedCommentContent(e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '0.95em',
                        resize: 'vertical',
                        marginBottom: '8px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleUpdateComment(comment.commentId)}
                        style={{
                          background: '#f4c150', color: '#fff', border: 'none', padding: '6px 12px',
                          borderRadius: '5px', fontSize: '0.9em', cursor: 'pointer'
                        }}
                      >
                        저장
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        style={{
                          background: '#ccc', color: '#333', border: 'none', padding: '6px 12px',
                          borderRadius: '5px', fontSize: '0.9em', cursor: 'pointer'
                        }}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  // 댓글 내용 표시
                  <p style={{ fontSize: '1em', lineHeight: 1.6, color: '#555', margin: 0 }}>
                    {comment.content}
                  </p>
                )}

                {/* 수정/삭제 버튼 (본인 댓글일 경우에만 표시) */}
                {currentMemberId !== null && comment.authorId === currentMemberId && editingCommentId !== comment.commentId && (
                  <div style={{ marginTop: '10px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleEditClick(comment.commentId, comment.content)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '1em',
                        padding: '5px', borderRadius: '5px', transition: 'background-color 0.2s ease'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'none')}
                    >
                      <i className="fas fa-pencil-alt"></i> {/* 연필 아이콘 */}
                    </button>
                    <button
                      onClick={() => handleDeleteClick(comment.commentId)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '1em',
                        padding: '5px', borderRadius: '5px', transition: 'background-color 0.2s ease'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'none')}
                    >
                      <i className="fas fa-trash-alt"></i> {/* 휴지통 아이콘 */}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#fff', padding: '30px', borderRadius: '10px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)', textAlign: 'center',
            maxWidth: '400px', width: '90%'
          }}>
            <h4 style={{ fontSize: '1.3em', marginBottom: '20px', color: '#333' }}>댓글 삭제</h4>
            <p style={{ marginBottom: '30px', color: '#555' }}>정말로 이 댓글을 삭제하시겠습니까?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button
                onClick={handleConfirmDelete}
                style={{
                  background: '#ff4d4d', color: '#fff', border: 'none', padding: '10px 20px',
                  borderRadius: '8px', fontSize: '1em', fontWeight: 'bold', cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
              >
                삭제
              </button>
              <button
                onClick={handleCloseDeleteModal}
                style={{
                  background: '#ccc', color: '#333', border: 'none', padding: '10px 20px',
                  borderRadius: '8px', fontSize: '1em', fontWeight: 'bold', cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
