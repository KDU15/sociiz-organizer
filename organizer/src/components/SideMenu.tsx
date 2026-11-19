import { NavLink } from 'react-router-dom'
import mark from '../assets/sociiz-mark.svg'
import { navItems } from './navItems'
import ProfileMenu from './ProfileMenu'

export default function SideMenu() {
  return (
    <nav className="sidemenu" aria-label="Navegação principal">
      <div className="sidemenu__brand">
        <img src={mark} alt="Sociiz Organizer" />
      </div>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          aria-label={item.label}
          data-tooltip={item.label}
          className={({ isActive }) => `navitem${isActive ? ' navitem--active' : ''}`}
        >
          {item.icon}
        </NavLink>
      ))}
      <div className="sidemenu__spacer" />
      <ProfileMenu />
    </nav>
  )
}
