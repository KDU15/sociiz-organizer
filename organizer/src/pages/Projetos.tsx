import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { projetos, resumo, statusTom, tipoLabel, type StatusProjeto, type Tipo } from '../data/projetos'

const tipos: ('todos' | Tipo)[] = ['todos', 'web', 'mobile', 'api', 'servico', 'sdk']
const statuses: ('Todos' | StatusProjeto)[] = ['Todos', 'Em produção', 'Em desenvolvimento', 'Em manutenção', 'Descontinuado']

export default function Projetos() {
  const [busca, setBusca] = useState('')
  const [tipo, setTipo] = useState<'todos' | Tipo>('todos')
  const [status, setStatus] = useState<'Todos' | StatusProjeto>('Todos')

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return projetos.filter(
      (p) =>
        (tipo === 'todos' || p.tipo === tipo) &&
        (status === 'Todos' || p.status === status) &&
        (!q || `${p.nome} ${p.stack}`.toLowerCase().includes(q)),
    )
  }, [busca, tipo, status])

  return (
    <>
      <div className="page-head page-head--row">
        <div className="page-head__title">
          <span className="eyebrow">Sociiz · Desenvolvimento</span>
          <h1>Projetos</h1>
        </div>
        <span className="badge badge--gray">Dados de exemplo</span>
        <button type="button" className="btn-pill btn-pill--accent">Cadastrar aplicação</button>
      </div>

      <div className="kpis">
        {resumo.map((k) => (
          <div className="kpi" key={k.label}>
            <span className="kpi__label">{k.label}</span>
            <span className="kpi__value">{k.value}</span>
            <span className="kpi__hint">{k.hint}</span>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <label htmlFor="busca-proj" className="sr-only">Buscar projetos</label>
        <input
          id="busca-proj"
          className="search"
          type="search"
          placeholder="Buscar por nome ou stack"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div role="group" aria-label="Filtrar por tipo" className="toolbar__chips">
          {tipos.map((t) => (
            <button
              key={t}
              type="button"
              className={`chip${tipo === t ? ' chip--on' : ''}`}
              aria-pressed={tipo === t}
              onClick={() => setTipo(t)}
            >
              {t === 'todos' ? 'Todos' : tipoLabel[t]}
            </button>
          ))}
        </div>
        <span className="toolbar__grow" />
        <label className="select-label">
          <span>Status</span>
          <select className="select" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="table-wrap">
        <div role="table" aria-label="Aplicações" className="table">
          <div role="row" className="trow trow--head">
            {['Aplicação', 'Tipo', 'Status', 'Versão', 'Último deploy', 'Responsável', 'Criticidade', 'Saúde'].map((h) => (
              <span role="columnheader" key={h}>{h}</span>
            ))}
          </div>
          {lista.map((p) => (
            <Link role="row" className="trow trow--link" to={`/projetos/${p.id}`} key={p.id}>
              <span role="cell" className="app-cell">
                <span aria-hidden="true" className={`tile tile--${p.tile}`}>{p.sigla}</span>
                <span className="app-cell__text">
                  <span className="nome">{p.nome}</span>
                  <span className="muted small">{p.stack}</span>
                </span>
              </span>
              <span role="cell">{tipoLabel[p.tipo]}</span>
              <span role="cell"><span className={`badge badge--${statusTom[p.status]}`}>{p.status}</span></span>
              <span role="cell" className="code">{p.versao}</span>
              <span role="cell" className="muted">{p.deploy}</span>
              <span role="cell" className="muted">{p.responsavel}</span>
              <span role="cell">{p.criticidade}</span>
              <span role="cell" className="health"><span aria-hidden="true" className={`dot dot--${p.saude}`} />{p.saudeLabel}</span>
            </Link>
          ))}
          {lista.length === 0 && <p className="empty">Nenhuma aplicação encontrada com esses filtros.</p>}
        </div>
      </div>
    </>
  )
}
