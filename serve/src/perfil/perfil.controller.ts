import { Body, Controller, Get, Put } from '@nestjs/common'
import { PerfilService } from './perfil.service'
import { UpdatePerfilDto } from './dto/update-perfil.dto'

@Controller('perfil')
export class PerfilController {
  constructor(private readonly service: PerfilService) {}
  @Get() obter() {
    return this.service.obter()
  }
  @Put() salvar(@Body() dto: UpdatePerfilDto) {
    return this.service.salvar(dto)
  }
}
