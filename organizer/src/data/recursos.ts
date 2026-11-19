export type CategoriaRecurso = 'skills' | 'padroes' | 'templates' | 'storybooks' | 'design' | 'guias'

export const categoriasRecurso: Record<CategoriaRecurso, { label: string; descricao: string; tom: string; icone: string }> = {
  skills: { label: 'Skills de desenvolvimento', descricao: 'Práticas e instruções reaproveitáveis para o dia a dia da equipe.', tom: 'purple', icone: 'M10 2.5l1.9 4.6 4.6.4-3.5 3 1.1 4.6L10 12.7 5.9 15.1 7 10.5 3.5 7.5l4.6-.4z' },
  padroes: { label: 'Padrões de projeto', descricao: 'Arquitetura, estrutura de pastas e convenções adotadas.', tom: 'blue', icone: 'M3 4h5v5H3zM12 4h5v5h-5zM7.5 14h5v3h-5zM5.5 9v2.5h9V9M10 11.5V14' },
  templates: { label: 'Templates', descricao: 'Modelos prontos de documentos, repositórios e checklists.', tom: 'green', icone: 'M5 3h6l4 4v10H5zM11 3v4h4M7.5 11h5M7.5 14h5' },
  storybooks: { label: 'Storybooks', descricao: 'Catálogos de componentes publicados por projeto.', tom: 'orange', icone: 'M4 3.5h9a2 2 0 0 1 2 2V17H6a2 2 0 0 1-2-2zM4 15a2 2 0 0 1 2-2h9' },
  design: { label: 'Design systems', descricao: 'Tokens, componentes e diretrizes visuais.', tom: 'seafoam', icone: 'M10 3a7 7 0 1 0 0 14c1.2 0 1.7-.9 1.4-1.9-.3-1 .4-1.8 1.4-1.8H14a3 3 0 0 0 3-3A7 7 0 0 0 10 3zM6.5 9.5v.01M9 6.5v.01M12.5 7v.01' },
  guias: { label: 'Guias e runbooks', descricao: 'Procedimentos operacionais e passo a passo de suporte.', tom: 'gray', icone: 'M4 5h12M4 10h12M4 15h8' },
}

export type Recurso = {
  id: string
  categoria: CategoriaRecurso
  titulo: string
  descricao: string
  tags: string[]
  responsavel: string
  atualizado: string
  href: string
}

export const recursos: Recurso[] = [
  { id: 'sk-1', categoria: 'skills', titulo: 'Revisão de código', descricao: 'Checklist e critérios para revisar pull requests: correção, testes, legibilidade e riscos de segurança.', tags: ['Qualidade', 'PR'], responsavel: 'Dev principal', atualizado: '12/11', href: '#' },
  { id: 'sk-2', categoria: 'skills', titulo: 'Escrita de PRD', descricao: 'Como transformar um pedido em especificação: problema, escopo, critérios de aceite e métricas.', tags: ['Produto', 'Descoberta'], responsavel: 'PO/UX', atualizado: '05/11', href: '#' },
  { id: 'sk-3', categoria: 'skills', titulo: 'Publicação segura', descricao: 'Passos para publicar em homologação e produção, com verificação e plano de reversão.', tags: ['Deploy', 'AWS'], responsavel: 'Mantenedor', atualizado: '29/10', href: '#' },
  { id: 'sk-4', categoria: 'skills', titulo: 'Investigação de incidentes', descricao: 'Roteiro para reproduzir, mitigar e registrar a causa raiz de um incidente.', tags: ['Incidentes', 'Suporte'], responsavel: 'Mantenedor', atualizado: '18/11', href: '#' },
  { id: 'pd-1', categoria: 'padroes', titulo: 'Estrutura de apps React', descricao: 'Organização de pastas, rotas, estado e dados de exemplo adotada no Organizer.', tags: ['React', 'TypeScript'], responsavel: 'Dev principal', atualizado: '19/11', href: '#' },
  { id: 'pd-2', categoria: 'padroes', titulo: 'Apps React Native', descricao: 'Camadas, navegação, autenticação com OIDC e tratamento de erros nos apps mobile.', tags: ['Mobile', 'OIDC'], responsavel: 'Mantenedor', atualizado: '21/10', href: '#' },
  { id: 'pd-3', categoria: 'padroes', titulo: 'APIs Node.js', descricao: 'Padrão de rotas, validação, logs e versionamento das APIs internas.', tags: ['API', 'Node.js'], responsavel: 'Dev principal', atualizado: '02/10', href: '#' },
  { id: 'tp-1', categoria: 'templates', titulo: 'PRD', descricao: 'Modelo de especificação funcional preenchido na descoberta.', tags: ['Documento', 'Produto'], responsavel: 'PO/UX', atualizado: '07/11', href: '#' },
  { id: 'tp-2', categoria: 'templates', titulo: 'Registro de decisão técnica', descricao: 'Contexto, alternativas, decisão e consequências, no formato ADR.', tags: ['Documento', 'ADR'], responsavel: 'Dev principal', atualizado: '30/10', href: '#' },
  { id: 'tp-3', categoria: 'templates', titulo: 'Checklist de publicação', descricao: 'Verificações antes e depois de cada deploy.', tags: ['Checklist', 'Deploy'], responsavel: 'Mantenedor', atualizado: '14/11', href: '#' },
  { id: 'tp-4', categoria: 'templates', titulo: 'Repositório base React + Vite', descricao: 'Projeto inicial com TypeScript, rotas, lint e pipeline de CI.', tags: ['Repositório', 'React'], responsavel: 'Desenvolvedor', atualizado: '03/11', href: '#' },
  { id: 'sb-1', categoria: 'storybooks', titulo: 'Storybook · Aplicação do atendente', descricao: 'Componentes Angular com estados, variações e testes de interação.', tags: ['Angular', 'Web'], responsavel: 'Desenvolvedor', atualizado: '18/11', href: '#' },
  { id: 'sb-2', categoria: 'storybooks', titulo: 'Storybook · Organizer', descricao: 'Componentes do Organizer: selos, cartões, tabelas, formulários e abas.', tags: ['React', 'Spectrum'], responsavel: 'Dev principal', atualizado: '19/11', href: '#' },
  { id: 'ds-1', categoria: 'design', titulo: 'Spectrum 2', descricao: 'Sistema de design base do Organizer: tokens de cor, tipografia, espaçamento e componentes.', tags: ['Adobe', 'Tokens'], responsavel: 'PO/UX', atualizado: '15/11', href: '#' },
  { id: 'ds-2', categoria: 'design', titulo: 'Tokens da Sociiz', descricao: 'Cores da marca, logotipos e regras de uso aplicadas aos produtos.', tags: ['Marca', 'Tokens'], responsavel: 'PO/UX', atualizado: '01/11', href: '#' },
  { id: 'gd-1', categoria: 'guias', titulo: 'Runbook · Login facial falhando', descricao: 'O que verificar quando a prova de vida ou a comparação de rosto não responde.', tags: ['Controle de acesso', 'AWS'], responsavel: 'Mantenedor', atualizado: '18/11', href: '#' },
  { id: 'gd-2', categoria: 'guias', titulo: 'Rotação de chaves do OIDC', descricao: 'Passo a passo para trocar chaves de assinatura sem derrubar os clientes.', tags: ['OIDC', 'Segurança'], responsavel: 'Mantenedor', atualizado: '20/10', href: '#' },
]
