import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { projetos, statusTom, tipoLabel } from '../data/projetos'

const abas = [
  ['geral', 'Visão geral'],
  ['ambientes', 'Ambientes e hosts'],
  ['deps', 'Dependências'],
  ['versoes', 'Versões'],
  ['docs', 'Documentos'],
] as const
type Aba = (typeof abas)[number][0]

export default function ProjetoDetalhe() {
  const { id } = useParams()
  const [aba, setAba] = useState<Aba>('geral')
  const p = projetos.find((x) => x.id === id)
  if (!p) return <Navigate to="/projetos" replace />
  const d = p.detalhe

  const ficha = d?.ficha ?? [
    { label: 'Responsável', value: p.responsavel },
    { label: 'Stack', value: p.stack },
    { label: 'Criticidade', value: p.criticidade },
  ]

  return (
    <>
      <nav aria-label="Trilha" className="crumbs">
        <Link to="/projetos">Projetos</Link>
        <span aria-hidden="true" className="crumbs__sep">/</span>
        <span className="muted">{p.nome}</span>
      </nav>

      <div className="proj-head">
        <span aria-hidden="true" className={`tile tile--lg tile--${p.tile}`}>{p.sigla}</span>
        <div className="proj-head__info">
          <h1>{p.nome}</h1>
          <div className="proj-head__badges">
            <span className="badge badge--gray">{tipoLabel[p.tipo]} · {p.stack.split(' · ')[0]}</span>
            <span className={`badge badge--${statusTom[p.status]}`}>{p.status}</span>
            <span className="badge badge--gray">Criticidade {p.criticidade.toLowerCase()}</span>
            <span className={`badge badge--${p.saude === 'warn' ? 'orange' : 'gray'}`}>
              <span aria-hidden="true" className={`dot dot--${p.saude}`} />{p.saudeLabel}
            </span>
            <span className="badge badge--gray">Dados de exemplo</span>
          </div>
        </div>
        <div className="proj-head__actions">
          <button type="button" className="btn-pill btn-pill--secondary">Editar ficha</button>
          <button type="button" className="btn-pill btn-pill--accent">Nova demanda</button>
        </div>
      </div>

      {d && (
        <div className="links">
          {d.links.map((l) => (
            <a className="lnk" href={l.href} key={l.label}>{l.label}</a>
          ))}
        </div>
      )}

      <div role="tablist" aria-label="Seções da ficha" className="tabs">
        {abas.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`tab-${key}`}
            aria-selected={aba === key}
            aria-controls="painel"
            className={`tab${aba === key ? ' tab--on' : ''}`}
            onClick={() => setAba(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div id="painel" role="tabpanel" aria-labelledby={`tab-${aba}`}>
        {aba === 'geral' && (
          <div className="split">
            <div className="split__main">
              {d && <p className="lead">{d.descricao}</p>}
              {d && (
                <div className="kpis kpis--sm">
                  {d.numeros.map((k) => (
                    <div className="kpi kpi--sm" key={k.label}>
                      <span className="kpi__hint">{k.label}</span>
                      <span className="kpi__value kpi__value--sm">{k.value}</span>
                      <span className="kpi__hint">{k.hint}</span>
                    </div>
                  ))}
                </div>
              )}
              {d && (
                <section className="section">
                  <h2>Mapa de dependências</h2>
                  <div className="depmap">
                    <div className={`depmap__root tile--${p.tile}`}>
                      <strong>{p.nome}</strong>
                      <span className="small muted">{tipoLabel[p.tipo]} · {p.versao}</span>
                    </div>
                    <div aria-hidden="true" className="depmap__line" />
                    <div className="depmap__list">
                      {d.mapa.map((m) => (
                        <div className="depmap__item" key={m.nome}>
                          <span aria-hidden="true" className={`dot dot--${m.saude}`} />
                          <span className="medium">{m.nome}</span>
                          <span className="toolbar__grow" />
                          <span className="small muted">{m.tipo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {d.nota && <p className="small muted">{d.nota}</p>}
                </section>
              )}
              {!d && <p className="muted">A ficha completa desta aplicação ainda não foi preenchida.</p>}
            </div>
            <aside className="ficha">
              <h2 className="eyebrow">Ficha</h2>
              {ficha.map((f) => (
                <div className="ficha__row" key={f.label}>
                  <span className="small muted">{f.label}</span>
                  <span className="medium">{f.value}</span>
                </div>
              ))}
            </aside>
          </div>
        )}

        {aba === 'ambientes' &&
          (d ? (
            <div className="stack">
              {d.ambientes.map((e) => (
                <section className="card" key={e.nome}>
                  <div className="card__head">
                    <h2>{e.nome}</h2>
                    <span className="badge badge--gray">Versão {e.versao}</span>
                    <span className="toolbar__grow" />
                    <span className="health"><span aria-hidden="true" className={`dot dot--${e.saude}`} />{e.saudeLabel}</span>
                  </div>
                  <div className="fields">
                    {e.campos.map((c) => (
                      <div className="field-ro" key={c.label}>
                        <span className="small muted">{c.label}</span>
                        <span className="code wrap">{c.value}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
              <p className="small muted">Credenciais não ficam aqui: cada ambiente aponta para o segredo no AWS Secrets Manager.</p>
            </div>
          ) : (
            <Vazio />
          ))}

        {aba === 'deps' &&
          (d ? (
            <div className="stack stack--lg">
              {d.deps.map((g) => (
                <section className="section" key={g.grupo}>
                  <h2>{g.grupo}</h2>
                  <div className="cards">
                    {g.itens.map((i) => (
                      <div className="item" key={i.nome}>
                        <span aria-hidden="true" className={`dot dot--${i.saude}`} />
                        <span className="item__text">
                          <span className="item__title">{i.nome}</span>
                          <span className="small muted">{i.uso}</span>
                        </span>
                        <span className="code muted">{i.versao}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <Vazio />
          ))}

        {aba === 'versoes' &&
          (d ? (
            <ol className="versions">
              {d.versoes.map((v) => (
                <li key={v.versao}>
                  <span className="code medium">{v.versao}</span>
                  <span><span className={`badge badge--${v.tom}`}>{v.ambiente}</span></span>
                  <span>{v.nota}</span>
                  <span className="muted right">{v.data}</span>
                </li>
              ))}
            </ol>
          ) : (
            <Vazio />
          ))}

        {aba === 'docs' &&
          (d ? (
            <div className="cards">
              {d.docs.map((x) => (
                <a className="item item--link" href="#" key={x.nome}>
                  <span aria-hidden="true" className={`tile tile--sm tile--${x.tom}`}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
                      <path d="M5 3h6l4 4v10H5z" />
                      <path d="M11 3v4h4" />
                    </svg>
                  </span>
                  <span className="item__text">
                    <span className="item__title">{x.nome}</span>
                    <span className="small muted">{x.meta}</span>
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <Vazio />
          ))}
      </div>
    </>
  )
}

function Vazio() {
  return <p className="muted">Nada cadastrado nesta seção ainda.</p>
}
