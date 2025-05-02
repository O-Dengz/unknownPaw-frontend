import {BrowserRouter} from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import RoutesSetup from './routes/RoutesSetup'

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <RoutesSetup />
      </BrowserRouter>
    </HelmetProvider>
  )
}
