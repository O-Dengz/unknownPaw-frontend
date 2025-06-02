import {Route, Routes} from 'react-router-dom'
import {Login} from '../pages/member/Login'
import {Join} from '../pages/member/Join'
import Layout from '../components/Layout'
import {List} from '../pages/unknownPaw/List'
import {About} from '../pages/unknownPaw/About'
import {PetOwner} from '../pages/unknownPaw/PetOwner'
import {PetSitter} from '../pages/unknownPaw/PetSitter'
import {ItemDetails} from '../pages/unknownPaw/ItemDetails'
import {Community} from '../pages/community/Community'
import CommunityPost from '../pages/community/CommunityPost'
import Dashboard from '../pages/myPage/Dashboard'
import {ProfileSettings} from '../pages/myPage/ProfileSettings'
import Chatting from '../pages/myPage/Chatting'
import Faq from '../pages/myPage/Faq'
import ReservationDetails from '../pages/myPage/ReservationDetails'
import ReservationDetailsView from '../pages/myPage/ReservationDetailsView'
import MyPosts from '../pages/myPage/MyPosts'
import MyFavourite from '../pages/myPage/MyFavourite'
import MemberProfile from '../pages/member/MemberProfile'
import PostAd from '../pages/postAd/PostAd'
import EditPetOwnerPost from '@/pages/postAd/ModifyPetOwnerPost'
import {PetSettings} from '../pages/myPage/PetSettings'
import NoMatch from './NoMatch'
import ModifyPetOwnerPost from '@/pages/postAd/ModifyPetOwnerPost'

export default function RoutesSetup() {
  return (
    <Routes>
      {/* Layout이 감싸는 모든 페이지 */}
      <Route element={<Layout />}>
        <Route index element={<List />} />
        <Route path="/list" element={<List />} />
        <Route path="/about" element={<About />} />
        <Route path="/petowner/list" element={<PetOwner />} />
        <Route path="/petsitter/list" element={<PetSitter />} />
        <Route path="/community/posts" element={<Community />} />
        <Route path="/communitypost/:postId" element={<CommunityPost />} />
        <Route path="/postAd" element={<PostAd />} />
        <Route path="/posts/:postType/read/:postId" element={<ItemDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/chatting" element={<Chatting />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/reservation-details" element={<ReservationDetails />} />
        <Route path="/reservation-details/:rno" element={<ReservationDetailsView />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/myfavourite" element={<MyFavourite />} />
        <Route path="/pet-settings" element={<PetSettings />} />
        <Route path="/member/profile/simple/:mid" element={<MemberProfile />} />
        <Route path="/posts/:postType/edit/:postId" element={<ModifyPetOwnerPost />} />
      </Route>
      {/* Layout 없이 보여야 하는 페이지 */}
      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<Join />} />

      <Route path="*" element={<NoMatch />} />
    </Routes>
  )
}
