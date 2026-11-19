import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { proximoId } from '../common/proximo-id'
import type { CreateDemandaDto } from './dto/create-demanda.dto'
import type { UpdateDemandaDto, MoverDemandaDto } from './dto/update-demanda.dto'

const incluir = { historico: { orderBy: { criadoEm: 'desc' as const } } }
const hoje = () => new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

@Injectable()
export class DemandasService {
  constructor(private readonly prisma: PrismaService) {}

  listar(filtro: { estado?: string; projeto?: string } = {}) {
    return this.prisma.demanda.findMany({ where: filtro, include: incluir, orderBy: { criadoEm: 'desc' } })
  }

  async buscar(id: string) {
    const d = await this.prisma.demanda.findUnique({ where: { id }, include: incluir })
    if (!d) throw new NotFoundException(`Demanda ${id} não encontrada`)
    return d
  }

  async criar(dto: CreateDemandaDto) {
    const ids = (await this.prisma.demanda.findMany({ select: { id: true } })).map((d) => d.id)
    return this.prisma.demanda.create({
      data: {
        ...dto,
        id: proximoId('SOC', ids),
        estado: 'Entrada',
        historico: { create: { estado: 'Entrada', meta: `${hoje()} · demanda criada` } },
      },
      include: incluir,
    })
  }

  async atualizar(id: string, dto: UpdateDemandaDto) {
    await this.buscar(id)
    return this.prisma.demanda.update({ where: { id }, data: dto, include: incluir })
  }

  async mover(id: string, { estado }: MoverDemandaDto) {
    await this.buscar(id)
    return this.prisma.demanda.update({
      where: { id },
      data: { estado, historico: { create: { estado, meta: `${hoje()} · movida para ${estado}` } } },
      include: incluir,
    })
  }

  async remover(id: string) {
    await this.buscar(id)
    await this.prisma.demanda.delete({ where: { id } })
  }
}
