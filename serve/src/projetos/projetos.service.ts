import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ProjetosService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.projeto.findMany({ select: { detalhe: false, id: true, sigla: true, nome: true, stack: true, tipo: true, status: true, versao: true, deploy: true, responsavel: true, criticidade: true, saude: true, saudeLabel: true, tile: true }, orderBy: { nome: 'asc' } })
  }

  async buscar(id: string) {
    const p = await this.prisma.projeto.findUnique({ where: { id } })
    if (!p) throw new NotFoundException(`Projeto ${id} não encontrado`)
    return p
  }
}
