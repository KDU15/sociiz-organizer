import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import type { UpdatePerfilDto } from './dto/update-perfil.dto'

// TODO: trocar o id fixo pelo usuário autenticado quando houver login.
const ID = 'default'
const padrao: UpdatePerfilDto = {
  nome: 'Carlos Eduardo',
  cargo: 'Dev principal',
  email: 'nome@sociiz.com.br',
  notificacoes: { incidentes: true, demandas: true, publicacoes: false },
}

@Injectable()
export class PerfilService {
  constructor(private readonly prisma: PrismaService) {}

  obter() {
    return this.prisma.usuario.upsert({ where: { id: ID }, create: { id: ID, ...padrao, notificacoes: { ...padrao.notificacoes } }, update: {} })
  }

  salvar(dto: UpdatePerfilDto) {
    return this.prisma.usuario.upsert({ where: { id: ID }, create: { id: ID, ...dto, notificacoes: { ...dto.notificacoes } }, update: { ...dto, notificacoes: { ...dto.notificacoes } } })
  }
}
