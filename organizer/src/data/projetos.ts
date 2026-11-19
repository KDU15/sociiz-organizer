export type Tipo = 'web' | 'mobile' | 'api' | 'servico' | 'sdk'
export type StatusProjeto = 'Em produção' | 'Em desenvolvimento' | 'Em manutenção' | 'Descontinuado'
export type Saude = 'ok' | 'warn' | 'off'
export type Tom = 'green' | 'blue' | 'orange' | 'purple' | 'seafoam' | 'gray'

export const tipoLabel: Record<Tipo, string> = {
  web: 'Web',
  mobile: 'Mobile',
  api: 'API',
  servico: 'Serviço',
  sdk: 'SDK',
}

export const statusTom: Record<StatusProjeto, Tom> = {
  'Em produção': 'green',
  'Em desenvolvimento': 'blue',
  'Em manutenção': 'orange',
  Descontinuado: 'gray',
}

export type Dependencia = { nome: string; uso: string; versao: string; saude: Saude }
export type Ambiente = {
  nome: string
  versao: string
  saude: Saude
  saudeLabel: string
  campos: { label: string; value: string }[]
}
export type Detalhe = {
  descricao: string
  links: { label: string; href: string }[]
  numeros: { label: string; value: string; hint: string }[]
  mapa: { nome: string; tipo: string; saude: Saude }[]
  nota?: string
  ficha: { label: string; value: string }[]
  ambientes: Ambiente[]
  deps: { grupo: string; itens: Dependencia[] }[]
  versoes: { versao: string; ambiente: string; tom: Tom; nota: string; data: string }[]
  docs: { nome: string; meta: string; tom: Tom }[]
}

export type Projeto = {
  id: string
  sigla: string
  nome: string
  stack: string
  tipo: Tipo
  status: StatusProjeto
  versao: string
  deploy: string
  responsavel: string
  criticidade: 'Alta' | 'Média' | 'Baixa'
  saude: Saude
  saudeLabel: string
  tile: Tom
  detalhe?: Detalhe
}

