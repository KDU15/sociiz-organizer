# Atualizações

Registro das alterações feitas no projeto, da mais recente para a mais antiga.

## 2026-11-19 · Servidor NestJS com Postgres e Prisma

Alterações ainda não commitadas. Nova pasta `serve/`, ao lado de `organizer/`.

- API em **NestJS 11** com prefixo `/api`, validação global (`class-validator`), CORS configurável e `.env` (`PORT`, `CORS_ORIGIN`, `DATABASE_URL`).
- Módulos: health, demandas, incidentes, projetos, recursos e perfil. Rotas listadas em `projeto.md` e em `serve/README.md`.
- Persistência em **PostgreSQL 16** (`docker-compose.yml`) com **Prisma 6** (versão estável; a 8 ainda é release candidate). Schema com `Usuario`, `Projeto`, `Demanda`, `DemandaEvento`, `Incidente`, `IncidenteEvento` e `Recurso`; migration `init` aplicada.
- Seed (`prisma/seed.ts`) importa os dados de exemplo do front: 9 projetos, 17 recursos, 15 demandas e 4 incidentes.
- Versão inicial usava armazenamento em memória; foi trocada pelo `PrismaService` na mesma sessão.
- Conferido contra um Postgres real: listagem e ficha de demanda (critérios e histórico), criar, mover e apagar demanda, resolver incidente (preenche `resolvidoEm` e a linha do tempo), filtro de recursos, projetos sem e com `detalhe`, perfil e validação de campos inválidos.
- Limites: o front ainda não usa a API; o perfil usa um usuário fixo; `projeto` em demanda e incidente é texto, sem chave estrangeira.

## 2026-11-19 · Visão geral

Alterações ainda não commitadas.

- A rota `/visao-geral` deixou de ser placeholder (`views/VisaoGeral.tsx`): cartões de resumo clicáveis (demandas abertas, urgência alta ou crítica, incidentes abertos, projetos com atenção), demandas por etapa em barras, minhas demandas, incidentes recentes, lista de projetos e atalhos para nova demanda e novo incidente.
- Estilos novos no fim de `globals.css` (`.vg-*`).
- Conferido: `tsc` sem erros e a página responde 200 com os blocos no HTML. Não olhei a tela no navegador.
- "Minhas demandas" compara o responsável com o nome ou o cargo do perfil, então pode aparecer vazio nos dados de exemplo.

## 2026-11-19 · Side menu: remoção de Publicações e Decisões técnicas

Alterações ainda não commitadas.

- Os itens "Publicações" e "Decisões técnicas" saíram do side menu (`components/navItems.tsx`).
- As rotas `/publicacoes` e `/decisoes-tecnicas` continuam existindo como placeholder.

## 2026-11-19 · Migração para Next.js

Commit separado, a partir do commit `080f343`.

- A aplicação saiu de React 18 + Vite + React Router e foi migrada para **Next.js 16 (App Router) com React 19**.
- Rotas: `App.tsx` foi substituído por pastas em `src/app` (`(app)` agrupa as rotas com side menu; `login` fica fora). As telas de `src/pages` foram movidas para `src/views`, com `'use client'`, e cada rota tem um `page.tsx` que as renderiza. Dinâmicas: `/quadro/[id]`, `/projetos/[id]`, `/incidentes/[id]`.
- `Link`, `useNavigate` e `useParams` passaram para `next/link` e `next/navigation`; o destaque do menu usa `usePathname`; o antigo `<Navigate>` virou `components/Redirecionar.tsx`.
- Logo e marca foram para `public/`; as fontes são carregadas no `layout.tsx`; `/` e rotas inexistentes levam ao login.
- Os contextos (demandas, incidentes, perfil) e os favoritos agora leem o `localStorage` depois de montar e expõem `pronto`, evitando divergência de hidratação; as fichas aguardam esse sinal antes de redirecionar.
- Removidos: Vite, React Router, `index.html`, `vite.config.ts` e `tsconfig.tsbuildinfo`. Adicionados: `next.config.ts`, alias `@/*`, `.gitignore` com `.next`.
- Conferido: `next build` sem erros, todas as rotas respondendo e o quadro e a ficha da demanda renderizando no navegador sem erros no console. Não percorri todas as telas.

