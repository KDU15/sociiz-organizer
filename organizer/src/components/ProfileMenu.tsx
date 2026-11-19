import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePerfil } from '../data/PerfilContext'

export default function ProfileMenu() {
  const { perfil, iniciais } = usePerfil()
  const navigate = useNavigate()
  const [aberto, setAberto] = useState(false)
  const raiz = useRef<HTMLDivElement>(null)
  const botao = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!aberto) return
    raiz.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
    const fora = (e: MouseEvent) => {
      if (!raiz.current?.contains(e.target as Node)) setAberto(false)
    }
    document.addEventListener('mousedown', fora)
    return () => document.removeEventListener('mousedown', fora)
  }, [aberto])

  function fechar(devolverFoco = true) {
    setAberto(false)
    if (devolverFoco) botao.current?.focus()
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') return fechar()
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const itens = Array.from(raiz.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
      const i = itens.indexOf(document.activeElement as HTMLElement)
      itens[(i + (e.key === 'ArrowDown' ? 1 : itens.length - 1)) % itens.length]?.focus()
    }
    if (e.key === 'Tab') setAberto(false)
  }

  return (
    <div className="profile" ref={raiz} onKeyDown={onKeyDown}>
      <button
        ref={botao}
        type="button"
        className="sidemenu__user"
        aria-label={`Perfil de ${perfil.nome}`}
        aria-haspopup="menu"
        aria-expanded={aberto}
        data-tooltip={aberto ? undefined : `${perfil.nome} · ${perfil.cargo}`}
        onClick={() => setAberto((v) => !v)}
      >
        <span className="sidemenu__avatar" aria-hidden="true">{iniciais}</span>
      </button>

      {aberto && (
        <div className="popup" role="menu" aria-label="Menu do perfil">
          <div className="popup__head">
            <span className="sidemenu__avatar sidemenu__avatar--lg" aria-hidden="true">{iniciais}</span>
            <div className="popup__id">
              <strong>{perfil.nome}</strong>
              <span>{perfil.cargo}</span>
            </div>
          </div>
          <div className="popup__sep" role="separator" />
          <Link to="/perfil" role="menuitem" className="popup__item" onClick={() => fechar(false)}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="2.5" />
              <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4" />
            </svg>
            Configurações do perfil
          </Link>
          <button
            type="button"
            role="menuitem"
            className="popup__item popup__item--danger"
            onClick={() => {
              setAberto(false)
              navigate('/login')
            }}
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3.5H5A1.5 1.5 0 0 0 3.5 5v10A1.5 1.5 0 0 0 5 16.5h3M12.5 6.5 16 10l-3.5 3.5M16 10H8" />
            </svg>
            Sair
          </button>
        </div>
      )}
    </div>
  )
}
