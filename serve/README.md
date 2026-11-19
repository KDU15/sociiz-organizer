# Organizer · serve

API (NestJS) do Organizer Sociiz. Os módulos espelham as telas do front. Persistência em Postgres via Prisma.

## Rodando

```bash
cp .env.example .env
npm install
npm run db:up        # Postgres 16 via docker compose
npm run db:migrate   # aplica as migrations
npm run db:seed      # carrega os dados de exemplo do front (organizer/src/data)
npm run start:dev    # http://localhost:3001/api
```

## Rotas (prefixo `/api`)

| Módulo | Rotas |
| --- | --- |
| health | `GET /health` |
| demandas | `GET/POST /demandas`, `GET/PATCH/DELETE /demandas/:id`, `PATCH /demandas/:id/estado` |
| incidentes | `GET/POST /incidentes`, `GET/PATCH /incidentes/:id` |
| projetos | `GET /projetos`, `GET /projetos/:id` |
| recursos | `GET /recursos?categoria=` , `GET /recursos/:id` |
| perfil | `GET/PUT /perfil` |

## Banco

Schema em `prisma/schema.prisma`: `Usuario`, `Projeto`, `Demanda` (+ `DemandaEvento`), `Incidente` (+ `IncidenteEvento`) e `Recurso`. Estados, categorias e severidades são strings validadas nos DTOs, com os mesmos rótulos do front. `npm run db:studio` abre o Prisma Studio.

## Próximos passos

- Autenticação (OIDC) e guard global; o perfil hoje usa um usuário fixo (`id = default`).
- Relacionar `Demanda`/`Incidente` ao `Projeto` por chave estrangeira (hoje é o nome em texto).
- Conectar o front a esta API.
