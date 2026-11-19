export const estados = [
  'Entrada', 'Descoberta', 'Aguardando aprovação', 'Pronto para desenvolvimento', 'Em desenvolvimento',
  'Em revisão', 'Homologação', 'Concluído', 'Sustentação',
] as const
export type Estado = (typeof estados)[number]

export const categorias = ['novo', 'func', 'melh', 'corr', 'inc', 'fer', 'pesq'] as const
export type Categoria = (typeof categorias)[number]

export const urgencias = ['Baixa', 'Média', 'Alta', 'Crítica'] as const
export type Urgencia = (typeof urgencias)[number]

export interface Demanda {
  id: string
  titulo: string
  projeto: string
  categoria: Categoria
  estado: Estado
  urgencia: Urgencia
  descricao: string
  criterios: { texto: string; feito: boolean }[]
  responsavel?: string
  revisor?: string
  solicitante: string
  impacto?: string
  estimativa?: string
  previsao?: string
  historico: { estado: Estado; data: string }[]
  criadoEm: string
}
