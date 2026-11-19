import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import Placeholder from './pages/Placeholder'
import Quadro from './pages/Quadro'
import DemandaDetalhe from './pages/DemandaDetalhe'
import NovaDemanda from './pages/NovaDemanda'
import Backlog from './pages/Backlog'
import Incidentes from './pages/Incidentes'
import IncidenteDetalhe from './pages/IncidenteDetalhe'
import NovoIncidente from './pages/NovoIncidente'
import TemplatesDocs from './pages/TemplatesDocs'
import Perfil from './pages/Perfil'
import Projetos from './pages/Projetos'
import ProjetoDetalhe from './pages/ProjetoDetalhe'
import { navItems } from './components/navItems'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path="/quadro" element={<Quadro />} />
        <Route path="/quadro/nova" element={<NovaDemanda />} />
        <Route path="/quadro/:id" element={<DemandaDetalhe />} />
        <Route path="/backlog" element={<Backlog />} />
        <Route path="/incidentes" element={<Incidentes />} />
        <Route path="/incidentes/novo" element={<NovoIncidente />} />
        <Route path="/incidentes/:id" element={<IncidenteDetalhe />} />
        <Route path="/templates-docs" element={<TemplatesDocs />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/projetos" element={<Projetos />} />
        <Route path="/projetos/:id" element={<ProjetoDetalhe />} />
        {navItems
          .filter((item) => item.to !== '/projetos' && item.to !== '/quadro' && item.to !== '/backlog' && item.to !== '/incidentes' && item.to !== '/templates-docs')
          .map((item) => (
            <Route key={item.to} path={item.to} element={<Placeholder title={item.label} />} />
          ))}
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
