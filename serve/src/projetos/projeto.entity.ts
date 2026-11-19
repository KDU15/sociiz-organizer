export type Tipo = 'web' | 'mobile' | 'api' | 'servico' | 'sdk'
export type StatusProjeto = 'Em produção' | 'Em desenvolvimento' | 'Em manutenção' | 'Descontinuado'
export type Saude = 'ok' | 'warn' | 'off'

export interface Projeto {
  id: string
  nome: string
  sigla: string
  stack: string
  tipo: Tipo
  status: StatusProjeto
  versao: string
  responsavel: string
  criticidade: 'Alta' | 'Média' | 'Baixa'
  saude: Saude
}