## 2026-11-19 · Correção: side menu acompanhando a altura da página

- O side menu esticava junto com o conteúdo e, em páginas longas, o avatar ia parar no fim da página. Agora ele é fixo (`position: sticky`) com a altura da janela e permanece visível enquanto o conteúdo rola (`styles.css`).

## 2026-11-19 · Menu do perfil e configurações

Alterações ainda não commitadas.

- Clicar no avatar do side menu abre um popup (`components/ProfileMenu.tsx`) com nome, cargo, "Configurações do perfil" e "Sair". Fecha ao clicar fora, com Esc ou ao navegar; aceita setas do teclado e devolve o foco ao avatar. O tooltip do avatar some enquanto o popup está aberto.
- "Sair" leva para `/login`. Ainda não há sessão real, então nada é encerrado além da navegação.
- Nova tela `/perfil` (`pages/Perfil.tsx`): nome, cargo, e-mail (validado) e três chaves de notificação (incidentes, demandas e publicações), com salvar e descartar. Prévia do avatar com as iniciais atualizadas.
- Estado em `data/PerfilContext.tsx` (`localStorage`, chave `organizer:perfil:v1`); o nome, o cargo e as iniciais do menu vêm dele. As preferências de notificação são salvas, mas ainda não enviam nada.
- Rota `/perfil` em `App.tsx`; `AppLayout` ganhou o `PerfilProvider`. Estilos novos em `styles.css`.

## 2026-11-19 · Incidentes e Templates e docs

Alterações ainda não commitadas. O design não tem telas para essas áreas; os layouts reaproveitam os padrões já existentes.

### Incidentes
- Lista em `/incidentes` (`pages/Incidentes.tsx`): indicadores (abertos, críticos, tempo médio de resolução, total), busca, chips de status (em aberto por padrão), filtro de severidade e tabela com duração.
- Ficha em `/incidentes/:id` (`pages/IncidenteDetalhe.tsx`): andamento em 4 etapas (Aberto, Em investigação, Mitigado, Resolvido), descrição, impacto, causa raiz, ações corretivas marcáveis, linha do tempo e detalhes. O botão principal avança o status e registra na linha do tempo; incidentes resolvidos podem ser reabertos. Link para a demanda vinculada.
- Registro em `/incidentes/novo` (`pages/NovoIncidente.tsx`): título, projeto, severidade, descrição e impacto.
- Estado em `data/IncidentesContext.tsx` (`localStorage`, chave `organizer:incidentes:v1`) e dados de exemplo em `data/incidentes.ts` (4 incidentes).

### Templates e docs
- Biblioteca em `/templates-docs` (`pages/TemplatesDocs.tsx`) com 6 categorias: Skills de desenvolvimento, Padrões de projeto, Templates, Storybooks, Design systems e Guias e runbooks.
- Contadores por categoria clicáveis, busca por nome, tag ou responsável, chips de categoria, favoritos (`localStorage`, chave `organizer:recursos:favoritos:v1`) e cartões com tags, responsável, data e botão "Abrir".
- Dados de exemplo em `data/recursos.ts` (17 recursos). Os links "Abrir" ainda apontam para `#`.

### Geral
- Rotas em `App.tsx`; `AppLayout` ganhou o `IncidentesProvider`. Estilos novos em `styles.css`.

## 2026-11-19 · Tooltip no side menu e Backlog

Alterações ainda não commitadas.

