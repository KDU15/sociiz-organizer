'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { categorias, estados, urgencias, type Categoria, type Estado, type Urgencia } from '../data/demandas'
import { proximoEstado, useDemandas } from '../data/DemandasContext'

/** Etapas anteriores à execução: ainda é backlog. */
const etapasBacklog: Estado[] = estados.slice(0, 4)
const peso: Record<Urgencia, number> = { Crítica: 0, Alta: 1, Média: 2, Baixa: 3 }

export default function Backlog() {
  const { demandas, mover, definirUrgencia } = useDemandas()
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState<'todas' | Categoria>('todas')
  const [etapa, setEtapa] = useState<'todas' | Estado>('todas')
  const [urgencia, setUrgencia] = useState<'todas' | Urgencia>('todas')

  const backlog = useMemo(() => demandas.filter((d) => etapasBacklog.includes(d.estado)), [demandas])

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return backlog
      .filter(
        (d) =>
          (categoria === 'todas' || d.categoria === categoria) &&
          (etapa === 'todas' || d.estado === etapa) &&
          (urgencia === 'todas' || d.urgencia === urgencia) &&
          (!q || `${d.id} ${d.titulo} ${d.projeto} ${d.solicitante}`.toLowerCase().includes(q)),
      )
      .sort((a, b) => peso[a.urgencia] - peso[b.urgencia] || etapasBacklog.indexOf(b.estado) - etapasBacklog.indexOf(a.estado))
  }, [backlog, busca, categoria, etapa, urgencia])

  const kpis = [
    { label: 'Itens no backlog', value: String(backlog.length), hint: 'Da entrada à aprovação' },
    { label: 'Prontos para desenvolver', value: String(backlog.filter((d) => d.estado === 'Pronto para desenvolvimento').length), hint: 'Podem entrar no quadro' },
    { label: 'Urgentes', value: String(backlog.filter((d) => d.urgencia === 'Alta' || d.urgencia === 'Crítica').length), hint: 'Urgência alta ou crítica' },
    { label: 'Sem estimativa', value: String(backlog.filter((d) => d.estimativa === '—').length), hint: 'Definida na descoberta' },
  ]

  return (
    <>
      <div className="page-head page-head--row">
        <div className="page-head__title">
          <span className="eyebrow">Sociiz · Desenvolvimento</span>
          <h1>Backlog</h1>
        </div>
        <span className="badge badge--gray">Dados de exemplo</span>
        <Link href="/quadro/nova" className="btn-pill btn-pill--accent btn-pill--link">Nova demanda</Link>
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
        <label htmlFor="busca-backlog" className="sr-only">Buscar no backlog</label>
        <input
          id="busca-backlog"
          className="search"
          type="search"
          placeholder="Buscar por título, projeto ou solicitante"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div role="group" aria-label="Filtrar por urgência" className="toolbar__chips">
          {(['todas', ...urgencias] as const).map((u) => (
            <button
              key={u}
              type="button"
              className={`chip${urgencia === u ? ' chip--on' : ''}`}
              aria-pressed={urgencia === u}
              onClick={() => setUrgencia(u)}
            >
              {u === 'todas' ? 'Todas' : u}
            </button>
          ))}
        </div>
        <span className="toolbar__grow" />
        <label className="select-label">
          <span>Categoria</span>
          <select className="select" value={categoria} onChange={(e) => setCategoria(e.target.value as typeof categoria)}>
            <option value="todas">Todas</option>
            {(Object.keys(categorias) as Categoria[]).map((c) => (
              <option key={c} value={c}>{categorias[c].label}</option>
            ))}
          </select>
        </label>
        <label className="select-label">
          <span>Etapa</span>
          <select className="select" value={etapa} onChange={(e) => setEtapa(e.target.value as typeof etapa)}>
            <option value="todas">Todas</option>
            {etapasBacklog.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="small muted backlog__note">
        Ordenado por urgência. Ao avançar uma demanda de "Pronto para desenvolvimento", ela passa a aparecer só no quadro.
      </p>

      <div className="table-wrap">
        <div role="table" aria-label="Backlog" className="table table--backlog">
          <div role="row" className="trow trow--backlog trow--head">
            {['Demanda', 'Categoria', 'Etapa', 'Urgência', 'Estimativa', 'Solicitante', ''].map((h, i) => (
              <span role="columnheader" key={h || i} className={h ? '' : 'sr-only'}>{h || 'Ações'}</span>
            ))}
          </div>
          {lista.map((d) => {
            const cat = categorias[d.categoria]
            const prox = proximoEstado(d.estado)
            return (
              <div role="row" className="trow trow--backlog" key={d.id}>
                <span role="cell" className="app-cell__text">
                  <Link href={`/quadro/${d.id}`} className="nome nome--link">{d.titulo}</Link>
                  <span className="muted small">{d.id} · {d.projeto}</span>
                </span>
                <span role="cell"><span className={`badge badge--${cat.tom}`}>{cat.label}</span></span>
                <span role="cell">{d.estado}</span>
                <span role="cell">
                  <label>
                    <span className="sr-only">Urgência de {d.id}</span>
                    <select
                      className={`select select--sm select--${d.urgencia === 'Crítica' ? 'red' : d.urgencia === 'Alta' ? 'orange' : 'plain'}`}
                      value={d.urgencia}
                      onChange={(e) => definirUrgencia(d.id, e.target.value as Urgencia)}
                    >
                      {urgencias.map((u) => (
                        <option key={u}>{u}</option>
                      ))}
                    </select>
                  </label>
                </span>
                <span role="cell" className="muted">{d.estimativa}</span>
                <span role="cell" className="muted">{d.solicitante}</span>
                <span role="cell" className="right">
                  {prox && (
                    <button type="button" className="btn-pill btn-pill--secondary btn-pill--sm" onClick={() => mover(d.id, prox)}>
                      Avançar
                    </button>
                  )}
                </span>
              </div>
            )
          })}
          {lista.length === 0 && <p className="empty">Nenhuma demanda no backlog com esses filtros.</p>}
        </div>
      </div>
    </>
  )
}
