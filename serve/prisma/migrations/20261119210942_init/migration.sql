-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "notificacoes" JSONB NOT NULL,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projeto" (
    "id" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "stack" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "versao" TEXT NOT NULL,
    "deploy" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,
    "criticidade" TEXT NOT NULL,
    "saude" TEXT NOT NULL,
    "saudeLabel" TEXT NOT NULL,
    "tile" TEXT NOT NULL,
    "detalhe" JSONB,

    CONSTRAINT "Projeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Demanda" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "projeto" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "iniciais" TEXT NOT NULL DEFAULT '',
    "papel" TEXT NOT NULL DEFAULT '',
    "estado" TEXT NOT NULL,
    "urgencia" TEXT NOT NULL,
    "descricao" TEXT NOT NULL DEFAULT '',
    "criterios" JSONB NOT NULL DEFAULT '[]',
    "vinculados" JSONB NOT NULL DEFAULT '[]',
    "responsavel" TEXT NOT NULL DEFAULT '—',
    "revisor" TEXT NOT NULL DEFAULT '—',
    "solicitante" TEXT NOT NULL DEFAULT '—',
    "impacto" TEXT,
    "estimativa" TEXT NOT NULL DEFAULT '—',
    "previsao" TEXT NOT NULL DEFAULT '—',
    "ambiente" TEXT NOT NULL DEFAULT '—',
    "leadTime" TEXT,
    "cycleTime" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Demanda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemandaEvento" (
    "id" SERIAL NOT NULL,
    "demandaId" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "meta" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemandaEvento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incidente" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "projeto" TEXT NOT NULL,
    "severidade" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "resolvidoEm" TIMESTAMP(3),
    "responsavel" TEXT,
    "impacto" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "causaRaiz" TEXT,
    "acoes" JSONB NOT NULL DEFAULT '[]',
    "demandaId" TEXT,

    CONSTRAINT "Incidente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidenteEvento" (
    "id" SERIAL NOT NULL,
    "incidenteId" TEXT NOT NULL,
    "quando" TIMESTAMP(3) NOT NULL,
    "texto" TEXT NOT NULL,

    CONSTRAINT "IncidenteEvento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recurso" (
    "id" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tags" TEXT[],
    "responsavel" TEXT NOT NULL,
    "atualizado" TEXT NOT NULL,
    "href" TEXT NOT NULL,

    CONSTRAINT "Recurso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Demanda_estado_idx" ON "Demanda"("estado");

-- CreateIndex
CREATE INDEX "Demanda_projeto_idx" ON "Demanda"("projeto");

-- CreateIndex
CREATE INDEX "DemandaEvento_demandaId_criadoEm_idx" ON "DemandaEvento"("demandaId", "criadoEm");

-- CreateIndex
CREATE INDEX "Incidente_status_idx" ON "Incidente"("status");

-- CreateIndex
CREATE INDEX "IncidenteEvento_incidenteId_quando_idx" ON "IncidenteEvento"("incidenteId", "quando");

-- CreateIndex
CREATE INDEX "Recurso_categoria_idx" ON "Recurso"("categoria");

-- AddForeignKey
ALTER TABLE "DemandaEvento" ADD CONSTRAINT "DemandaEvento_demandaId_fkey" FOREIGN KEY ("demandaId") REFERENCES "Demanda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incidente" ADD CONSTRAINT "Incidente_demandaId_fkey" FOREIGN KEY ("demandaId") REFERENCES "Demanda"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidenteEvento" ADD CONSTRAINT "IncidenteEvento_incidenteId_fkey" FOREIGN KEY ("incidenteId") REFERENCES "Incidente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
