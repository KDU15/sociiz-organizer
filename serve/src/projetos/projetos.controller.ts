import { Controller, Get, Param } from '@nestjs/common'
import { ProjetosService } from './projetos.service'

@Controller('projetos')
export class ProjetosController {
  constructor(private readonly service: ProjetosService) {}
  @Get() listar() {
    return this.service.listar()
  }
  @Get(':id') buscar(@Param('id') id: string) {
    return this.service.buscar(id)
  }
}
