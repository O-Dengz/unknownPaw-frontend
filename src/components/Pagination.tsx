import React from 'react'
import '../pages/myPage/myPage.css'

interface PageResultDTO {
  dtoList: any[]
  totalPage: number
  page: number
  size: number
  start: number
  end: number
  prev: boolean
  next: boolean
  pageList: number[]
}

interface SpringPageResponse {
  content: any[]
  pageable: {
    pageNumber: number
    pageSize: number
  }
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
  number: number
}

interface PaginationProps {
  pageInfo: SpringPageResponse | null
  onPageChange: (page: number) => void
}

// Spring Boot 페이지네이션 응답을 PageResultDTO 형식으로 변환하는 함수
const convertToPageResultDTO = (springPage: SpringPageResponse): PageResultDTO => {
  // Spring은 0-based, 우리는 1-based로 변환
  const currentPage = springPage.number + 1
  const totalPages = springPage.totalPages
  const pageSize = springPage.pageable.pageSize

  // 페이지 블록 크기 (5페이지씩 보여주기)
  const blockSize = 5
  const currentBlock = Math.floor((currentPage - 1) / blockSize)

  const start = currentBlock * blockSize + 1
  const end = Math.min(start + blockSize - 1, totalPages)

  const pageList = Array.from({length: end - start + 1}, (_, i) => start + i)

  return {
    dtoList: springPage.content,
    totalPage: totalPages,
    page: currentPage,
    size: pageSize,
    start,
    end,
    prev: !springPage.first,
    next: !springPage.last,
    pageList
  }
}

export function Pagination({pageInfo, onPageChange}: PaginationProps) {
  // 디버깅을 위한 콘솔 로그 추가
  // console.log('Pagination 컴포넌트 렌더링:', {
  //   pageInfo,
  //   convertedPageInfo: pageInfo ? convertToPageResultDTO(pageInfo) : null
  // })

  if (!pageInfo) {
    console.log('pageInfo가 null입니다.')
    return null
  }

  const convertedPageInfo = convertToPageResultDTO(pageInfo)

  if (!convertedPageInfo.pageList || convertedPageInfo.pageList.length === 0) {
    console.log('페이지네이션 렌더링 조건 미충족:', {
      hasPageList: !convertedPageInfo.pageList,
      isPageListEmpty: convertedPageInfo.pageList?.length === 0
    })
    return null
  }

  const {pageList, page, start, end, prev, next} = convertedPageInfo

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    // 페이지 번호가 유효한 범위 내에 있는지 확인
    if (newPage >= 1 && newPage <= convertedPageInfo.totalPage) {
      onPageChange(newPage - 1) // Spring은 0-based이므로 1을 빼서 전달
    }
  }

  return (
    <div className="pagination-mgt">
      <ul className="pagination-list">
        {prev && (
          <li>
            <button onClick={() => handlePageChange(start - 1)}>
              <i className="lni lni-chevron-left"></i>
            </button>
          </li>
        )}
        {pageList.map(pageNum => (
          <li key={pageNum} className={pageNum === page ? 'active' : ''}>
            <button onClick={() => handlePageChange(pageNum)}>{pageNum}</button>
          </li>
        ))}
        {next && (
          <li>
            <button onClick={() => handlePageChange(end + 1)}>
              <i className="lni lni-chevron-right"></i>
            </button>
          </li>
        )}
      </ul>
    </div>
  )
}
