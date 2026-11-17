import { NavLink } from 'react-router-dom'
import logo from '../assets/sociiz-logo.svg'
import { navItems } from './navItems'

export default function SideMenu() {
  return (
    <nav className="sidemenu" aria-label="Navegação principal">
      <div className="sidemenu__brand">
        <img src={logo} alt="Sociiz" />
        <span>Organizer</span>
      </div>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `navitem${isActive ? ' navitem--active' : ''}`}
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
      <div className="sidemenu__spacer" />
      <div className="sidemenu__user">
        <span className="sidemenu__avatar" aria-hidden="true">CE</span>
        <div className="sidemenu__user-info">
          <strong>Carlos Eduardo</strong>
          <span>Dev principal</span>
        </div>
      </div>
    </nav>
  )
}