- Tooltip nos itens do side menu e no avatar (`data-tooltip` + CSS, sem biblioteca): aparece à direita do ícone ao passar o mouse ou focar com o teclado, com pequeno atraso. Fica oculto em telas sem hover e respeita `prefers-reduced-motion`. O `title` nativo foi removido para não duplicar; o `aria-label` continua.
- Nova tela `/backlog` (`pages/Backlog.tsx`): lista as demandas das etapas Entrada, Descoberta, Aguardando aprovação e Pronto para desenvolvimento, ordenadas por urgência.
  - Indicadores: itens no backlog, prontos para desenvolver, urgentes e sem estimativa.
  - Busca, chips de urgência e filtros de categoria e etapa.
  - Urgência editável na própria linha e botão "Avançar" para a próxima etapa; quem sai de "Pronto para desenvolvimento" passa a aparecer só no quadro.
- `DemandasContext` ganhou `definirUrgencia`; a mudança é salva no `localStorage` como as demais.
- O design não tem tela de backlog; o layout reaproveita os padrões da lista de projetos e do quadro.

## 2026-11-19 · Quadro de demandas

Alterações ainda não commitadas.

- Novo quadro em `/quadro` (`pages/Quadro.tsx`): 9 colunas de Entrada a Sustentação, cartões por demanda, busca, filtro por categoria e indicadores (em andamento e incidentes abertos calculados a partir das demandas; lead e cycle time ainda fixos).
- Nova ficha em `/quadro/:id` (`pages/DemandaDetalhe.tsx`): descrição, critérios de aceite com progresso e marcação, vinculados, histórico de estados e painel de detalhes. O botão principal move a demanda para a próxima etapa e registra no histórico.
- Novo formulário em `/quadro/nova` (`pages/NovaDemanda.tsx`): título, categoria, projeto, solicitante, descrição, urgência, impacto e anexos. Valida título e projeto; a demanda criada entra em Entrada e abre a ficha.
- Estado compartilhado em `data/DemandasContext.tsx`, com persistência no `localStorage` (chave `organizer:demandas:v1`). Dados de exemplo em `data/demandas.ts` (15 demandas; ficha completa só na SOC-124).
- Rotas em `App.tsx`; o item "Quadro de demandas" do menu continua ativo nas subtelas.
- Estilos novos em `styles.css`: quadro, cartões, linha do tempo, formulário, aviso e área de anexos.
- Pendente: o botão "Planejamento semanal", "Editar" e o envio de anexos ainda não têm ação.

## 2026-11-19 · Novo side menu e área de Projetos

Alterações ainda não commitadas.

### Side menu
- Layout trocado para uma coluna de 72px só com ícones, seguindo o novo design.
- Logo substituído pela marca da Sociiz (`src/assets/sociiz-mark.svg`, extraída do design).
- Itens com `aria-label` e `title`, já que o texto não aparece.
- Rodapé reduzido ao avatar, com nome e cargo no `title`.
- Item "Projetos" continua ativo dentro da ficha do projeto.

### Área de Projetos
- Nova lista em `/projetos` (`pages/Projetos.tsx`): cartões de resumo, busca, chips de tipo, filtro de status e tabela de aplicações.
- Nova ficha em `/projetos/:id` (`pages/ProjetoDetalhe.tsx`): cabeçalho, links rápidos e abas Visão geral, Ambientes e hosts, Dependências, Versões e Documentos.
- Dados de exemplo em `src/data/projetos.ts` (9 aplicações; ficha completa só no Controle de acesso).
- Rotas registradas em `App.tsx`; o placeholder de Projetos foi substituído pelas novas telas.
- Estilos novos em `styles.css`: tokens de cor, selos, chips, tabela, abas, cartões e ajustes para telas estreitas.

### Documentação
- Criado `projeto.md` com a visão geral do projeto, estrutura, rotas e o plano de integração com o GitHub.
- Criado este `atualizacoes.md`.

### Observações
- "Cadastrar aplicação", "Editar ficha" e "Nova demanda" ainda não têm ação.
- O HTML do design (`design/`) aparece como modificado no git por alteração do usuário; não foi editado nesta sessão.

## Commit `a9ec815` · Estrutura inicial

- Estrutura do projeto e dependências (React, Vite, React Router).
- Tela de login, shell com side menu e telas placeholder para cada item do menu.
- Design de referência em HTML (`design/`).
