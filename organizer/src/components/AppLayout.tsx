'use client'

import type { ReactNode } from 'react'
import SideMenu from './SideMenu'
import { PerfilProvider } from '../data/PerfilContext'
import { IncidentesProvider } from '../data/IncidentesContext'
import { DemandasProvider } from '../data/DemandasContext'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <PerfilProvider>
      <DemandasProvider>
        <IncidentesProvider>
          <div className="shell">
            <SideMenu />
            <main className="shell__main">{children}</main>
          </div>
        </IncidentesProvider>
      </DemandasProvider>
    </PerfilProvider>
  )
}
