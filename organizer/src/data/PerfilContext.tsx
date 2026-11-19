import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const KEY = 'organizer:perfil:v1'

export type Perfil = {
  nome: string
  cargo: string
  email: string
  notificacoes: { incidentes: boolean; demandas: boolean; publicacoes: boolean }
}

const padrao: Perfil = {
  nome: 'Carlos Eduardo',
  cargo: 'Dev principal',
  email: 'nome@sociiz.com.br',
  notificacoes: { incidentes: true, demandas: true, publicacoes: false },
}

type Ctx = { perfil: Perfil; salvar: (p: Perfil) => void; iniciais: string }
const PerfilContext = createContext<Ctx | null>(null)

function carregar(): Perfil {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const p = JSON.parse(raw) as Partial<Perfil>
      return { ...padrao, ...p, notificacoes: { ...padrao.notificacoes, ...p.notificacoes } }
    }
  } catch {
    /* storage indisponível */
  }
  return padrao
}

export const iniciaisDe = (nome: string) =>
  nome
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || '?'

export function PerfilProvider({ children }: { children: ReactNode }) {
  const [perfil, setPerfil] = useState<Perfil>(carregar)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(perfil))
    } catch {
      /* ignora */
    }
  }, [perfil])

  const salvar = useCallback((p: Perfil) => setPerfil(p), [])
  const value = useMemo(() => ({ perfil, salvar, iniciais: iniciaisDe(perfil.nome) }), [perfil, salvar])
  return <PerfilContext.Provider value={value}>{children}</PerfilContext.Provider>
}

export function usePerfil() {
  const ctx = useContext(PerfilContext)
  if (!ctx) throw new Error('usePerfil fora do PerfilProvider')
  return ctx
}
