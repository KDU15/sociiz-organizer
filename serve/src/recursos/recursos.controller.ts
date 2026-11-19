import { Controller, Get, Param, Query } from '@nestjs/common'
import { RecursosService } from './recursos.service'

@Controller('recursos')
export class RecursosController {
  constructor(private readonly service: RecursosService) {}
  @Get() listar(@Query('categoria') categoria?: string) {
    return this.service.listar(categoria)
  }
  @Get(':id') buscar(@Param('id') id: string) {
    return this.service.buscar(id)
  }
}
