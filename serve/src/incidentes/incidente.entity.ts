export const severidades = ['Crítica', 'Alta', 'Média', 'Baixa'] as const
export type Severidade = (typeof severidades)[number]
export const statusFluxo = ['Aberto', 'Em investigação', 'Mitigado', 'Resolvido'] as const
export type StatusIncidente = (typeof statusFluxo)[number]

export interface Incidente {
  id: string
  titulo: string
  projeto: string
  severidade: Severidade
  status: StatusIncidente
  inicio: string
  resolvidoEm?: string
  responsavel?: string
  impacto: string
  descricao: string
  causaRaiz?: string
  acoes: { texto: string; feito: boolean }[]
  demanda?: string
  linhaDoTempo: { quando: string; texto: string }[]
}
