import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { demandasIniciais, estados, type Categoria, type Demanda, type Estado, type Urgencia } from './demandas'

const KEY = 'organizer:demandas:v1'

type NovaDemanda = {
  titulo: string
  categoria: Categoria
  projeto: string
  solicitante: string
  descricao: string
  urgencia: Urgencia
  impacto: string
}

type Ctx = {
  demandas: Demanda[]
  criar: (d: NovaDemanda) => Demanda
  mover: (id: string, para: Estado) => void
  alternarCriterio: (id: string, indice: number) => void
  definirUrgencia: (id: string, urgencia: Urgencia) => void
}

const DemandasContext = createContext<Ctx | null>(null)

function carregar(): Demanda[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Demanda[]
  } catch {
    /* storage indisponível: usa os dados de exemplo */
  }
  return demandasIniciais
}

const hoje = () => new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

export function DemandasProvider({ children }: { children: ReactNode }) {
  const [demandas, setDemandas] = useState<Demanda[]>(carregar)

  const ref = useRef(demandas)
  ref.current = demandas

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(demandas))
    } catch {
      /* ignora */
    }
  }, [demandas])

  const criar = useCallback<Ctx['criar']>((n) => {
    const proximo = Math.max(0, ...ref.current.map((d) => Number(d.id.replace('SOC-', '')) || 0)) + 1
    const criada: Demanda = {
      id: `SOC-${proximo}`,
      titulo: n.titulo.trim(),
      projeto: n.projeto,
      categoria: n.categoria,
      iniciais: 'CE',
      papel: 'Carlos Eduardo',
      estado: 'Entrada',
      urgencia: n.urgencia,
      descricao: n.descricao.trim(),
      criterios: [],
      vinculados: [],
      historico: [{ estado: 'Entrada', meta: `${hoje()} · criada por Carlos Eduardo` }],
      responsavel: 'A definir',
      revisor: 'Dev principal',
      solicitante: n.solicitante.trim() || '—',
      impacto: n.impacto,
      estimativa: '—',
      previsao: '—',
      ambiente: '—',
    }
    ref.current = [criada, ...ref.current]
    setDemandas(ref.current)
    return criada
  }, [])

  const mover = useCallback<Ctx['mover']>((id, para) => {
    setDemandas((atual) =>
      atual.map((d) =>
        d.id === id && d.estado !== para
          ? { ...d, estado: para, historico: [{ estado: para, meta: `${hoje()} · movida por Carlos Eduardo` }, ...d.historico] }
          : d,
      ),
    )
  }, [])

  const alternarCriterio = useCallback<Ctx['alternarCriterio']>((id, i) => {
    setDemandas((atual) =>
      atual.map((d) =>
        d.id === id ? { ...d, criterios: d.criterios.map((c, j) => (j === i ? { ...c, feito: !c.feito } : c)) } : d,
      ),
    )
  }, [])

  const definirUrgencia = useCallback<Ctx['definirUrgencia']>((id, urgencia) => {
    setDemandas((atual) => atual.map((d) => (d.id === id ? { ...d, urgencia } : d)))
  }, [])

  const value = useMemo(
    () => ({ demandas, criar, mover, alternarCriterio, definirUrgencia }),
    [demandas, criar, mover, alternarCriterio, definirUrgencia],
  )
  return <DemandasContext.Provider value={value}>{children}</DemandasContext.Provider>
}

export function useDemandas() {
  const ctx = useContext(DemandasContext)
  if (!ctx) throw new Error('useDemandas fora do DemandasProvider')
  return ctx
}

export function proximoEstado(e: Estado): Estado | null {
  const i = estados.indexOf(e)
  return e === 'Concluído' || i < 0 || i === estados.length - 1 ? null : estados[i + 1]
}
