import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { IncidentesService } from './incidentes.service'
import { CreateIncidenteDto, UpdateIncidenteDto } from './dto/create-incidente.dto'

@Controller('incidentes')
export class IncidentesController {
  constructor(private readonly service: IncidentesService) {}

  @Get() listar() {
    return this.service.listar()
  }
  @Get(':id') buscar(@Param('id') id: string) {
    return this.service.buscar(id)
  }
  @Post() criar(@Body() dto: CreateIncidenteDto) {
    return this.service.criar(dto)
  }
  @Patch(':id') atualizar(@Param('id') id: string, @Body() dto: UpdateIncidenteDto) {
    return this.service.atualizar(id, dto)
  }
}
