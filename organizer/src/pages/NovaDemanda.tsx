import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { categorias, impactos, projetosDemanda, urgencias, type Categoria, type Urgencia } from '../data/demandas'
import { useDemandas } from '../data/DemandasContext'

export default function NovaDemanda() {
  const navigate = useNavigate()
  const { criar } = useDemandas()
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState<Categoria>('func')
  const [projeto, setProjeto] = useState('')
  const [solicitante, setSolicitante] = useState('')
  const [descricao, setDescricao] = useState('')
  const [urgencia, setUrgencia] = useState<Urgencia>('Média')
  const [impacto, setImpacto] = useState(impactos[0])
  const [erro, setErro] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!titulo.trim()) return setErro('Informe um título para a demanda.')
    if (!projeto) return setErro('Selecione o produto ou projeto.')
    const d = criar({ titulo, categoria, projeto, solicitante, descricao, urgencia, impacto })
    navigate(`/quadro/${d.id}`)
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <nav aria-label="Trilha" className="crumbs">
        <Link to="/quadro">Quadro de demandas</Link>
        <span aria-hidden="true" className="crumbs__sep">/</span>
        <span className="muted">Nova demanda</span>
      </nav>
      <div className="page-head">
        <h1>Nova demanda</h1>
        <p className="muted form__lead">Descreva o problema ou a necessidade. A especificação vem depois, na descoberta.</p>
      </div>

      <div className="notice">
        <svg role="img" aria-label="Informação" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="rgb(75,117,255)" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="10" cy="10" r="7.5" />
          <path d="M10 9v5M10 6.25v.01" />
        </svg>
        <span>
          A demanda entra na etapa <strong>Entrada</strong> e passa pela triagem do Dev principal, que define a prioridade e se ela segue para descoberta ou direto para execução.
        </span>
      </div>

      <label className="field">
        <span className="label">Título</span>
        <input
          className="input input--sm"
          placeholder="Ex.: Exportar relatório de ponto em PDF"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          aria-invalid={erro.includes('título')}
        />
        <span className="help">Comece pelo resultado esperado, em poucas palavras.</span>
      </label>

      <div role="radiogroup" aria-label="Categoria" className="field field--gap">
        <span className="label">Categoria</span>
        <div className="toolbar__chips">
          {(Object.keys(categorias) as Categoria[]).map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={categoria === c}
              className={`opt${categoria === c ? ' opt--on' : ''}`}
              onClick={() => setCategoria(c)}
            >
              {categorias[c].label}
            </button>
          ))}
        </div>
        <span className="help">{categorias[categoria].ajuda}</span>
      </div>

      <div className="form__grid">
        <label className="field">
          <span className="label">Produto ou projeto</span>
          <select className="input input--sm" value={projeto} onChange={(e) => setProjeto(e.target.value)}>
            <option value="">Selecione</option>
            {projetosDemanda.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="label">Solicitante</span>
          <input className="input input--sm" placeholder="Pessoa ou setor que pediu" value={solicitante} onChange={(e) => setSolicitante(e.target.value)} />
        </label>
      </div>

      <label className="field">
        <span className="label">Descrição</span>
        <textarea
          className="input input--sm input--area"
          rows={5}
          placeholder="O que está acontecendo, quem é afetado e o que deveria acontecer"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </label>

      <div className="form__grid">
        <div role="radiogroup" aria-label="Urgência" className="field field--gap">
          <span className="label">Urgência</span>
          <div className="toolbar__chips toolbar__chips--tight">
            {urgencias.map((u) => (
              <button
                key={u}
                type="button"
                role="radio"
                aria-checked={urgencia === u}
                className={`opt${urgencia === u ? ' opt--on' : ''}`}
                onClick={() => setUrgencia(u)}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
        <label className="field">
          <span className="label">Impacto</span>
          <select className="input input--sm" value={impacto} onChange={(e) => setImpacto(e.target.value)}>
            {impactos.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="field field--gap">
        <span className="label">Anexos</span>
        <label className="drop">
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13V4M6.5 7.5 10 4l3.5 3.5M4 16h12" />
          </svg>
          <span><strong>Arraste arquivos</strong> ou clique para escolher</span>
          <span className="small">Prints, logs ou documentos de referência</span>
          <input type="file" multiple className="sr-only" />
        </label>
      </div>

      {erro && <p role="alert" className="form__error">{erro}</p>}

      <div className="form__actions">
        <Link to="/quadro" className="btn-pill btn-pill--secondary btn-pill--link">Cancelar</Link>
        <button type="submit" className="btn-pill btn-pill--accent">Criar demanda</button>
      </div>
    </form>
  )
}
