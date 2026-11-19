import { PartialType } from '@nestjs/mapped-types'
import { IsIn } from 'class-validator'
import { CreateDemandaDto } from './create-demanda.dto'
import { estados, type Estado } from '../demanda.entity'

export class UpdateDemandaDto extends PartialType(CreateDemandaDto) {}

export class MoverDemandaDto {
  @IsIn(estados) estado: Estado
}