const controleAcesso: Detalhe = {
  descricao:
    'App usado nas portarias para liberar a entrada de pessoas por reconhecimento facial. O porteiro cadastra o visitante com foto, a prova de vida confirma que é uma pessoa real e o acesso fica registrado por unidade.',
  links: [
    { label: 'Repositório', href: '#' },
    { label: 'Google Play', href: '#' },
    { label: 'App Store', href: '#' },
    { label: 'Monitoramento', href: '#' },
    { label: 'Documentação', href: '#' },
  ],
  numeros: [
    { label: 'Versão em produção', value: '2.4.1', hint: 'Android e iOS' },
    { label: 'Último deploy', value: '12/11', hint: 'Há 7 dias' },
    { label: 'Incidentes abertos', value: '1', hint: 'Login facial no Android 14' },
    { label: 'Demandas abertas', value: '3', hint: 'No quadro de demandas' },
  ],
  mapa: [
    { nome: 'API de reconhecimento facial', tipo: 'API interna', saude: 'ok' },
    { nome: 'Servidor OIDC', tipo: 'API interna', saude: 'ok' },
    { nome: 'Amazon Rekognition Face Liveness', tipo: 'AWS', saude: 'warn' },
    { nome: 'Amazon S3', tipo: 'AWS', saude: 'ok' },
    { nome: 'Firebase Cloud Messaging', tipo: 'Externa', saude: 'ok' },
  ],
  nota: 'Se a API de reconhecimento facial ou o Face Liveness parar, o login facial deste app para junto.',
  ficha: [
    { label: 'Responsável', value: 'Mantenedor' },
    { label: 'Revisor técnico', value: 'Dev principal' },
    { label: 'Usuários', value: 'Porteiros e administradores das unidades' },
    { label: 'Stack', value: 'React Native, TypeScript' },
    { label: 'Autenticação', value: 'OIDC com login facial' },
    { label: 'Em produção desde', value: 'Março de 2025' },
    { label: 'Última revisão da ficha', value: '17/11 · revisão semanal' },
  ],
  ambientes: [
    {
      nome: 'Produção', versao: '2.4.1', saude: 'warn', saudeLabel: 'Degradado',
      campos: [
        { label: 'API', value: 'https://api.acesso.sociiz.example' },
        { label: 'Host', value: 'EC2 · acesso-prod-01' },
        { label: 'Região', value: 'sa-east-1 (São Paulo)' },
        { label: 'Segredos', value: 'secrets/acesso/prod' },
      ],
    },
    {
      nome: 'Homologação', versao: '2.5.0-rc.1', saude: 'ok', saudeLabel: 'Operando',
      campos: [
        { label: 'API', value: 'https://hml.api.acesso.sociiz.example' },
        { label: 'Host', value: 'EC2 · acesso-hml-01' },
        { label: 'Região', value: 'sa-east-1 (São Paulo)' },
        { label: 'Segredos', value: 'secrets/acesso/hml' },
      ],
    },
    {
      nome: 'Desenvolvimento', versao: 'main', saude: 'ok', saudeLabel: 'Operando',
      campos: [
        { label: 'API', value: 'https://dev.api.acesso.sociiz.example' },
        { label: 'Host', value: 'Container · dev-shared' },
        { label: 'Região', value: 'sa-east-1 (São Paulo)' },
        { label: 'Segredos', value: 'secrets/acesso/dev' },
      ],
    },
  ],
  deps: [
    {
      grupo: 'APIs internas',
      itens: [
        { nome: 'API de reconhecimento facial', uso: 'Comparação de rosto no login e no cadastro', versao: 'v1.9.0', saude: 'ok' },
        { nome: 'Servidor OIDC', uso: 'Login e emissão de tokens', versao: 'v2.1.0', saude: 'ok' },
      ],
    },
    {
      grupo: 'Serviços AWS',
      itens: [
        { nome: 'Amazon Rekognition Face Liveness', uso: 'Prova de vida no cadastro e no login', versao: 'sa-east-1', saude: 'warn' },
        { nome: 'Amazon S3', uso: 'Fotos de cadastro dos visitantes', versao: 'acesso-fotos-prod', saude: 'ok' },
        { nome: 'Amazon CloudWatch', uso: 'Logs e alarmes', versao: 'sa-east-1', saude: 'ok' },
      ],
    },
    {
      grupo: 'Serviços externos e SDKs',
      itens: [
        { nome: 'Firebase Cloud Messaging', uso: 'Notificações de acesso liberado', versao: 'FCM v1', saude: 'ok' },
        { nome: 'react-native-vision-camera', uso: 'Captura do rosto', versao: '4.6', saude: 'ok' },
        { nome: 'AWS Amplify UI · Liveness', uso: 'Tela de prova de vida', versao: '6.x', saude: 'ok' },
      ],
    },
  ],
  versoes: [
    { versao: '2.5.0-rc.1', ambiente: 'Homologação', tom: 'blue', nota: 'Vínculo de dispositivo por QR code', data: '17/11' },
    { versao: '2.4.1', ambiente: 'Produção', tom: 'green', nota: 'Correção na troca de token expirado', data: '12/11' },
    { versao: '2.4.0', ambiente: 'Produção', tom: 'green', nota: 'Histórico de acessos por unidade', data: '29/10' },
    { versao: '2.3.2', ambiente: 'Produção', tom: 'green', nota: 'Atualização do React Native', data: '14/10' },
    { versao: '2.3.1', ambiente: 'Produção', tom: 'green', nota: 'Ajuste de brilho na captura facial', data: '30/09' },
  ],
  docs: [
    { nome: 'README', meta: 'Como rodar, testar e publicar', tom: 'gray' },
    { nome: 'PRD · Vínculo de dispositivo', meta: 'Especificação funcional · PO/UX', tom: 'blue' },
    { nome: 'Decisão técnica · Liveness na AWS', meta: 'Registro de decisão · Dev principal', tom: 'purple' },
    { nome: 'Runbook de incidente', meta: 'O que fazer quando o login facial falha', tom: 'orange' },
    { nome: 'Relatório de disponibilidade · outubro', meta: 'Relatório mensal · Mantenedor', tom: 'green' },
    { nome: 'Mapa de integrações', meta: 'Fluxo entre app, API e AWS', tom: 'gray' },
  ],
}

