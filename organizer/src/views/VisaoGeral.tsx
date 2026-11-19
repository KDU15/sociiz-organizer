'use client'

import Link from 'next/link'
import { categorias, emAndamento, estados } from '../data/demandas'
import { useDemandas } from '../data/DemandasContext'
import { useIncidentes, formatarData } from '../data/IncidentesContext'
import { severidadeTom, statusTom as incStatusTom } from '../data/incidentes'
import { projetos, statusTom as projStatusTom } from '../data/projetos'
import { usePerfil } from '../data/PerfilContext'

export default function VisaoGeral() {
  const { demandas } = useDemandas()
  const { incidentes } = useIncidentes()
  const { perfil } = usePerfil()

  const abertas = demandas.filter((d) => d.estado !== 'Concluído' && d.estado !== 'Sustentação')
  const andamento = demandas.filter((d) => emAndamento.includes(d.estado))
  const criticas = abertas.filter((d) => d.urgencia === 'Crítica' || d.urgencia === 'Alta')
  const incAbertos = incidentes.filter((i) => i.status !== 'Resolvido')
  const degradados = projetos.filter((p) => p.saude !== 'ok')

  const kpis = [
    { label: 'Demandas abertas', value: abertas.length, hint: `${andamento.length} em andamento`, href: '/quadro' },
    { label: 'Urgência alta ou crítica', value: criticas.length, hint: 'Entre as demandas abertas', href: '/quadro' },
    { label: 'Incidentes abertos', value: incAbertos.length, hint: `${incAbertos.filter((i) => i.severidade === 'Crítica').length} críticos`, href: '/incidentes' },
    { label: 'Projetos com atenção', value: degradados.length, hint: `de ${projetos.length} aplicações`, href: '/projetos' },
  ]

  const minhas = abertas.filter((d) => d.responsavel === perfil.nome || d.responsavel === perfil.cargo).slice(0, 5)
  const porEtapa = estados.map((e) => ({ estado: e, total: demandas.filter((d) => d.estado === e).length }))
  const maxEtapa = Math.max(1, ...porEtapa.map((e) => e.total))
  const recentes = [...incidentes].sort((a, b) => b.inicio.localeCompare(a.inicio)).slice(0, 4)

  return (
    <>
      <div className="page-head page-head--row">
        <div className="page-head__title">
          <span className="eyebrow">Sociiz · Desenvolvimento</span>
          <h1>Visão geral</h1>
        </div>
        <span className="badge badge--gray">Dados de exemplo</span>
        <Link href="/incidentes/novo" className="btn-pill btn-pill--secondary btn-pill--link">Registrar incidente</Link>
        <Link href="/quadro/nova" className="btn-pill btn-pill--accent btn-pill--link">Nova demanda</Link>
      </div>

      <div className="kpis kpis--md">
        {kpis.map((k) => (
          <Link href={k.href} className="kpi" key={k.label} style={{ textDecoration: 'none' }}>
            <span className="kpi__label">{k.label}</span>
            <span className="kpi__value">{k.value}</span>
            <span className="kpi__hint">{k.hint}</span>
          </Link>
        ))}
      </div>

      <div className="vg-grid">
        <section className="card" aria-labelledby="vg-fluxo">
          <div className="card__head"><h2 id="vg-fluxo">Demandas por etapa</h2></div>
          <ul className="vg-list">
            {porEtapa.map((e) => (
              <li key={e.estado} className="vg-bar">
                <span className="small">{e.estado}</span>
                <span className="vg-bar__track"><span className="vg-bar__fill" style={{ width: `${(e.total / maxEtapa) * 100}%` }} /></span>
                <span className="small">{e.total}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card" aria-labelledby="vg-minhas">
          <div className="card__head"><h2 id="vg-minhas">Minhas demandas</h2></div>
          {minhas.length === 0 ? (
            <p className="empty">Nada atribuído a você no momento.</p>
          ) : (
            <ul className="vg-list">
              {minhas.map((d) => (
                <li key={d.id}>
                  <Link href={`/quadro/${d.id}`} className="vg-row">
                    <span className="vg-row__text">
                      <span className="nome">{d.titulo}</span>
                      <span className="muted small">{d.id} · {d.estado}</span>
                    </span>
                    <span className={`badge badge--${categorias[d.categoria].tom}`}>{categorias[d.categoria].label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card" aria-labelledby="vg-inc">
          <div className="card__head"><h2 id="vg-inc">Incidentes recentes</h2></div>
          <ul className="vg-list">
            {recentes.map((i) => (
              <li key={i.id}>
                <Link href={`/incidentes/${i.id}`} className="vg-row">
                  <span className="vg-row__text">
                    <span className="nome">{i.titulo}</span>
                    <span className="muted small">{i.id} · {i.projeto} · {formatarData(i.inicio)}</span>
                  </span>
                  <span className={`badge badge--${severidadeTom[i.severidade]}`}>{i.severidade}</span>
                  <span className={`badge badge--${incStatusTom[i.status]}`}>{i.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="card" aria-labelledby="vg-proj">
          <div className="card__head"><h2 id="vg-proj">Projetos</h2></div>
          <ul className="vg-list">
            {projetos.slice(0, 6).map((p) => (
              <li key={p.id}>
                <Link href={`/projetos/${p.id}`} className="vg-row">
                  <span aria-hidden="true" className={`tile tile--${p.tile}`}>{p.sigla}</span>
                  <span className="vg-row__text">
                    <span className="nome">{p.nome}</span>
                    <span className="muted small">v{p.versao} · deploy {p.deploy}</span>
                  </span>
                  <span className={`badge badge--${projStatusTom[p.status]}`}>{p.status}</span>
                  <span className="health"><span aria-hidden="true" className={`dot dot--${p.saude}`} />{p.saudeLabel}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
