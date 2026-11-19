// Carrega no banco os dados de exemplo do front (organizer/src/data).
import { PrismaClient } from '@prisma/client'
import { demandasIniciais } from '../../organizer/src/data/demandas'
import { incidentesIniciais } from '../../organizer/src/data/incidentes'
import { projetos } from '../../organizer/src/data/projetos'
import { recursos } from '../../organizer/src/data/recursos'

const prisma = new PrismaClient()

async function main() {
  await prisma.$transaction([
    prisma.incidenteEvento.deleteMany(),
    prisma.incidente.deleteMany(),
    prisma.demandaEvento.deleteMany(),
    prisma.demanda.deleteMany(),
    prisma.projeto.deleteMany(),
    prisma.recurso.deleteMany(),
  ])

  await prisma.projeto.createMany({
    data: projetos.map(({ detalhe, ...p }) => ({ ...p, detalhe: detalhe ? (detalhe as object) : undefined })),
  })
  await prisma.recurso.createMany({ data: recursos.map(({ ...r }) => r) })

  const agora = Date.now()
  for (const d of demandasIniciais) {
    const { historico, leadTime, cycleTime, impacto, ...resto } = d
    await prisma.demanda.create({
      data: {
        ...resto,
        leadTime,
        cycleTime,
        impacto,
        // histórico vem do mais recente para o mais antigo; criadoEm preserva essa ordem
        historico: {
          create: historico.map((e, i) => ({ estado: e.estado, meta: e.meta, criadoEm: new Date(agora - i * 60_000) })),
        },
      },
    })
  }

  for (const i of incidentesIniciais) {
    const { linhaDoTempo, demanda, inicio, resolvidoEm, ...resto } = i
    await prisma.incidente.create({
      data: {
        ...resto,
        inicio: new Date(inicio),
        resolvidoEm: resolvidoEm ? new Date(resolvidoEm) : null,
        demandaId: demanda ?? null,
        linhaDoTempo: { create: linhaDoTempo.map((e) => ({ quando: new Date(e.quando), texto: e.texto })) },
      },
    })
  }

  console.log(`Seed ok: ${projetos.length} projetos, ${recursos.length} recursos, ${demandasIniciais.length} demandas, ${incidentesIniciais.length} incidentes`)
}

main().finally(() => prisma.$disconnect())
