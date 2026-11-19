import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { proximoId } from '../common/proximo-id'
import type { CreateIncidenteDto, UpdateIncidenteDto } from './dto/create-incidente.dto'

const incluir = { linhaDoTempo: { orderBy: { quando: 'desc' as const } } }

@Injectable()
export class IncidentesService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.incidente.findMany({ include: incluir, orderBy: { inicio: 'desc' } })
  }

  async buscar(id: string) {
    const i = await this.prisma.incidente.findUnique({ where: { id }, include: incluir })
    if (!i) throw new NotFoundException(`Incidente ${id} não encontrado`)
    return i
  }

  async criar(dto: CreateIncidenteDto) {
    const ids = (await this.prisma.incidente.findMany({ select: { id: true } })).map((i) => i.id)
    const agora = new Date()
    return this.prisma.incidente.create({
      data: {
        ...dto,
        id: proximoId('INC', ids),
        status: 'Aberto',
        inicio: agora,
        linhaDoTempo: { create: { quando: agora, texto: 'Incidente registrado' } },
      },
      include: incluir,
    })
  }

  async atualizar(id: string, dto: UpdateIncidenteDto) {
    const atual = await this.buscar(id)
    const mudouStatus = dto.status && dto.status !== atual.status
    const agora = new Date()
    return this.prisma.incidente.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.status === 'Resolvido' && mudouStatus ? { resolvidoEm: agora } : {}),
        ...(mudouStatus ? { linhaDoTempo: { create: { quando: agora, texto: `Status alterado para ${dto.status}` } } } : {}),
      },
      include: incluir,
    })
  }
}
