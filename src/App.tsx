import { BrowserRouter } from 'react-router-dom'
import ThemeSwitch from '@/components/shared/ThemeSwitch'
import AppRoutes from '@/routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ThemeSwitch />
    </BrowserRouter>
  )
}

export default App
