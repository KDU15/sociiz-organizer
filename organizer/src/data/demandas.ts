export type Categoria = 'novo' | 'func' | 'melh' | 'corr' | 'inc' | 'fer' | 'pesq'
export type Urgencia = 'Baixa' | 'Média' | 'Alta' | 'Crítica'

export const estados = [
  'Entrada',
  'Descoberta',
  'Aguardando aprovação',
  'Pronto para desenvolvimento',
  'Em desenvolvimento',
  'Em revisão',
  'Homologação',
  'Concluído',
  'Sustentação',
] as const
export type Estado = (typeof estados)[number]

/** Etapas contadas como "em andamento" nos indicadores. */
export const emAndamento: Estado[] = ['Descoberta', 'Aguardando aprovação', 'Pronto para desenvolvimento', 'Em desenvolvimento', 'Em revisão', 'Homologação']

export const categorias: Record<Categoria, { label: string; tom: string; ajuda: string }> = {
  novo: { label: 'Projeto novo', tom: 'purple', ajuda: 'Construção de uma nova aplicação ou produto.' },
  func: { label: 'Funcionalidade', tom: 'blue', ajuda: 'Uma capacidade nova em um produto que já existe.' },
  melh: { label: 'Melhoria', tom: 'green', ajuda: 'Evolução de algo que já funciona.' },
  corr: { label: 'Correção', tom: 'orange', ajuda: 'Problema identificado que não para a operação.' },
  inc: { label: 'Incidente', tom: 'red', ajuda: 'Problema que está afetando a operação agora.' },
  fer: { label: 'Ferramenta interna', tom: 'gray', ajuda: 'Solução para melhorar processos da equipe.' },
  pesq: { label: 'Pesquisa técnica', tom: 'seafoam', ajuda: 'Investigar uma tecnologia ou possibilidade.' },
}

export const urgencias: Urgencia[] = ['Baixa', 'Média', 'Alta', 'Crítica']
export const impactos = ['Poucos usuários', 'Um setor inteiro', 'Toda a operação', 'Clientes externos']
export const projetosDemanda = ['App de ponto', 'Controle de acesso', 'OCR de documentos', 'Terminais de atendimento', 'Infraestrutura', 'Ferramentas internas', 'Projeto novo']

export type Vinculado = { nome: string; meta: string; tom: string; tipo: 'doc' | 'decisao' | 'pr' }
export type Evento = { estado: Estado; meta: string }

export type Demanda = {
  id: string
  titulo: string
  projeto: string
  categoria: Categoria
  iniciais: string
  papel: string
  estado: Estado
  urgencia: Urgencia
  descricao: string
  criterios: { texto: string; feito: boolean }[]
  vinculados: Vinculado[]
  historico: Evento[] // mais recente primeiro
  responsavel: string
  revisor: string
  solicitante: string
  impacto?: string
  estimativa: string
  previsao: string
  ambiente: string
  leadTime?: string
  cycleTime?: string
}

type Seed = [id: string, titulo: string, projeto: string, cat: Categoria, ini: string, papel: string, estado: Estado]