export const projetos: Projeto[] = [
  { id: 'controle-de-acesso', sigla: 'CA', nome: 'Controle de acesso', stack: 'React Native · Android e iOS', tipo: 'mobile', status: 'Em produção', versao: '2.4.1', deploy: '12/11', responsavel: 'Mantenedor', criticidade: 'Alta', saude: 'warn', saudeLabel: 'Degradado', tile: 'blue', detalhe: controleAcesso },
  { id: 'api-reconhecimento-facial', sigla: 'RF', nome: 'API de reconhecimento facial', stack: 'Node.js · Rekognition', tipo: 'api', status: 'Em produção', versao: '1.9.0', deploy: '05/11', responsavel: 'Dev principal', criticidade: 'Alta', saude: 'ok', saudeLabel: 'Operando', tile: 'purple' },
  { id: 'motor-de-ocr', sigla: 'OC', nome: 'Motor de OCR', stack: 'Python · servidor próprio', tipo: 'servico', status: 'Em produção', versao: '3.2.0', deploy: '14/11', responsavel: 'Desenvolvedor', criticidade: 'Alta', saude: 'ok', saudeLabel: 'Operando', tile: 'seafoam' },
  { id: 'sdk-de-captura', sigla: 'SC', nome: 'SDK de captura', stack: 'Kotlin e Swift', tipo: 'sdk', status: 'Em produção', versao: '1.3.2', deploy: '30/10', responsavel: 'Desenvolvedor', criticidade: 'Média', saude: 'ok', saudeLabel: 'Operando', tile: 'seafoam' },
  { id: 'aplicacao-do-atendente', sigla: 'AT', nome: 'Aplicação do atendente', stack: 'Angular · web', tipo: 'web', status: 'Em produção', versao: '5.12.3', deploy: '18/11', responsavel: 'Desenvolvedor', criticidade: 'Alta', saude: 'ok', saudeLabel: 'Operando', tile: 'orange' },
  { id: 'servidor-oidc', sigla: 'ID', nome: 'Servidor OIDC', stack: 'EC2 · AWS', tipo: 'servico', status: 'Em produção', versao: '2.1.0', deploy: '20/10', responsavel: 'Mantenedor', criticidade: 'Alta', saude: 'ok', saudeLabel: 'Operando', tile: 'gray' },
  { id: 'app-de-ponto', sigla: 'AP', nome: 'App de ponto', stack: 'Ionic · Capacitor', tipo: 'mobile', status: 'Em manutenção', versao: '1.6.0', deploy: '08/11', responsavel: 'Mantenedor', criticidade: 'Média', saude: 'ok', saudeLabel: 'Operando', tile: 'green' },
  { id: 'terminais-de-atendimento', sigla: 'TA', nome: 'Terminais de atendimento', stack: 'Android · modo quiosque', tipo: 'mobile', status: 'Em desenvolvimento', versao: '0.8.0', deploy: '17/11', responsavel: 'Dev principal', criticidade: 'Alta', saude: 'off', saudeLabel: 'Sem produção', tile: 'blue' },
  { id: 'organizer', sigla: 'OR', nome: 'Organizer', stack: 'React · Spectrum 2', tipo: 'web', status: 'Em desenvolvimento', versao: '0.1.0', deploy: '19/11', responsavel: 'Dev principal', criticidade: 'Baixa', saude: 'off', saudeLabel: 'Sem produção', tile: 'gray' },
]

export const resumo = [
  { label: 'Aplicações', value: '9', hint: '6 em produção' },
  { label: 'Em desenvolvimento', value: '2', hint: 'Terminais e Organizer' },
  { label: 'Com alerta de saúde', value: '1', hint: 'Controle de acesso' },
  { label: 'Publicações no mês', value: '11', hint: 'Em todos os ambientes' },
]
