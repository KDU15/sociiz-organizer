import { Outlet } from 'react-router-dom'
import SideMenu from './SideMenu'
import { PerfilProvider } from '../data/PerfilContext'
import { IncidentesProvider } from '../data/IncidentesContext'
import { DemandasProvider } from '../data/DemandasContext'

export default function AppLayout() {
  return (
    <PerfilProvider>
    <DemandasProvider>
      <IncidentesProvider>
        <div className="shell">
          <SideMenu />
          <main className="shell__main">
            <Outlet />
          </main>
        </div>
      </IncidentesProvider>
    </DemandasProvider>
    </PerfilProvider>
  )
}