const seeds: Seed[] = [
  ['SOC-142', 'Erro 500 no login facial em Android 14', 'Controle de acesso', 'inc', 'MT', 'Mantenedor', 'Entrada'],
  ['SOC-141', 'Exportar relatório de ponto em PDF', 'App de ponto', 'func', 'PO', 'PO/UX', 'Entrada'],
  ['SOC-139', 'Avaliar SDK de leitura de CNH digital', 'OCR de documentos', 'pesq', 'DP', 'Dev principal', 'Entrada'],
  ['SOC-136', 'Vínculo de dispositivo por QR code', 'Controle de acesso', 'func', 'PO', 'PO/UX', 'Descoberta'],
  ['SOC-133', 'Modo quiosque nos terminais do balcão', 'Terminais de atendimento', 'novo', 'PO', 'PO/UX', 'Descoberta'],
  ['SOC-130', 'Organizer: MVP do quadro e indicadores', 'Ferramentas internas', 'fer', 'DP', 'Dev principal', 'Aguardando aprovação'],
  ['SOC-128', 'Rotação de chaves do servidor OIDC', 'Infraestrutura', 'melh', 'MT', 'Mantenedor', 'Pronto para desenvolvimento'],
  ['SOC-127', 'Templates de PRD e checklist de publicação', 'Ferramentas internas', 'fer', 'PO', 'PO/UX', 'Pronto para desenvolvimento'],
  ['SOC-124', 'Tipificação de frente e verso em PDF único', 'OCR de documentos', 'func', 'DV', 'Desenvolvedor', 'Em desenvolvimento'],
  ['SOC-122', 'Fuso horário incorreto nas batidas', 'App de ponto', 'corr', 'MT', 'Mantenedor', 'Em desenvolvimento'],
  ['SOC-120', 'Captura facial acionada pelo atendente', 'Terminais de atendimento', 'func', 'DP', 'Dev principal', 'Em desenvolvimento'],
  ['SOC-118', 'Atualizar Capacitor e plugins nativos', 'App de ponto', 'melh', 'DV', 'Desenvolvedor', 'Em revisão'],
  ['SOC-115', 'Histórico de acessos por unidade', 'Controle de acesso', 'func', 'PO', 'PO/UX', 'Homologação'],
  ['SOC-111', 'Alertas de erro da API de OCR', 'Ferramentas internas', 'fer', 'MT', 'Mantenedor', 'Concluído'],
  ['SOC-108', 'Token expirando no app do atendente', 'Terminais de atendimento', 'corr', 'MT', 'Mantenedor', 'Sustentação'],
]

const base = (s: Seed): Demanda => ({
  id: s[0],
  titulo: s[1],
  projeto: s[2],
  categoria: s[3],
  iniciais: s[4],
  papel: s[5],
  estado: s[6],
  urgencia: s[3] === 'inc' ? 'Crítica' : 'Média',
  descricao: '',
  criterios: [],
  vinculados: [],
  historico: [{ estado: s[6], meta: 'Dados de exemplo' }],
  responsavel: s[5],
  revisor: 'Dev principal',
  solicitante: '—',
  estimativa: '—',
  previsao: '—',
  ambiente: '—',
})

export const demandasIniciais: Demanda[] = seeds.map((s) => {
  const d = base(s)
  if (d.id !== 'SOC-124') return d
  return {
    ...d,
    urgencia: 'Alta',
    descricao:
      'Hoje o atendente envia frente e verso do documento como dois arquivos e o motor de OCR tipifica cada um separadamente. A demanda é aceitar um PDF único com as duas faces, identificar cada página e devolver uma tipificação só, com os campos das duas faces combinados.',
    criterios: [
      ['Aceita PDF de até 2 páginas com frente e verso do mesmo documento', true],
      ['Identifica qual página é frente e qual é verso, em qualquer ordem', true],
      ['Devolve uma tipificação única com os campos das duas faces', true],
      ['Rejeita com mensagem clara PDF com documentos diferentes', false],
      ['Tempo de resposta igual ou menor que o envio de duas imagens', false],
    ].map(([texto, feito]) => ({ texto: texto as string, feito: feito as boolean })),
    vinculados: [
      { nome: 'PRD · Tipificação frente e verso', meta: 'Especificação funcional · PO/UX', tom: 'blue', tipo: 'doc' },
      { nome: 'Decisão técnica · Separar páginas no servidor', meta: 'Registro de decisão · Dev principal', tom: 'gray', tipo: 'decisao' },
      { nome: 'Pull request · ocr-engine', meta: 'Aberto · aguardando revisão', tom: 'green', tipo: 'pr' },
    ],
    historico: [
      { estado: 'Em desenvolvimento', meta: '10/11 · iniciado pelo Desenvolvedor' },
      { estado: 'Pronto para desenvolvimento', meta: '07/11 · aprovado pelo Dev principal, estimativa de 5 pontos' },
      { estado: 'Descoberta', meta: '04/11 · PRD e critérios de aceite pelo PO/UX' },
      { estado: 'Entrada', meta: '03/11 · triagem do Dev principal, solicitada pelo atendimento' },
    ],
    responsavel: 'Desenvolvedor',
    solicitante: 'Equipe de atendimento',
    estimativa: '5 pontos',
    previsao: '21/11',
    ambiente: 'Homologação após revisão',
    leadTime: '13 dias',
    cycleTime: '6 dias',
  }
})
