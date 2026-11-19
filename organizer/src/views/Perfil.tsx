'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { iniciaisDe, usePerfil, type Perfil as PerfilT } from '../data/PerfilContext'

const notificacoes: { chave: keyof PerfilT['notificacoes']; titulo: string; texto: string }[] = [
  { chave: 'incidentes', titulo: 'Incidentes', texto: 'Avisar quando um incidente crítico for aberto.' },
  { chave: 'demandas', titulo: 'Demandas', texto: 'Avisar quando uma demanda for atribuída a mim.' },
  { chave: 'publicacoes', titulo: 'Publicações', texto: 'Avisar quando uma versão for publicada em produção.' },
]

export default function Perfil() {
  const { perfil, salvar, pronto } = usePerfil()
  const [form, setForm] = useState<PerfilT>(perfil)
  const [erro, setErro] = useState('')
  const [salvo, setSalvo] = useState(false)

  useEffect(() => {
    if (pronto) setForm(perfil)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pronto])

  const alterado = JSON.stringify(form) !== JSON.stringify(perfil)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) return setErro('Informe o nome.')
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setErro('Informe um e-mail válido.')
    setErro('')
    salvar({ ...form, nome: form.nome.trim(), cargo: form.cargo.trim(), email: form.email.trim() })
    setSalvo(true)
  }

  const edit = (patch: Partial<PerfilT>) => {
    setSalvo(false)
    setForm((f) => ({ ...f, ...patch }))
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="page-head">
        <span className="eyebrow">Sociiz · Desenvolvimento</span>
        <h1>Configurações do perfil</h1>
        <p className="muted form__lead">Estes dados aparecem no menu e no histórico das demandas e incidentes.</p>
      </div>

      <div className="profile-card">
        <span className="sidemenu__avatar sidemenu__avatar--xl" aria-hidden="true">{iniciaisDe(form.nome)}</span>
        <div className="popup__id">
          <strong>{form.nome || 'Sem nome'}</strong>
          <span className="muted">{form.cargo || 'Sem cargo'}</span>
        </div>
      </div>

      <div className="form__grid">
        <label className="field">
          <span className="label">Nome</span>
          <input className="input input--sm" value={form.nome} onChange={(e) => edit({ nome: e.target.value })} autoComplete="name" aria-invalid={erro.includes('nome')} />
        </label>
        <label className="field">
          <span className="label">Cargo</span>
          <input className="input input--sm" value={form.cargo} onChange={(e) => edit({ cargo: e.target.value })} autoComplete="organization-title" />
        </label>
      </div>
      <label className="field">
        <span className="label">E-mail</span>
        <input className="input input--sm" type="email" value={form.email} onChange={(e) => edit({ email: e.target.value })} autoComplete="email" aria-invalid={erro.includes('e-mail')} />
        <span className="help">Usado para entrar e para receber avisos.</span>
      </label>

      <fieldset className="fieldset">
        <legend className="label">Notificações</legend>
        {notificacoes.map((n) => (
          <label className="switch-row" key={n.chave}>
            <span className="item__text">
              <span className="item__title">{n.titulo}</span>
              <span className="small muted">{n.texto}</span>
            </span>
            <input
              type="checkbox"
              role="switch"
              className="switch"
              checked={form.notificacoes[n.chave]}
              onChange={(e) => edit({ notificacoes: { ...form.notificacoes, [n.chave]: e.target.checked } })}
            />
          </label>
        ))}
      </fieldset>

      {erro && <p role="alert" className="form__error">{erro}</p>}
      {salvo && <p role="status" className="form__ok">Perfil atualizado.</p>}

      <div className="form__actions">
        <button type="button" className="btn-pill btn-pill--secondary" disabled={!alterado} onClick={() => { setForm(perfil); setErro(''); setSalvo(false) }}>
          Descartar
        </button>
        <button type="submit" className="btn-pill btn-pill--accent" disabled={!alterado}>Salvar alterações</button>
      </div>
    </form>
  )
}
