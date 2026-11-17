import { Outlet } from 'react-router-dom'
import SideMenu from './SideMenu'

export default function AppLayout() {
  return (
    <div className="shell">
      <SideMenu />
      <main className="shell__main">
        <Outlet />
      </main>
    </div>
  )
}
