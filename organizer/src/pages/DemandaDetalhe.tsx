import { Link, Navigate, useParams } from 'react-router-dom'
import { categorias } from '../data/demandas'
import { proximoEstado, useDemandas } from '../data/DemandasContext'

const prioTom = { Baixa: 'gray', Média: 'gray', Alta: 'orange', Crítica: 'red' } as const

const icones = {
  doc: <path d="M5 3h6l4 4v10H5zM11 3v4h4" />,
  decisao: (
    <>
      <circle cx="5.5" cy="5" r="2" />
      <circle cx="5.5" cy="15" r="2" />
      <circle cx="14.5" cy="10" r="2" />
      <path d="M5.5 7v6M7.5 5.5c3.5 0 5.5 1.2 6.2 2.8" />
    </>
  ),
  pr: (
    <>
      <circle cx="6" cy="5" r="2" />
      <circle cx="6" cy="15" r="2" />
      <circle cx="14" cy="15" r="2" />
      <path d="M6 7v6M14 13V9a3 3 0 0 0-3-3H9" />
    </>
  ),
}

export default function DemandaDetalhe() {
  const { id } = useParams()
  const { demandas, mover, alternarCriterio } = useDemandas()
  const d = demandas.find((x) => x.id === id)
  if (!d) return <Navigate to="/quadro" replace />

  const cat = categorias[d.categoria]
  const prox = proximoEstado(d.estado)
  const feitos = d.criterios.filter((c) => c.feito).length
  const pct = d.criterios.length ? Math.round((feitos / d.criterios.length) * 100) : 0

  const detalhes = [
    ['Responsável', d.responsavel],
    ['Revisor', d.revisor],
    ['Solicitante', d.solicitante],
    ['Projeto', d.projeto],
    ['Categoria', cat.label],
    ['Estimativa', d.estimativa],
    ['Previsão de entrega', d.previsao],
    ['Ambiente', d.ambiente],
    ...(d.impacto ? [['Impacto', d.impacto]] : []),
  ]

  return (
    <>
      <nav aria-label="Trilha" className="crumbs">
        <Link to="/quadro">Quadro de demandas</Link>
        <span aria-hidden="true" className="crumbs__sep">/</span>
        <span className="muted">{d.id}</span>
      </nav>

      <div className="proj-head">
        <div className="proj-head__info">
          <h1>{d.titulo}</h1>
          <div className="proj-head__badges">
            <span className={`badge badge--${cat.tom}`}>{cat.label}</span>
            <span className="badge badge--gray">{d.estado}</span>
            <span className={`badge badge--${prioTom[d.urgencia]}`}>Prioridade {d.urgencia.toLowerCase()}</span>
            <span className="badge badge--gray">Dados de exemplo</span>
          </div>
        </div>
        <div className="proj-head__actions">
          <button type="button" className="btn-pill btn-pill--secondary">Editar</button>
          {prox && (
            <button type="button" className="btn-pill btn-pill--accent" onClick={() => mover(d.id, prox)}>
              Mover para {prox.toLowerCase()}
            </button>
          )}
        </div>
      </div>

      <div className="split">
        <div className="split__main">
          <section className="section">
            <h2>Descrição</h2>
            {d.descricao ? <p className="lead">{d.descricao}</p> : <p className="muted">Sem descrição cadastrada.</p>}
          </section>

          <section className="section">
            <div className="section__head">
              <h2>Critérios de aceite</h2>
              {d.criterios.length > 0 && <span className="small muted">{feitos} de {d.criterios.length}</span>}
            </div>
            {d.criterios.length > 0 ? (
              <>
                <div
                  role="progressbar"
                  aria-label="Critérios atendidos"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="progress"
                >
                  <div style={{ width: `${pct}%` }} />
                </div>
                {d.criterios.map((c, i) => (
                  <label className="check" key={c.texto}>
                    <input type="checkbox" checked={c.feito} onChange={() => alternarCriterio(d.id, i)} />
                    <span>{c.texto}</span>
                  </label>
                ))}
              </>
            ) : (
              <p className="muted">Os critérios são definidos na descoberta.</p>
            )}
          </section>

          {d.vinculados.length > 0 && (
            <section className="section">
              <h2>Vinculados</h2>
              <div className="stack stack--sm">
                {d.vinculados.map((v) => (
                  <a className="doc" href="#" key={v.nome}>
                    <span aria-hidden="true" className={`tile tile--sm tile--${v.tom}`}>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
                        {icones[v.tipo]}
                      </svg>
                    </span>
                    <span className="item__text">
                      <span className="item__title">{v.nome}</span>
                      <span className="small muted">{v.meta}</span>
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}

          <section className="section">
            <h2>Histórico de estados</h2>
            <ol className="timeline">
              {d.historico.map((h, i) => (
                <li key={`${h.estado}-${i}`}>
                  <div className="timeline__rail">
                    <span aria-hidden="true" className={`timeline__dot${i === 0 ? ' timeline__dot--now' : ''}`} />
                    <span aria-hidden="true" className="timeline__line" />
                  </div>
                  <div className="timeline__body">
                    <strong>{h.estado}</strong>
                    <span className="small muted">{h.meta}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="ficha ficha--wide">
          <h2 className="eyebrow">Detalhes</h2>
          {detalhes.map(([label, value]) => (
            <div className="ficha__row" key={label}>
              <span className="small muted">{label}</span>
              <span className="medium">{value}</span>
            </div>
          ))}
          <div className="ficha__sep" />
          <div className="ficha__pair">
            <div className="ficha__row">
              <span className="small muted">Lead time até agora</span>
              <span className="ficha__big">{d.leadTime ?? '—'}</span>
            </div>
            <div className="ficha__row">
              <span className="small muted">Cycle time</span>
              <span className="ficha__big">{d.cycleTime ?? '—'}</span>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
