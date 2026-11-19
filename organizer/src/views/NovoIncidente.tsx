'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { projetos } from '../data/projetos'
import { severidades, type Severidade } from '../data/incidentes'
import { useIncidentes } from '../data/IncidentesContext'

export default function NovoIncidente() {
  const router = useRouter()
  const { criar } = useIncidentes()
  const [titulo, setTitulo] = useState('')
  const [projeto, setProjeto] = useState('')
  const [severidade, setSeveridade] = useState<Severidade>('Alta')
  const [descricao, setDescricao] = useState('')
  const [impacto, setImpacto] = useState('')
  const [erro, setErro] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!titulo.trim()) return setErro('Informe um título para o incidente.')
    if (!projeto) return setErro('Selecione o projeto afetado.')
    router.push(`/incidentes/${criar({ titulo, projeto, severidade, descricao, impacto }).id}`)
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <nav aria-label="Trilha" className="crumbs">
        <Link href="/incidentes">Incidentes</Link>
        <span aria-hidden="true" className="crumbs__sep">/</span>
        <span className="muted">Registrar incidente</span>
      </nav>
      <div className="page-head">
        <h1>Registrar incidente</h1>
        <p className="muted form__lead">Para um problema que afeta a operação agora. Os detalhes podem ser completados durante a investigação.</p>
      </div>

      <label className="field">
        <span className="label">Título</span>
        <input className="input input--sm" placeholder="Ex.: Erro 500 no login facial em Android 14" value={titulo} onChange={(e) => setTitulo(e.target.value)} aria-invalid={erro.includes('título')} />
      </label>

      <div className="form__grid">
        <label className="field">
          <span className="label">Projeto afetado</span>
          <select className="input input--sm" value={projeto} onChange={(e) => setProjeto(e.target.value)}>
            <option value="">Selecione</option>
            {projetos.map((p) => (
              <option key={p.id}>{p.nome}</option>
            ))}
          </select>
        </label>
        <div role="radiogroup" aria-label="Severidade" className="field field--gap">
          <span className="label">Severidade</span>
          <div className="toolbar__chips toolbar__chips--tight">
            {severidades.map((s) => (
              <button key={s} type="button" role="radio" aria-checked={severidade === s} className={`opt${severidade === s ? ' opt--on' : ''}`} onClick={() => setSeveridade(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <label className="field">
        <span className="label">O que está acontecendo</span>
        <textarea className="input input--sm input--area" rows={4} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Sintomas, quando começou e o que já foi tentado" />
      </label>
      <label className="field">
        <span className="label">Impacto</span>
        <input className="input input--sm" value={impacto} onChange={(e) => setImpacto(e.target.value)} placeholder="Quem está sendo afetado e como" />
      </label>

      {erro && <p role="alert" className="form__error">{erro}</p>}
      <div className="form__actions">
        <Link href="/incidentes" className="btn-pill btn-pill--secondary btn-pill--link">Cancelar</Link>
        <button type="submit" className="btn-pill btn-pill--accent">Registrar incidente</button>
      </div>
    </form>
  )
}
