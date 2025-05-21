import {useLocation, Routes, Route, ScrollRestoration} from 'react-router-dom'

import Navigation from './Navigation'
import Footer from './Footer'
import MainHeader from '../../components/MainHeader'

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

export default function Layout() {
  const location = useLocation()
  const isListPage = location.pathname === '/' || location.pathname === '/list'
  return (
    <>
      {isListPage ? <MainHeader /> : <Navigation />}

      <Routes>
        {/* 기본/공통 */}
        <Route index element={<List />} />
        <Route path="/list" element={<List />} />
        <Route path="/about" element={<About />} />
        <Route path="/petowner/list" element={<PetOwner />} />
        <Route path="/petsitter/list" element={<PetSitter />} />
        <Route path="/community/posts" element={<Community />} />
        <Route path="/communitypost/:postId" element={<CommunityPost />} />
        <Route path="/postAd" element={<PostAd />} />

        {/* 상세 · 동적 라우트 */}
        <Route path="/posts/:postType/read/:postId" element={<ItemDetails />} />

        {/* 마이페이지 섹션 */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/chatting" element={<Chatting />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/reservation-details" element={<ReservationDetails />} />
        <Route path="/reservation-details/:rno" element={<ReservationDetailsView />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/myfavourite" element={<MyFavourite />} />
        <Route path="/pet-settings" element={<PetSettings />} />

        {/* 멤버 */}
        <Route path="/profile/simple/:mid" element={<MemberProfile />} />
        <Route path="/posts/:postType/read/postId" element={<ItemDetails />} />

        {/* 추후 기능
        <Route path="/post" element={<Post />} />
        <Route path="/modify" element={<Modify />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        */}
      </Routes>

      <Footer />
    </>
  )
}
