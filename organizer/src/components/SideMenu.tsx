'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navItems } from './navItems'
import ProfileMenu from './ProfileMenu'

export default function SideMenu() {
  const pathname = usePathname()
  return (
    <nav className="sidemenu" aria-label="Navegação principal">
      <div className="sidemenu__brand">
        <img src="/sociiz-mark.svg" alt="Sociiz Organizer" />
      </div>
      {navItems.map((item) => {
        const ativo = pathname === item.to || pathname.startsWith(`${item.to}/`)
        return (
          <Link
            key={item.to}
            href={item.to}
            aria-label={item.label}
            aria-current={ativo ? 'page' : undefined}
            data-tooltip={item.label}
            className={`navitem${ativo ? ' navitem--active' : ''}`}
          >
            {item.icon}
          </Link>
        )
      })}
      <div className="sidemenu__spacer" />
      <ProfileMenu />
    </nav>
  )
}
