import React from 'react'
interface PageResultDTO {
  dtoList: any[] // 페이지네이션 렌더링에는 필요 없지만, 객체 구조 일치를 위해 정의
  totalPage: number
  page: number // 현재 페이지 번호
  size: number // 페이지 사이즈 (페이지네이션 렌더링에 필요 없지만, 객체 구조 일치)
  start: number // 페이지 블록의 시작 번호
  end: number // 페이지 블록의 끝 번호
  prev: boolean // 이전 블록 존재 여부
  next: boolean // 다음 블록 존재 여부
  pageList: number[] // 표시할 페이지 번호 목록
}

interface PaginationProps {
  // pageInfo 객체 전체를 prop으로 받음
  pageInfo: PageResultDTO | null // pageInfo는 null일 수 있으므로 | null 추가

  // 페이지 변경 핸들러 함수는 그대로 받음
  onPageChange: (page: number) => void
}

export function Pagination({pageInfo, onPageChange}: PaginationProps) {
  // pageInfo가 null이거나 pageList가 없거나 비어있으면 아무것도 렌더링하지 않음
  // PetSitter.tsx에서 이미 pageInfo && !loading 조건으로 감싸고 있지만, 컴포넌트 내부에서 한 번 더 체크하면 안전
  if (!pageInfo || !pageInfo.pageList || pageInfo.pageList.length === 0) {
    return null
  }

  // pageInfo 객체에서 필요한 속성들을 구조 분해 할당하여 사용
  // pageList, page (현재 페이지), start, end, prev, next 등을 pageInfo에서 가져옴
  const {pageList, page, start, end, prev, next} = pageInfo

  return (
    <div className="pagination-area">
      <ul className="pagination">
        {/* 이전 페이지 버튼: pageInfo.prev 사용 */}
        {prev && (
          <li className="page-item">
            {/* start에서 1을 빼서 이전 블록의 마지막 페이지로 이동 */}
            <button className="page-link" onClick={() => onPageChange(start - 1)}>
              이전
            </button>
          </li>
        )}
        {/* 페이지 번호 버튼 목록: pageInfo.pageList 사용 */}
        {pageList.map(pageNum => (
          <li
            key={pageNum}
            // 현재 페이지 (pageInfo.page)와 페이지 번호 비교
            className={`page-item ${pageNum === page ? 'active' : ''}`}>
            {/* 클릭 시 해당 페이지 번호로 이동 */}
            <button className="page-link" onClick={() => onPageChange(pageNum)}>
              {pageNum}
            </button>
          </li>
        ))}
        {/* 다음 페이지 버튼: pageInfo.next 사용 */}
        {next && (
          <li className="page-item">
            {/* end에서 1을 더해서 다음 블록의 첫 페이지로 이동 */}
            <button className="page-link" onClick={() => onPageChange(end + 1)}>
              다음
            </button>
            {/* </button> */}
          </li>
        )}
      </ul>
    </div>
  )
}
