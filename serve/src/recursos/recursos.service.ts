import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class RecursosService {
  constructor(private readonly prisma: PrismaService) {}

  listar(categoria?: string) {
    return this.prisma.recurso.findMany({ where: categoria ? { categoria } : {}, orderBy: { id: 'asc' } })
  }

  async buscar(id: string) {
    const r = await this.prisma.recurso.findUnique({ where: { id } })
    if (!r) throw new NotFoundException(`Recurso ${id} não encontrado`)
    return r
  }
}
