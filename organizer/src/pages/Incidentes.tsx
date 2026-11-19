import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { severidadeTom, severidades, statusFluxo, statusTom, type Severidade, type StatusIncidente } from '../data/incidentes'
import { formatarData, formatarDuracao, useIncidentes } from '../data/IncidentesContext'

export default function Incidentes() {
  const { incidentes } = useIncidentes()
  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState<'abertos' | 'todos' | StatusIncidente>('abertos')
  const [severidade, setSeveridade] = useState<'todas' | Severidade>('todas')

  const abertos = incidentes.filter((i) => i.status !== 'Resolvido')
  const resolvidos = incidentes.filter((i) => i.resolvidoEm)
  const mttr = resolvidos.length
    ? resolvidos.reduce((t, i) => t + (new Date(i.resolvidoEm!).getTime() - new Date(i.inicio).getTime()), 0) / resolvidos.length
    : null

  const kpis = [
    { label: 'Abertos', value: String(abertos.length), hint: 'Não resolvidos' },
    { label: 'Críticos', value: String(abertos.filter((i) => i.severidade === 'Crítica').length), hint: 'Severidade crítica em aberto' },
    { label: 'Tempo médio de resolução', value: mttr === null ? '—' : formatarDuracao(mttr), hint: `${resolvidos.length} incidentes resolvidos` },
    { label: 'Total registrado', value: String(incidentes.length), hint: 'Todos os períodos' },
  ]

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return incidentes
      .filter(
        (i) =>
          (status === 'todos' || (status === 'abertos' ? i.status !== 'Resolvido' : i.status === status)) &&
          (severidade === 'todas' || i.severidade === severidade) &&
          (!q || `${i.id} ${i.titulo} ${i.projeto}`.toLowerCase().includes(q)),
      )
      .sort((a, b) => b.inicio.localeCompare(a.inicio))
  }, [incidentes, busca, status, severidade])

  return (
    <>
      <div className="page-head page-head--row">
        <div className="page-head__title">
          <span className="eyebrow">Sociiz · Desenvolvimento</span>
          <h1>Incidentes</h1>
        </div>
        <span className="badge badge--gray">Dados de exemplo</span>
        <Link to="/incidentes/novo" className="btn-pill btn-pill--accent btn-pill--link">Registrar incidente</Link>
      </div>

      <div className="kpis kpis--md">
        {kpis.map((k) => (
          <div className="kpi" key={k.label}>
            <span className="kpi__label">{k.label}</span>
            <span className="kpi__value">{k.value}</span>
            <span className="kpi__hint">{k.hint}</span>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <label htmlFor="busca-inc" className="sr-only">Buscar incidentes</label>
        <input id="busca-inc" className="search" type="search" placeholder="Buscar por título ou projeto" value={busca} onChange={(e) => setBusca(e.target.value)} />
        <div role="group" aria-label="Filtrar por status" className="toolbar__chips">
          {(['abertos', 'todos', ...statusFluxo] as const).map((s) => (
            <button key={s} type="button" className={`chip${status === s ? ' chip--on' : ''}`} aria-pressed={status === s} onClick={() => setStatus(s)}>
              {s === 'abertos' ? 'Em aberto' : s === 'todos' ? 'Todos' : s}
            </button>
          ))}
        </div>
        <span className="toolbar__grow" />
        <label className="select-label">
          <span>Severidade</span>
          <select className="select" value={severidade} onChange={(e) => setSeveridade(e.target.value as typeof severidade)}>
            <option value="todas">Todas</option>
            {severidades.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="table-wrap">
        <div role="table" aria-label="Incidentes" className="table table--inc">
          <div role="row" className="trow trow--inc trow--head">
            {['Incidente', 'Severidade', 'Status', 'Início', 'Duração', 'Responsável'].map((h) => (
              <span role="columnheader" key={h}>{h}</span>
            ))}
          </div>
          {lista.map((i) => (
            <Link role="row" to={`/incidentes/${i.id}`} className="trow trow--inc trow--link" key={i.id}>
              <span role="cell" className="app-cell__text">
                <span className="nome">{i.titulo}</span>
                <span className="muted small">{i.id} · {i.projeto}</span>
              </span>
              <span role="cell"><span className={`badge badge--${severidadeTom[i.severidade]}`}>{i.severidade}</span></span>
              <span role="cell"><span className={`badge badge--${statusTom[i.status]}`}>{i.status}</span></span>
              <span role="cell" className="muted">{formatarData(i.inicio)}</span>
              <span role="cell" className="muted">
                {i.resolvidoEm ? formatarDuracao(new Date(i.resolvidoEm).getTime() - new Date(i.inicio).getTime()) : 'Em andamento'}
              </span>
              <span role="cell" className="muted">{i.responsavel}</span>
            </Link>
          ))}
          {lista.length === 0 && <p className="empty">Nenhum incidente encontrado com esses filtros.</p>}
        </div>
      </div>
    </>
  )
}
