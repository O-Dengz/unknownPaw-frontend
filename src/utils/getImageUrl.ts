// src/utils/getImageUrl.ts
export function getImageUrl(path: string) {
  const CONTEXT = import.meta.env.VITE_CONTEXT_PATH ?? '/unknownPaw'
  // 개발 환경일 때만 8080 호스트를 붙인다
  const HOST = import.meta.env.DEV ? 'http://localhost:8080' : ''
  return `${HOST}${CONTEXT}/${path}`
}
