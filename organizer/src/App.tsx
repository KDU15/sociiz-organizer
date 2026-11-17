import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import Placeholder from './pages/Placeholder'
import { navItems } from './components/navItems'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout />}>
        {navItems.map((item) => (
          <Route key={item.to} path={item.to} element={<Placeholder title={item.label} />} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
