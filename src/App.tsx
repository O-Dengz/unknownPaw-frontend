import {BrowserRouter} from 'react-router-dom'
import RoutesSetup from './routes/RoutesSetup'
import {AuthProvider} from './contexts/AuthContext'
import FloatingPostButton from './components/ui/FloatingPostButton'
import '@/pages/myPage/myPage.css' 


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RoutesSetup />
        <FloatingPostButton />
      </BrowserRouter>
    </AuthProvider>
  )
}
