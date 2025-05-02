import {Route, Routes} from 'react-router-dom'
import {List} from '../../pages/unknownPaw/List'
import Navigation from './Navigation'
import Footer from './Footer'
import {About} from '../../pages/unknownPaw/About'
import {PetOwner} from '../../pages/unknownPaw/PetOwner'
import {PetSitter} from '../../pages/unknownPaw/PetSitter'
import {Community} from '../../pages/unknownPaw/Community'
import {ProfileSettings} from '../../pages/myPage/ProfileSettings'
import Chatting from '../../pages/myPage/Chatting'
import Faq from '../../pages/myPage/Faq'
import Dashboard from '../../pages/myPage/Dashboard'

export default function Layout() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route index element={<List />} />
        <Route path="/list" element={<List />} />
        <Route path="/about" element={<About />} />
        <Route path="/petowner" element={<PetOwner />} />
        <Route path="/petsitter" element={<PetSitter />} />
        <Route path="/community" element={<Community />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/chatting" element={<Chatting />} />
        <Route path="/faq" element={<Faq />} />
        {/* <Route path="/post" element={<Post />} />
        <Route path="/modify" element={<Modify />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} /> */}
      </Routes>
      <Footer />
    </>
  )
}
