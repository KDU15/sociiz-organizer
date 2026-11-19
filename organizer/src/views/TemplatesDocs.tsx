'use client'

import { useEffect, useMemo, useState } from 'react'
import { categoriasRecurso, recursos, type CategoriaRecurso } from '../data/recursos'

const KEY = 'organizer:recursos:favoritos:v1'

function carregarFavoritos(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[]
  } catch {
    return []
  }
}

export default function TemplatesDocs() {
  const [busca, setBusca] = useState('')
  const [cat, setCat] = useState<'todos' | 'favoritos' | CategoriaRecurso>('todos')
  const [favoritos, setFavoritos] = useState<string[]>([])
  const [pronto, setPronto] = useState(false)

  useEffect(() => {
    setFavoritos(carregarFavoritos())
    setPronto(true)
  }, [])

  useEffect(() => {
    if (!pronto) return
    try {
      localStorage.setItem(KEY, JSON.stringify(favoritos))
    } catch {
      /* ignora */
    }
  }, [favoritos, pronto])

  const alternar = (id: string) => setFavoritos((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return recursos.filter(
      (r) =>
        (cat === 'todos' || (cat === 'favoritos' ? favoritos.includes(r.id) : r.categoria === cat)) &&
        (!q || `${r.titulo} ${r.descricao} ${r.tags.join(' ')} ${r.responsavel}`.toLowerCase().includes(q)),
    )
  }, [busca, cat, favoritos])

  const categorias = Object.keys(categoriasRecurso) as CategoriaRecurso[]
  const grupos = categorias.map((c) => ({ c, itens: lista.filter((r) => r.categoria === c) })).filter((g) => g.itens.length)

  return (
    <>
      <div className="page-head page-head--row">
        <div className="page-head__title">
          <span className="eyebrow">Sociiz · Desenvolvimento</span>
          <h1>Templates e docs</h1>
        </div>
        <span className="badge badge--gray">Dados de exemplo</span>
      </div>

      <div className="kpis kpis--md">
        {categorias.slice(0, 5).map((c) => (
          <button type="button" className="kpi kpi--btn" key={c} onClick={() => setCat(c)} aria-label={`Ver ${categoriasRecurso[c].label}`}>
            <span className="kpi__label">{categoriasRecurso[c].label}</span>
            <span className="kpi__value">{recursos.filter((r) => r.categoria === c).length}</span>
          </button>
        ))}
      </div>

      <div className="toolbar">
        <label htmlFor="busca-docs" className="sr-only">Buscar recursos</label>
        <input id="busca-docs" className="search" type="search" placeholder="Buscar por nome, tag ou responsável" value={busca} onChange={(e) => setBusca(e.target.value)} />
        <div role="group" aria-label="Filtrar por categoria" className="toolbar__chips">
          {(['todos', ...categorias, 'favoritos'] as const).map((c) => (
            <button key={c} type="button" className={`chip${cat === c ? ' chip--on' : ''}`} aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c === 'todos' ? 'Todos' : c === 'favoritos' ? `Favoritos (${favoritos.length})` : categoriasRecurso[c].label}
            </button>
          ))}
        </div>
      </div>

      {grupos.map(({ c, itens }) => {
        const info = categoriasRecurso[c]
        return (
          <section className="section" key={c} aria-labelledby={`g-${c}`}>
            <div className="section__head">
              <h2 id={`g-${c}`}>{info.label}</h2>
              <span className="count">{itens.length}</span>
            </div>
            <p className="small muted section__sub">{info.descricao}</p>
            <div className="cards cards--wide">
              {itens.map((r) => {
                const fav = favoritos.includes(r.id)
                return (
                  <article className="rcard" key={r.id}>
                    <div className="rcard__top">
                      <span aria-hidden="true" className={`tile tile--sm tile--${info.tom}`}>
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
                          <path d={info.icone} />
                        </svg>
                      </span>
                      <h3 className="rcard__title">{r.titulo}</h3>
                      <button
                        type="button"
                        className={`star${fav ? ' star--on' : ''}`}
                        aria-pressed={fav}
                        aria-label={fav ? `Remover ${r.titulo} dos favoritos` : `Favoritar ${r.titulo}`}
                        onClick={() => alternar(r.id)}
                      >
                        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                          <path d="M10 2.5l1.9 4.6 4.6.4-3.5 3 1.1 4.6L10 12.7 5.9 15.1 7 10.5 3.5 7.5l4.6-.4z" />
                        </svg>
                      </button>
                    </div>
                    <p className="rcard__text">{r.descricao}</p>
                    <div className="rcard__tags">
                      {r.tags.map((t) => (
                        <span className="badge badge--gray" key={t}>{t}</span>
                      ))}
                    </div>
                    <div className="rcard__foot">
                      <span className="small muted">{r.responsavel} · atualizado em {r.atualizado}</span>
                      <a className="lnk lnk--sm" href={r.href} aria-label={`Abrir ${r.titulo}`}>Abrir</a>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )
      })}
      {grupos.length === 0 && <p className="muted">Nenhum recurso encontrado com esses filtros.</p>}
    </>
  )
}
