import {useLocation, Routes, Route} from 'react-router-dom'

import Navigation from './Navigation'
import Footer from './Footer'
import MainHeader from '../../components/MainHeader'

/* ---------- 공통 페이지 ---------- */
import {List} from '../../pages/unknownPaw/List'
import {About} from '../../pages/unknownPaw/About'
import {PetOwner} from '../../pages/unknownPaw/PetOwner'
import {PetSitter} from '../../pages/unknownPaw/PetSitter'
import {ItemDetails} from '../../pages/unknownPaw/ItemDetails'

/* ---------- 커뮤니티 ---------- */
import {Community} from '../../pages/community/Community'
import CommunityPost from '../../pages/community/CommunityPost'

/* ---------- 마이페이지 ---------- */
import Dashboard from '../../pages/myPage/Dashboard'
import {ProfileSettings} from '../../pages/myPage/ProfileSettings'
import Chatting from '../../pages/myPage/Chatting'
import Faq from '../../pages/myPage/Faq'
import Invoice from '../../pages/myPage/Invoice'
import MyItems from '../../pages/myPage/MyItems'
import MyFavourite from '../../pages/myPage/MyFavourite'

/* ---------- 멤버 ---------- */
import MemberProfile from '../../pages/member/MemberProfile'
import PostAd from '../../pages/postAd/PostAd'

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
        <Route path="/posts/:postType/read/:postId" element={<ItemDetails />} />

        {/* 커뮤니티 */}
        <Route path="/community" element={<Community />} />
        <Route path="/communitypost/:postId" element={<CommunityPost />} />

        {/* 마이페이지 */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/chatting" element={<Chatting />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/my-items" element={<MyItems />} />
        <Route path="/myfavourite" element={<MyFavourite />} />

        {/* 멤버 */}
        <Route path="/member/profile" element={<MemberProfile />} />
        <Route path="/postAd" element={<PostAd />} />
      </Routes>

      <Footer />
    </>
  )
}
