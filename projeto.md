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

## Próximos passos

- Conectar o front à API do `serve/` e abandonar os dados fixos e o `localStorage`.
- Autenticação real (OIDC) no login e no `serve/`.
- Desenvolver Indicadores. Publicações e Decisões técnicas saíram do menu; as rotas continuam como placeholder e podem ser removidas.
- Integração com o GitHub, conforme o plano acima.
