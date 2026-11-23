# Organizer Sociiz

Aplicação interna da Sociiz para a equipe de desenvolvimento acompanhar demandas, projetos, documentos e incidentes. O visual segue o design "prévia ADS × Spectrum" (`design/`).

## Stack

- Front (`organizer/`): Next.js 16 (App Router) + React 19 + TypeScript, CSS puro (`src/app/globals.css`) com tokens do Spectrum 2
- API (`serve/`): NestJS 11 + Prisma 6 + PostgreSQL 16 (Docker)

## Como rodar

```bash
cd organizer
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção
npm run start    # serve o build
```

## Estrutura

```
design/                      Design em HTML empacotado (telas de referência)
serve/                       API NestJS (ver "API (serve)")
organizer/
  public/                    Logo e marca da Sociiz
  src/
    app/                     Rotas (App Router)
      layout.tsx             Layout raiz (html, fontes, estilos)
      globals.css            Estilos globais
      login/                 Entrar
      (app)/                 Rotas com side menu (layout.tsx = AppLayout)
        quadro/ backlog/ projetos/ incidentes/ templates-docs/ perfil/ ...
    views/                   Telas (componentes cliente), uma por rota
    components/              AppLayout, SideMenu, ProfileMenu, navItems, Redirecionar
    data/                    Dados de exemplo e contextos (estado no localStorage)
```

## Rotas

Cada rota é uma pasta em `src/app` com um `page.tsx` que renderiza a tela correspondente de `src/views`. O alias `@/` aponta para `src/`.

| Rota | Tela | Situação |
|---|---|---|
| `/login` | Entrar | Pronta (sem autenticação real) |
| `/quadro` | Quadro de demandas | Pronta (dados de exemplo, salvos no navegador) |
| `/quadro/:id` | Ficha da demanda | Pronta |
| `/quadro/nova` | Nova demanda | Pronta |
| `/backlog` | Backlog | Pronta (usa as demandas do quadro) |
| `/incidentes`, `/incidentes/:id`, `/incidentes/novo` | Incidentes | Pronta (dados de exemplo, salvos no navegador) |
| `/templates-docs` | Templates e docs | Pronta (dados de exemplo) |
| `/visao-geral` | Visão geral | Pronta (resumo calculado a partir dos dados de exemplo) |
| `/indicadores` | — | Placeholder |
| `/publicacoes`, `/decisoes-tecnicas` | — | Placeholder, fora do side menu |
| `/perfil` | Configurações do perfil | Pronta (salva no navegador) |
| `/projetos` | Lista de projetos | Pronta (dados de exemplo) |
| `/projetos/:id` | Ficha do projeto | Pronta (dados de exemplo) |

## Side menu

Coluna fixa de 72px só com ícones, com a marca da Sociiz no topo e o avatar do usuário no rodapé. Cada item tem `aria-label` e um tooltip em CSS (`data-tooltip`) com o nome, já que o texto não aparece. O item "Projetos" continua ativo dentro da ficha (`/projetos/:id`).

**Perfil:** o avatar abre um popup com nome, cargo, "Configurações do perfil" (`/perfil`) e "Sair" (volta ao login, sem sessão real).

## Visão geral

Painel de entrada (`views/VisaoGeral.tsx`), calculado a partir dos contextos de demandas e incidentes e dos projetos:
- Cartões de resumo clicáveis: demandas abertas, urgência alta ou crítica, incidentes abertos e projetos com atenção.
- Demandas por etapa (barras), Minhas demandas, Incidentes recentes e lista de Projetos.
- Atalhos "Nova demanda" e "Registrar incidente".
- "Minhas demandas" compara o `responsavel` com o nome ou o cargo do perfil; nos dados de exemplo os responsáveis são cargos (ex.: "Dev principal").

## Área de Projetos

**Lista (`/projetos`)**
- Cartões de resumo, busca por nome ou stack, chips de tipo (Web, Mobile, API, Serviço, SDK) e filtro de status.
- Tabela com aplicação, tipo, status, versão, último deploy, responsável, criticidade e saúde.
- Cada linha abre a ficha.

