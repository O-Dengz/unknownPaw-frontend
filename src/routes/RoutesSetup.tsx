import {Route, Routes} from 'react-router-dom'
import {Login} from '../pages/member/Login'
import {Join} from '../pages/member/Join'
import PrivateRoute from './PrivateRoute'
import Layout from './Layout'

export default function RoutesSetup() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<Join />} />
      <Route path="/*" element={<PrivateRoute component={Layout} />} />
    </Routes>
  )
}
