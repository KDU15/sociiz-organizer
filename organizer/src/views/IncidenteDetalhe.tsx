'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import Redirecionar from '../components/Redirecionar'
import { severidadeTom, statusFluxo, statusTom } from '../data/incidentes'
import { formatarData, formatarDuracao, proximoStatus, useIncidentes } from '../data/IncidentesContext'

export default function IncidenteDetalhe() {
  const { id } = useParams<{ id: string }>()
  const { incidentes, mudarStatus, alternarAcao, pronto } = useIncidentes()
  const i = incidentes.find((x) => x.id === id)
  if (!pronto) return null
  if (!i) return <Redirecionar para="/incidentes" />

  const prox = proximoStatus(i.status)
  const fim = i.resolvidoEm ? new Date(i.resolvidoEm).getTime() : Date.now()
  const feitas = i.acoes.filter((a) => a.feito).length
  const etapa = statusFluxo.indexOf(i.status)

  const detalhes = [
    ['Projeto', i.projeto],
    ['Responsável', i.responsavel],
    ['Início', formatarData(i.inicio)],
    ['Resolvido em', i.resolvidoEm ? formatarData(i.resolvidoEm) : '—'],
    ['Duração', formatarDuracao(fim - new Date(i.inicio).getTime()) + (i.resolvidoEm ? '' : ' até agora')],
  ]

  return (
    <>
      <nav aria-label="Trilha" className="crumbs">
        <Link href="/incidentes">Incidentes</Link>
        <span aria-hidden="true" className="crumbs__sep">/</span>
        <span className="muted">{i.id}</span>
      </nav>

      <div className="proj-head">
        <div className="proj-head__info">
          <h1>{i.titulo}</h1>
          <div className="proj-head__badges">
            <span className={`badge badge--${severidadeTom[i.severidade]}`}>Severidade {i.severidade.toLowerCase()}</span>
            <span className={`badge badge--${statusTom[i.status]}`}>{i.status}</span>
            <span className="badge badge--gray">{i.projeto}</span>
            <span className="badge badge--gray">Dados de exemplo</span>
          </div>
        </div>
        <div className="proj-head__actions">
          {prox && (
            <button type="button" className="btn-pill btn-pill--accent" onClick={() => mudarStatus(i.id, prox)}>
              Marcar como {prox.toLowerCase()}
            </button>
          )}
          {i.status === 'Resolvido' && (
            <button type="button" className="btn-pill btn-pill--secondary" onClick={() => mudarStatus(i.id, 'Em investigação')}>
              Reabrir
            </button>
          )}
        </div>
      </div>

      <ol className="steps" aria-label="Andamento do incidente">
        {statusFluxo.map((s, k) => (
          <li key={s} className={k <= etapa ? 'steps__on' : ''} aria-current={k === etapa ? 'step' : undefined}>
            <span aria-hidden="true" className="steps__bar" />
            <span className="small">{s}</span>
          </li>
        ))}
      </ol>

      <div className="split">
        <div className="split__main">
          <section className="section">
            <h2>O que aconteceu</h2>
            <p className="lead">{i.descricao}</p>
          </section>
          <section className="section">
            <h2>Impacto</h2>
            <p className="lead">{i.impacto || 'Não informado.'}</p>
          </section>
          <section className="section">
            <h2>Causa raiz</h2>
            <p className="lead">{i.causaRaiz}</p>
          </section>

          <section className="section">
            <div className="section__head">
              <h2>Ações corretivas</h2>
              {i.acoes.length > 0 && <span className="small muted">{feitas} de {i.acoes.length}</span>}
            </div>
            {i.acoes.length === 0 && <p className="muted">Nenhuma ação registrada.</p>}
            {i.acoes.map((a, k) => (
              <label className="check" key={a.texto}>
                <input type="checkbox" checked={a.feito} onChange={() => alternarAcao(i.id, k)} />
                <span>{a.texto}</span>
              </label>
            ))}
          </section>

          <section className="section">
            <h2>Linha do tempo</h2>
            <ol className="timeline">
              {i.linhaDoTempo.map((e, k) => (
                <li key={e.quando + k}>
                  <div className="timeline__rail">
                    <span aria-hidden="true" className={`timeline__dot${k === 0 ? ' timeline__dot--now' : ''}`} />
                    <span aria-hidden="true" className="timeline__line" />
                  </div>
                  <div className="timeline__body">
                    <strong>{e.texto}</strong>
                    <span className="small muted">{formatarData(e.quando)}</span>
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
          {i.demanda && (
            <div className="ficha__row">
              <span className="small muted">Demanda vinculada</span>
              <Link href={`/quadro/${i.demanda}`} className="medium">{i.demanda}</Link>
            </div>
          )}
        </aside>
      </div>
    </>
  )
}