**Ficha (`/projetos/:id`)**
- Cabeçalho com sigla, selos (tipo, status, criticidade, saúde) e ações.
- Links rápidos (repositório, lojas, monitoramento, documentação).
- Abas: Visão geral, Ambientes e hosts, Dependências, Versões, Documentos.

**Dados**
- `src/data/projetos.ts` guarda 9 aplicações de exemplo, marcadas como "Dados de exemplo".
- Só o Controle de acesso tem ficha completa. Os demais mostram a ficha básica e "Nada cadastrado nesta seção ainda" nas outras abas.
- "Cadastrar aplicação", "Editar ficha" e "Nova demanda" ainda não têm ação.

## Quadro de demandas

- Nove etapas: Entrada, Descoberta, Aguardando aprovação, Pronto para desenvolvimento, Em desenvolvimento, Em revisão, Homologação, Concluído e Sustentação.
- Sete categorias: Projeto novo, Funcionalidade, Melhoria, Correção, Incidente, Ferramenta interna e Pesquisa técnica.
- Nova demanda entra em Entrada; a ficha move a demanda para a próxima etapa e registra no histórico.
- As demandas ficam no `localStorage` do navegador (`organizer:demandas:v1`) até existir um backend. Para voltar aos dados de exemplo, apague essa chave.
- Pendente: "Planejamento semanal", "Editar" e anexos.

## Backlog

Mostra as demandas ainda não em execução (Entrada, Descoberta, Aguardando aprovação e Pronto para desenvolvimento), ordenadas por urgência. Dá para filtrar, trocar a urgência na linha e avançar a etapa. É a mesma base de dados do quadro. Não há tela dele no design, então o layout foi montado a partir dos padrões existentes.

## Incidentes

Registra problemas que afetam a operação: severidade (Crítica a Baixa), status (Aberto, Em investigação, Mitigado, Resolvido), impacto, causa raiz, ações corretivas e linha do tempo. O tempo médio de resolução é calculado a partir dos incidentes resolvidos. Estado salvo em `organizer:incidentes:v1`.

## Templates e docs

Biblioteca de conhecimento da equipe, organizada em Skills de desenvolvimento, Padrões de projeto, Templates, Storybooks, Design systems e Guias e runbooks. Tem busca, filtro por categoria e favoritos. O conteúdo hoje é fixo em `data/recursos.ts` e os links ainda não apontam para destinos reais.

## Estado no navegador

As demandas, os incidentes, o perfil e os favoritos ficam no `localStorage`. Para evitar divergência na hidratação do Next.js, os contextos começam com os dados de exemplo e leem o valor salvo depois de montar (`pronto`). As fichas só decidem que um item não existe depois disso.

## API (serve)

Servidor NestJS em `serve/`, com Postgres via Prisma. Prefixo `/api`, porta 3001 (`.env`).

```bash
cd serve
cp .env.example .env
npm install
npm run db:up        # Postgres 16 via docker compose
npm run db:migrate   # aplica as migrations
npm run db:seed      # carrega os dados de exemplo do front (organizer/src/data)
npm run start:dev
```

| Módulo | Rotas |
|---|---|
| health | `GET /health` |
| demandas | `GET/POST /demandas`, `GET/PATCH/DELETE /demandas/:id`, `PATCH /demandas/:id/estado` |
| incidentes | `GET/POST /incidentes`, `GET/PATCH /incidentes/:id` |
| projetos | `GET /projetos`, `GET /projetos/:id` |
| recursos | `GET /recursos?categoria=`, `GET /recursos/:id` |
| perfil | `GET/PUT /perfil` |

- Schema em `serve/prisma/schema.prisma`: `Usuario`, `Projeto`, `Demanda` (+ `DemandaEvento`), `Incidente` (+ `IncidenteEvento`) e `Recurso`. Critérios, ações, vínculos e o detalhe do projeto ficam em `jsonb`.
- Estados, categorias, urgências e severidades são strings validadas nos DTOs, com os mesmos rótulos do front.
- Ids sequenciais: `SOC-NNN` para demandas e `INC-NNN` para incidentes.
- **O front ainda não usa a API**: continua lendo os dados de exemplo e o `localStorage`.
- Pendente: autenticação (o perfil usa um usuário fixo, `id = default`) e chave estrangeira de `Demanda`/`Incidente` para `Projeto` (hoje é o nome em texto).

