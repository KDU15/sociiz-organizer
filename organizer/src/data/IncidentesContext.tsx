'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { incidentesIniciais, statusFluxo, type Incidente, type Severidade, type StatusIncidente } from './incidentes'

const KEY = 'organizer:incidentes:v1'

type Novo = { titulo: string; projeto: string; severidade: Severidade; descricao: string; impacto: string }

type Ctx = {
  incidentes: Incidente[]
  pronto: boolean
  criar: (n: Novo) => Incidente
  mudarStatus: (id: string, status: StatusIncidente) => void
  alternarAcao: (id: string, indice: number) => void
}

const IncidentesContext = createContext<Ctx | null>(null)

function carregar(): Incidente[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Incidente[]
  } catch {
    /* storage indisponível */
  }
  return incidentesIniciais
}

export function IncidentesProvider({ children }: { children: ReactNode }) {
  const [incidentes, setIncidentes] = useState<Incidente[]>(incidentesIniciais)
  const [pronto, setPronto] = useState(false)
  const ref = useRef(incidentes)
  ref.current = incidentes

  useEffect(() => {
    setIncidentes(carregar())
    setPronto(true)
  }, [])

  useEffect(() => {
    if (!pronto) return
    try {
      localStorage.setItem(KEY, JSON.stringify(incidentes))
    } catch {
      /* ignora */
    }
  }, [incidentes, pronto])

  const criar = useCallback<Ctx['criar']>((n) => {
    const proximo = Math.max(0, ...ref.current.map((i) => Number(i.id.replace('INC-', '')) || 0)) + 1
    const agora = new Date().toISOString()
    const novo: Incidente = {
      id: `INC-${String(proximo).padStart(3, '0')}`,
      titulo: n.titulo.trim(),
      projeto: n.projeto,
      severidade: n.severidade,
      status: 'Aberto',
      inicio: agora,
      responsavel: 'A definir',
      impacto: n.impacto.trim(),
      descricao: n.descricao.trim(),
      causaRaiz: 'Ainda não identificada.',
      acoes: [],
      linhaDoTempo: [{ quando: agora, texto: 'Incidente aberto por Carlos Eduardo.' }],
    }
    ref.current = [novo, ...ref.current]
    setIncidentes(ref.current)
    return novo
  }, [])

  const mudarStatus = useCallback<Ctx['mudarStatus']>((id, status) => {
    const agora = new Date().toISOString()
    setIncidentes((atual) =>
      atual.map((i) =>
        i.id === id && i.status !== status
          ? {
              ...i,
              status,
              resolvidoEm: status === 'Resolvido' ? agora : undefined,
              linhaDoTempo: [{ quando: agora, texto: `Status alterado para ${status.toLowerCase()} por Carlos Eduardo.` }, ...i.linhaDoTempo],
            }
          : i,
      ),
    )
  }, [])

  const alternarAcao = useCallback<Ctx['alternarAcao']>((id, k) => {
    setIncidentes((atual) =>
      atual.map((i) => (i.id === id ? { ...i, acoes: i.acoes.map((a, j) => (j === k ? { ...a, feito: !a.feito } : a)) } : i)),
    )
  }, [])

  const value = useMemo(() => ({ incidentes, pronto, criar, mudarStatus, alternarAcao }), [incidentes, pronto, criar, mudarStatus, alternarAcao])
  return <IncidentesContext.Provider value={value}>{children}</IncidentesContext.Provider>
}

export function useIncidentes() {
  const ctx = useContext(IncidentesContext)
  if (!ctx) throw new Error('useIncidentes fora do IncidentesProvider')
  return ctx
}

export function proximoStatus(s: StatusIncidente): StatusIncidente | null {
  const i = statusFluxo.indexOf(s)
  return i < 0 || i === statusFluxo.length - 1 ? null : statusFluxo[i + 1]
}

export const formatarData = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

export function formatarDuracao(ms: number) {
  const min = Math.max(0, Math.round(ms / 60000))
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h} h${min % 60 ? ` ${min % 60} min` : ''}`
  return `${Math.floor(h / 24)} d${h % 24 ? ` ${h % 24} h` : ''}`
}
