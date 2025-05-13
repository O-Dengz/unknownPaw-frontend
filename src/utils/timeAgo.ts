// src/utils/timeAgo.ts

/**
 * 과거 날짜와 현재 시간 사이의 시간 차이를 계산하여 사람이 읽기 쉬운 형식으로 반환합니다.
 * @param dateString - 백엔드에서 받은 날짜 문자열 (예: "2023-10-27T10:00:00" 또는 "2023-10-27")
 * @returns "방금 전", "5분 전", "3시간 전", "2일 전", "1개월 전", "1년 전" 등
 */
export function formatTimeAgo(dateString: string): string {
  // 전달받은 날짜 문자열을 Date 객체로 파싱합니다.
  const postDate = new Date(dateString)
  // 현재 시간을 가져옵니다.
  const now = new Date()

  // 날짜 파싱이 유효하지 않은 경우 빈 문자열 또는 에러를 반환할 수 있습니다.
  // if (isNaN(postDate.getTime())) {
  //     return ''; // 또는 다른 오류 처리
  // }

  // 현재 시간과 작성 시간의 차이를 밀리초 단위로 계산합니다.
  const diffMilliseconds = now.getTime() - postDate.getTime()
  // 밀리초 차이를 초 단위로 변환합니다.
  const diffSeconds = Math.floor(diffMilliseconds / 1000)

  // 시간 단위를 초로 정의합니다.
  const minute = 60
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7
  const month = day * 30 // 월은 평균적인 값으로 근사 (정확히 하려면 윤년 등 고려 필요)
  const year = day * 365 // 년은 평균적인 값으로 근사

  // 시간 차이에 따라 적절한 단위와 함께 문자열을 반환합니다.
  if (diffSeconds < 10) {
    return '방금 전'
  } else if (diffSeconds < minute) {
    return `${diffSeconds}초 전`
  } else if (diffSeconds < hour) {
    const diffMinutes = Math.floor(diffSeconds / minute)
    return `${diffMinutes}분 전`
  } else if (diffSeconds < day) {
    // 24시간(1일) 이내
    const diffHours = Math.floor(diffSeconds / hour)
    return `${diffHours}시간 전`
  } else if (diffSeconds < week) {
    const diffDays = Math.floor(diffSeconds / day)
    return `${diffDays}일 전`
  } else if (diffSeconds < month) {
    const diffWeeks = Math.floor(diffSeconds / week)
    return `${diffWeeks}주 전`
  } else if (diffSeconds < year) {
    const diffMonths = Math.floor(diffSeconds / month)
    return `${diffMonths}개월 전`
  } else {
    const diffYears = Math.floor(diffSeconds / year)
    return `${diffYears}년 전`
  }
}
