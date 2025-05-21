import {Route, Routes} from 'react-router-dom'
import {Login} from '../pages/member/Login'
import {Join} from '../pages/member/Join'
import PrivateRoute from './PrivateRoute'
import Layout from '../components/Layout'
import {List} from '../pages/unknownPaw/List'

export default function RoutesSetup() {
  return (
    <Routes>
      {/* 공개 라우트 */}
      <Route path="/list" element={<List />} />
      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<Join />} />

      {/* 보호된 라우트 */}
      <Route path="/*" element={<PrivateRoute component={Layout} />} />
    </Routes>
  )
}
