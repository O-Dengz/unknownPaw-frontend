import React from 'react'

export function UniversalSkeleton({ type }: { type: 'list' | 'form' | 'detail' }) {
  if (type === 'list') {
    // 카드 리스트 스켈레톤 (3개 예시, Tailwind 기준)
    return (
      <>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="col-lg-4 col-md-6 col-12 mb-4 animate-pulse"
            style={{ minHeight: 320 }}>
            <div className="bg-gray-200 rounded-xl h-56 w-full mb-4" />
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-1/2 mb-1" />
            <div className="h-4 bg-gray-100 rounded w-2/3 mb-3" />
            <div className="flex gap-2">
              <div className="h-4 w-10 bg-gray-200 rounded"></div>
              <div className="h-4 w-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </>
    )
  }
  if (type === 'form') {
    // 폼 스켈레톤
    return (
      <div className="w-full max-w-2xl mx-auto animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="mb-6">
            <div className="h-4 bg-gray-200 w-24 mb-2 rounded" />
            <div className="h-10 bg-gray-100 rounded" />
          </div>
        ))}
        <div className="h-10 bg-gray-200 w-32 mt-8 rounded" />
      </div>
    )
  }
  // detail 스켈레톤 (상세페이지)
  return (
    <div className="w-full max-w-3xl mx-auto animate-pulse">
      <div className="h-64 bg-gray-200 mb-6 rounded-xl" />
      <div className="h-6 bg-gray-200 w-3/5 mb-4 rounded" />
      <div className="h-4 bg-gray-100 w-4/5 mb-2 rounded" />
      <div className="h-4 bg-gray-100 w-full mb-2 rounded" />
      <div className="h-4 bg-gray-100 w-1/2 mb-4 rounded" />
    </div>
  )
}