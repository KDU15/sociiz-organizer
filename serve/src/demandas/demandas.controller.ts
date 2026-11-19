import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common'
import { DemandasService } from './demandas.service'
import { CreateDemandaDto } from './dto/create-demanda.dto'
import { MoverDemandaDto, UpdateDemandaDto } from './dto/update-demanda.dto'

@Controller('demandas')
export class DemandasController {
  constructor(private readonly service: DemandasService) {}

  @Get() listar(@Query('estado') estado?: string, @Query('projeto') projeto?: string) {
    return this.service.listar({ estado, projeto })
  }
  @Get(':id') buscar(@Param('id') id: string) {
    return this.service.buscar(id)
  }
  @Post() criar(@Body() dto: CreateDemandaDto) {
    return this.service.criar(dto)
  }
  @Patch(':id') atualizar(@Param('id') id: string, @Body() dto: UpdateDemandaDto) {
    return this.service.atualizar(id, dto)
  }
  @Patch(':id/estado') mover(@Param('id') id: string, @Body() dto: MoverDemandaDto) {
    return this.service.mover(id, dto)
  }
  @Delete(':id') @HttpCode(204) remover(@Param('id') id: string) {
    return this.service.remover(id)
  }
}
