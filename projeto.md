# Organizer Sociiz

Aplicação interna da Sociiz para a equipe de desenvolvimento acompanhar demandas, projetos, publicações, decisões técnicas, documentos e incidentes. O visual segue o design "prévia ADS × Spectrum" (`design/`).

## Stack

- React 18 + TypeScript
- Vite 5
- React Router 6
- CSS puro (`organizer/src/styles.css`), com tokens do Spectrum 2

## Como rodar

```bash
cd organizer
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # tsc -b && vite build
```

## Estrutura

```
design/                      Design em HTML empacotado (telas de referência)
organizer/
  src/
    App.tsx                  Rotas
    components/
      AppLayout.tsx          Shell: side menu + conteúdo
      SideMenu.tsx           Menu lateral (coluna de ícones, 72px)
      ProfileMenu.tsx        Popup do perfil (configurações e sair)
      navItems.tsx           Itens do menu e ícones
    pages/
      Login.tsx
      Quadro.tsx             Quadro de demandas
      DemandaDetalhe.tsx     Ficha da demanda
      NovaDemanda.tsx        Formulário de nova demanda
      Perfil.tsx             Configurações do perfil
      Backlog.tsx            Backlog priorizável
      Incidentes.tsx         Lista de incidentes
      IncidenteDetalhe.tsx   Ficha do incidente
      NovoIncidente.tsx      Registro de incidente
      TemplatesDocs.tsx      Biblioteca de templates e docs
      Projetos.tsx           Lista de projetos
      ProjetoDetalhe.tsx     Ficha do projeto (5 abas)
      Placeholder.tsx        Telas ainda não desenvolvidas
    data/projetos.ts         Dados de exemplo dos projetos
    data/incidentes.ts       Incidentes de exemplo e fluxo de status
    data/IncidentesContext.tsx Estado dos incidentes (localStorage)
    data/recursos.ts         Recursos de templates e docs
    data/PerfilContext.tsx   Perfil do usuário (localStorage)
    data/demandas.ts         Etapas, categorias e demandas de exemplo
    data/DemandasContext.tsx Estado das demandas (localStorage)
    assets/                  Logo e marca da Sociiz
```

## Rotas

| Rota | Tela | Situação |
|---|---|---|
| `/login` | Entrar | Pronta (sem autenticação real) |
| `/quadro` | Quadro de demandas | Pronta (dados de exemplo, salvos no navegador) |
| `/quadro/:id` | Ficha da demanda | Pronta |
| `/quadro/nova` | Nova demanda | Pronta |
| `/backlog` | Backlog | Pronta (usa as demandas do quadro) |
| `/incidentes`, `/incidentes/:id`, `/incidentes/novo` | Incidentes | Pronta (dados de exemplo, salvos no navegador) |
| `/templates-docs` | Templates e docs | Pronta (dados de exemplo) |
| `/visao-geral`, `/indicadores`, `/publicacoes`, `/decisoes-tecnicas` | — | Placeholder |
| `/perfil` | Configurações do perfil | Pronta (salva no navegador) |
| `/projetos` | Lista de projetos | Pronta (dados de exemplo) |
| `/projetos/:id` | Ficha do projeto | Pronta (dados de exemplo) |

## Side menu

Coluna fixa de 72px só com ícones, com a marca da Sociiz no topo e o avatar do usuário no rodapé. Cada item tem `aria-label` e um tooltip em CSS (`data-tooltip`) com o nome, já que o texto não aparece. O item "Projetos" continua ativo dentro da ficha (`/projetos/:id`).

**Perfil:** o avatar abre um popup com nome, cargo, "Configurações do perfil" (`/perfil`) e "Sair" (volta ao login, sem sessão real).

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
2. **Backend (proxy) com GitHub App ou token somente leitura.** O front chama `/api/projetos/:id/github`, o backend consulta o GitHub e guarda em cache. É mais seguro e funciona com repositórios privados. **Opção recomendada.**
3. **Webhooks do GitHub para o backend**, que grava os eventos (push, release, PR, workflow) e deixa o acompanhamento quase em tempo real. Pode vir depois da opção 2.

O token do GitHub nunca deve ficar no front-end.

### Primeiros passos

1. Acrescentar o campo `repo: 'org/nome'` em cada projeto em `src/data/projetos.ts`.
2. Criar o backend (por exemplo `server/` em Node) com um endpoint por projeto.
3. Mostrar na ficha um bloco "Atividade no GitHub" com commits, PRs, última release e status do CI.
4. Preencher a aba "Versões" com as releases e tags reais.
5. Depois, adicionar webhooks.

### Pendências de decisão

- Os repositórios são privados e ficam em uma organização do GitHub?
- Já existe um backend ou será criado um novo?
- Começar só com leitura ou já com webhooks?

## Próximos passos

- Desenvolver as demais áreas: Visão geral, Indicadores, Publicações e Decisões técnicas.
- Autenticação real no login.
- Persistência dos projetos (hoje são dados fixos no código).
- Integração com o GitHub, conforme o plano acima.
