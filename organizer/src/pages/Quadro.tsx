import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { categorias, emAndamento, estados, type Categoria } from '../data/demandas'
import { useDemandas } from '../data/DemandasContext'

const dot: Record<string, string> = {
  purple: 'var(--purple-visual-color)',
  blue: 'var(--informative-visual-color)',
  green: 'var(--positive-visual-color)',
  orange: 'var(--notice-visual-color)',
  red: 'var(--negative-visual-color)',
  gray: 'var(--gray-600)',
  seafoam: 'var(--gray-600)',
}

export default function Quadro() {
  const { demandas } = useDemandas()
  const [filtro, setFiltro] = useState<'todas' | Categoria>('todas')
  const [busca, setBusca] = useState('')

  const visiveis = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return demandas.filter(
      (d) =>
        (filtro === 'todas' || d.categoria === filtro) &&
        (!q || `${d.id} ${d.titulo} ${d.projeto}`.toLowerCase().includes(q)),
    )
  }, [demandas, filtro, busca])

  const kpis = [
    { label: 'Lead time médio', value: '6,2 dias', hint: 'Da entrada à entrega' },
    { label: 'Cycle time médio', value: '3,1 dias', hint: 'Em desenvolvimento até concluído' },
    { label: 'Em andamento', value: String(demandas.filter((d) => emAndamento.includes(d.estado)).length), hint: 'Descoberta até homologação' },
    {
      label: 'Incidentes abertos',
      value: String(demandas.filter((d) => d.categoria === 'inc' && d.estado !== 'Concluído' && d.estado !== 'Sustentação').length),
      hint: 'Prioridade crítica',
    },
  ]

  return (
    <>
      <div className="toolbar">
        <label htmlFor="busca-quadro" className="sr-only">Buscar</label>
        <input
          id="busca-quadro"
          className="search search--wide"
          type="search"
          placeholder="Buscar demandas e projetos"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <span className="toolbar__grow" />
        <button type="button" className="btn-pill btn-pill--secondary">Planejamento semanal</button>
        <Link to="/quadro/nova" className="btn-pill btn-pill--accent btn-pill--link">Nova demanda</Link>
      </div>

      <div className="page-head page-head--row">
        <div className="page-head__title">
          <span className="eyebrow">Sociiz · Desenvolvimento</span>
          <h1>Quadro de demandas</h1>
        </div>
        <span className="badge badge--gray">Dados de exemplo</span>
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

      <div role="group" aria-label="Filtrar por categoria" className="toolbar__chips">
        {(['todas', ...Object.keys(categorias)] as ('todas' | Categoria)[]).map((c) => (
          <button
            key={c}
            type="button"
            className={`chip${filtro === c ? ' chip--on' : ''}`}
            aria-pressed={filtro === c}
            onClick={() => setFiltro(c)}
          >
            {c === 'todas' ? 'Todas' : categorias[c].label}
          </button>
        ))}
      </div>

      <div className="board">
        <div className="board__cols">
          {estados.map((estado) => {
            const cards = visiveis.filter((d) => d.estado === estado)
            return (
              <section className="column" key={estado} aria-label={estado}>
                <header className="column__head">
                  <h2>{estado}</h2>
                  <span className="count">{cards.length}</span>
                </header>
                {cards.map((d) => {
                  const cat = categorias[d.categoria]
                  return (
                    <Link to={`/quadro/${d.id}`} className="dcard" key={d.id}>
                      <span className="dcard__title">{d.titulo}</span>
                      <span className="small muted">{d.projeto}</span>
                      <div className="dcard__foot">
                        <span className={`badge badge--${cat.tom}`}>
                          <span aria-hidden="true" className="dot" style={{ background: dot[cat.tom] }} />
                          {cat.label}
                        </span>
                        <span className="toolbar__grow" />
                        <span className="small muted">{d.id}</span>
                        <span className="avatar-sm" title={d.papel}>{d.iniciais}</span>
                      </div>
                    </Link>
                  )
                })}
                {cards.length === 0 && <p className="column__empty">Nenhuma demanda nesta etapa.</p>}
              </section>
            )
          })}
        </div>
      </div>
    </>
  )
}
