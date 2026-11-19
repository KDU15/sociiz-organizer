export type Severidade = 'Crítica' | 'Alta' | 'Média' | 'Baixa'
export type StatusIncidente = 'Aberto' | 'Em investigação' | 'Mitigado' | 'Resolvido'

export const severidades: Severidade[] = ['Crítica', 'Alta', 'Média', 'Baixa']
export const statusFluxo: StatusIncidente[] = ['Aberto', 'Em investigação', 'Mitigado', 'Resolvido']

export const severidadeTom: Record<Severidade, string> = { Crítica: 'red', Alta: 'orange', Média: 'blue', Baixa: 'gray' }
export const statusTom: Record<StatusIncidente, string> = {
  Aberto: 'red',
  'Em investigação': 'orange',
  Mitigado: 'blue',
  Resolvido: 'green',
}

export type EventoIncidente = { quando: string; texto: string }

export type Incidente = {
  id: string
  titulo: string
  projeto: string
  severidade: Severidade
  status: StatusIncidente
  inicio: string // ISO
  resolvidoEm?: string // ISO
  responsavel: string
  impacto: string
  descricao: string
  causaRaiz: string
  acoes: { texto: string; feito: boolean }[]
  demanda?: string
  linhaDoTempo: EventoIncidente[] // mais recente primeiro
}

export const incidentesIniciais: Incidente[] = [
  {
    id: 'INC-014',
    titulo: 'Erro 500 no login facial em Android 14',
    projeto: 'Controle de acesso',
    severidade: 'Crítica',
    status: 'Em investigação',
    inicio: '2026-11-18T08:40:00',
    responsavel: 'Mantenedor',
    impacto: 'Porteiros em dispositivos Android 14 não conseguem entrar com login facial.',
    descricao:
      'A partir da última atualização do Android, a prova de vida retorna erro 500 ao finalizar a sessão do Face Liveness. O login por senha segue funcionando.',
    causaRaiz: 'Em análise: suspeita de incompatibilidade do SDK de captura com a nova versão do sistema.',
    acoes: [
      { texto: 'Reproduzir o erro em um aparelho Android 14', feito: true },
      { texto: 'Liberar contorno com login por senha para as portarias afetadas', feito: true },
      { texto: 'Atualizar o SDK de liveness e publicar em homologação', feito: false },
      { texto: 'Publicar a correção em produção', feito: false },
    ],
    demanda: 'SOC-142',
    linhaDoTempo: [
      { quando: '2026-11-18T14:10:00', texto: 'Contorno liberado: portarias afetadas usam login por senha.' },
      { quando: '2026-11-18T09:05:00', texto: 'Mantenedor assumiu e iniciou a investigação.' },
      { quando: '2026-11-18T08:40:00', texto: 'Incidente aberto a partir de relato do atendimento.' },
    ],
  },
  {
    id: 'INC-013',
    titulo: 'Fila de OCR parada por falta de disco',
    projeto: 'Motor de OCR',
    severidade: 'Alta',
    status: 'Resolvido',
    inicio: '2026-11-10T16:20:00',
    resolvidoEm: '2026-11-10T19:05:00',
    responsavel: 'Desenvolvedor',
    impacto: 'Documentos enviados pelo atendimento ficaram sem tipificação por cerca de 3 horas.',
    descricao: 'O servidor do OCR esgotou o disco com arquivos temporários e parou de processar a fila.',
    causaRaiz: 'Rotina de limpeza de temporários desativada após a última atualização.',
    acoes: [
      { texto: 'Liberar espaço e reprocessar a fila', feito: true },
      { texto: 'Reativar a rotina de limpeza', feito: true },
      { texto: 'Criar alarme de uso de disco no CloudWatch', feito: true },
    ],
    linhaDoTempo: [
      { quando: '2026-11-10T19:05:00', texto: 'Fila reprocessada. Incidente resolvido.' },
      { quando: '2026-11-10T17:30:00', texto: 'Causa identificada e espaço liberado.' },
      { quando: '2026-11-10T16:20:00', texto: 'Incidente aberto pelo alerta de fila acima do limite.' },
    ],
  },
  {
    id: 'INC-012',
    titulo: 'Token expirando antes do prazo no atendente',
    projeto: 'Aplicação do atendente',
    severidade: 'Média',
    status: 'Mitigado',
    inicio: '2026-11-06T10:00:00',
    responsavel: 'Mantenedor',
    impacto: 'Atendentes precisam entrar de novo algumas vezes ao dia.',
    descricao: 'O servidor OIDC emite tokens com validade menor que a configurada para esse cliente.',
    causaRaiz: 'Validade padrão do servidor sobrescrevendo a configuração do cliente.',
    acoes: [
      { texto: 'Aumentar a validade manualmente como contorno', feito: true },
      { texto: 'Corrigir a leitura da configuração por cliente', feito: false },
    ],
    linhaDoTempo: [
      { quando: '2026-11-07T11:00:00', texto: 'Contorno aplicado. Falhas deixaram de ocorrer.' },
      { quando: '2026-11-06T10:00:00', texto: 'Incidente aberto.' },
    ],
  },
  {
    id: 'INC-011',
    titulo: 'Notificações de acesso liberado atrasadas',
    projeto: 'Controle de acesso',
    severidade: 'Baixa',
    status: 'Resolvido',
    inicio: '2026-10-28T09:15:00',
    resolvidoEm: '2026-10-28T10:00:00',
    responsavel: 'Dev principal',
    impacto: 'Notificações chegavam com até 10 minutos de atraso.',
    descricao: 'Instabilidade no Firebase Cloud Messaging.',
    causaRaiz: 'Instabilidade externa, sem falha do app.',
    acoes: [{ texto: 'Acompanhar o painel de status do provedor', feito: true }],
    linhaDoTempo: [
      { quando: '2026-10-28T10:00:00', texto: 'Provedor normalizou. Incidente resolvido.' },
      { quando: '2026-10-28T09:15:00', texto: 'Incidente aberto.' },
    ],
  },
]