## Plano: integração com o GitHub

**Objetivo:** ligar cada projeto ao repositório da aplicação no GitHub e acompanhar as alterações dentro do Organizer.

### O que acompanhar

- Últimos commits e a branch principal.
- Pull requests abertos e os que aguardam revisão.
- Releases e tags, que alimentam a aba "Versões" e os campos "Versão" e "Último deploy".
- Status do CI (GitHub Actions).
- Issues abertas, com possível ligação às demandas do quadro.

### Como conectar

1. **API REST direto do navegador.** Mais rápida, mas só serve para repositórios públicos ou com token do usuário no navegador, tem limite de requisições e é frágil com repositórios privados.
2. **Backend (agora o `serve/`, em NestJS) com GitHub App ou token somente leitura.** O front chama `/api/projetos/:id/github`, o backend consulta o GitHub e guarda em cache. É mais seguro e funciona com repositórios privados. **Opção recomendada.**
3. **Webhooks do GitHub para o backend**, que grava os eventos (push, release, PR, workflow) e deixa o acompanhamento quase em tempo real. Pode vir depois da opção 2.

O token do GitHub nunca deve ficar no front-end.

### Primeiros passos

1. Acrescentar o campo `repo: 'org/nome'` em cada projeto em `src/data/projetos.ts`.
2. Criar no `serve/` um módulo de GitHub com um endpoint por projeto.
3. Mostrar na ficha um bloco "Atividade no GitHub" com commits, PRs, última release e status do CI.
4. Preencher a aba "Versões" com as releases e tags reais.
5. Depois, adicionar webhooks.

### Pendências de decisão

- Os repositórios são privados e ficam em uma organização do GitHub?
- Começar só com leitura ou já com webhooks?

## Plano: integrações com Sentry e PostHog

Duas plataformas externas alimentam o Organizer. Não duplicar funções: cada uma é a fonte de uma área.

- **Sentry** (saúde técnica): erros, performance, releases, uptime e crons. Fonte de **incidentes**, **publicações** e dos indicadores técnicos.
- **PostHog** (comportamento do produto): analytics, funis, feature flags, experimentos e surveys. Fonte dos **indicadores de negócio** e de **demandas**.
- Usar o mesmo identificador de usuário nos dois (`user.id` no Sentry, `distinct_id` no PostHog) para pular de um erro às sessões do usuário.
- Usar o `projeto` do Organizer como propriedade/tag (`project`, `release`, `environment`) nos eventos das duas ferramentas, para cruzar os dados.

### Sentry: o que trazer

| Funcionalidade | Onde entra | Como |
|---|---|---|
| Issues (erros agrupados) | `/incidentes` | Webhook de issue criada ou regressão abre um incidente (projeto, severidade, ocorrências, usuários afetados, link). Resolver no Organizer resolve no Sentry. Deduplicar por id do issue. |
| Releases e commits | `/publicacoes` | Cada deploy vira uma publicação, com erros novos e corrigidos da versão. |
| Ownership | Responsável do incidente | Preenche `responsavel` com o dono sugerido (CODEOWNERS). |
| Issue → demanda | Quadro e Backlog | Botão "Criar demanda a partir do erro", com link nos dois sentidos. |
| Cron monitors | `/projetos/:id` | Status de jobs agendados (rodou, atrasou, falhou). |
| Uptime | Visão geral e projetos | Online/offline por projeto; queda vira incidente. |
| Performance e traces | `/indicadores` | p95 de latência, Apdex, throughput, transações lentas. |
| Release health | `/indicadores` | Crash-free sessions e users por release. |
| Regras de alerta | Visão geral | Alertas viram cartões de atenção e incidentes. |
| Feedback de usuário | Backlog | Widget vira demanda com origem "Usuário". |
| Seer (IA) | Ficha do incidente | Causa raiz e sugestão de correção. |
| Replays, logs, profiling | Ficha do incidente | Links de contexto do período do erro. |

### PostHog: o que trazer

