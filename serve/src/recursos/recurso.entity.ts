export type CategoriaRecurso = 'skills' | 'padroes' | 'templates' | 'storybooks' | 'design' | 'guias'

export interface Recurso {
  id: string
  categoria: CategoriaRecurso
  titulo: string
  descricao: string
  tags: string[]
  responsavel: string
  atualizado: string
  href: string
}
