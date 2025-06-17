import {Link, useLocation, useNavigate} from 'react-router-dom'
import {PencilSquareIcon} from '@heroicons/react/24/solid'
import {useState} from 'react'
import LoginRequiredModal from './LoginRequiredModal'

export default function FloatingPostButton() {
  const location = useLocation()
  const path = location.pathname.toLowerCase()

  // 메인, 리스트, 각종 상세페이지에서만 숨김
  if (
    // path === '/' ||
    path.startsWith('/communitypost') ||
    path.startsWith('/petownerpost') ||
    path.startsWith('/petsitterpost') ||
    path.startsWith('/login') ||
    path.startsWith('/join') ||
    path.startsWith('/postAd')
  ) {
    return null
  }

  return (
    <>
      <Link
        to="/postAd"
        className="fixed bottom-6 right-6 bg-[#f1a852] hover:bg-[#e89a42] text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:shadow-md"
        aria-label="글쓰기 바로가기">
        <PencilSquareIcon className="w-6 h-6" />
      </Link>
    </>
  )
}