| Funcionalidade | Onde entra | Como |
|---|---|---|
| Error tracking | `/incidentes` | Só se o Sentry não cobrir o projeto; mesmo fluxo do webhook. |
| Product e web analytics | `/indicadores` e `/projetos/:id` | Usuários ativos, eventos, conversão e web vitals por projeto, via API de Query (HogQL) ou Endpoints. |
| Feature flags | Ficha do projeto e da demanda | Vincular demanda a flag ("Em rollout 25%"); só concluir a demanda quando a flag chega a 100%. |
| Session replay | Ficha do incidente | Botão "ver sessões afetadas". |
| Experimentos | Demanda tipo "hipótese" e decisões técnicas | Resultado do teste (ganhou/perdeu) anexado e registrado. |
| Surveys | Backlog | Respostas viram demandas com origem "Survey". |
| Alertas | Visão geral | Queda de conversão ou pico de erro vira cartão de atenção ou incidente. |
| Logs e tracing | Ficha do incidente | Link para os logs do período. |
| Annotations | `/publicacoes` | Marca o release no gráfico para medir o impacto. |
| MCP (`mcp.posthog.com/mcp`) | Fluxo de desenvolvimento | Consultar os dados direto do Claude Code ao trabalhar numa demanda. |
| `posthog-js` no próprio Organizer | Uso interno | Ver quais telas a equipe usa. |

### Conceitos para copiar (sem depender das ferramentas)

- **Agrupamento por fingerprint:** ocorrências repetidas entram no mesmo incidente (contador e "visto por último").
- **Estados de incidente:** novo, em andamento, resolvido, ignorado, regressão; reabrir sozinho se o erro voltar.
- **Inbox de triagem:** fila de incidentes sem responsável.
- **Digests:** resumo diário ou semanal por e-mail ou Slack.
- **Self-driving (PostHog):** sinais (erros, rage clicks) viram relatório com sugestão de correção no backlog.

### Arquitetura

1. **Apps monitoradas:** `npx @sentry/wizard@latest -i nextjs` (ou SDK de Node/Nest) e `npx @posthog/wizard@latest`, com `release` e `environment` preenchidos no deploy.
2. **`serve/` (NestJS)**: novo módulo `integracoes`:
   - `POST /api/webhooks/sentry` (valida `sentry-hook-signature`) e `POST /api/webhooks/posthog`;
   - clientes das APIs REST (Sentry) e Query/HogQL (PostHog), com cache;
   - tabelas Prisma `Integracao` (provedor, projetoId, host, config cifrada) e `IncidenteExterno` (incidenteId, provedor, idExterno, url).
3. **`organizer/`**: lê tudo pelo `serve/`; tokens e chaves nunca ficam no navegador.
4. **Sentry:** criar uma *Internal Integration* (token e webhook sem OAuth). Preferir o SaaS na região UE (o self-host é pesado) se houver LGPD.
5. **PostHog:** preferir Cloud (EU se LGPD). O self-host serve só até cerca de 100 mil eventos por mês e sem suporte.

### Pré-requisito

Hoje `projeto` em demanda e incidente é texto, sem chave estrangeira. Trocar por relação com `Projeto` antes de mapear projeto ↔ Sentry/PostHog.

### Primeiros passos

1. Chave estrangeira de projeto e módulo `integracoes` com `Integracao` e `IncidenteExterno`.
2. Webhook do Sentry → incidente, com deduplicação.
3. Sentry releases → Publicações.
4. Indicadores: Sentry (saúde técnica) e PostHog (produto) por projeto.
5. Feature flags e experimentos do PostHog ligados a demandas.
6. Alertas, surveys e feedback entrando no backlog; depois os conceitos de fingerprint, estados e digests.

### Pendências de decisão

- Sentry SaaS ou self-host? PostHog Cloud (US/EU) ou self-host?
- Quais apps enviam dados (Next, Nest, outras)?
- Erros ficam só no Sentry ou também no PostHog?

## Próximos passos

- Conectar o front à API do `serve/` e abandonar os dados fixos e o `localStorage`.
- Autenticação real (OIDC) no login e no `serve/`.
- Desenvolver Indicadores. Publicações e Decisões técnicas saíram do menu; as rotas continuam como placeholder e podem ser removidas.
- Integração com o GitHub, conforme o plano acima.
- Integrações com Sentry (incidentes, publicações, performance) e PostHog (indicadores, flags, experimentos), conforme o plano acima.
