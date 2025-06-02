import {useLocation, Routes, Route, ScrollRestoration, Outlet} from 'react-router-dom'

import Header from './Header'

import MainHeader from '../MainLayout/MainHeader'

/* ---------- 공통 페이지 ---------- */
import {List} from '../../pages/unknownPaw/List'
import {About} from '../../pages/unknownPaw/About'
import {PetOwner} from '../../pages/unknownPaw/PetOwner'
import {PetSitter} from '../../pages/unknownPaw/PetSitter'
import {ItemDetails} from '../../pages/unknownPaw/ItemDetails'
import {Community} from '../../pages/community/Community'
import CommunityPost from '../../pages/community/CommunityPost'

/* ---------- 마이페이지 ---------- */
import Dashboard from '../../pages/myPage/Dashboard'
import {ProfileSettings} from '../../pages/myPage/ProfileSettings'

import Chatting from '../../pages/myPage/Chatting'
import Faq from '../../pages/myPage/Faq'
import ReservationDetails from '../../pages/myPage/ReservationDetails'
import ReservationDetailsView from '../../pages/myPage/ReservationDetailsView'
import MyPosts from '../../pages/myPage/MyPosts'
import MyFavourite from '../../pages/myPage/MyFavourite'

/* ---------- 멤버 ---------- */
import MemberProfile from '../../pages/member/MemberProfile'

import PostAd from '../../pages/postAd/PostAd'
import {PetSettings} from '../../pages/myPage/PetSettings'

import {Footer} from './Footer'

export default function Layout() {
  const location = useLocation()
  const isListPage = location.pathname === '/' || location.pathname === '/list'

  return (
    <div className="min-h-screen flex flex-col">
      {isListPage ? <MainHeader /> : <Header />}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
