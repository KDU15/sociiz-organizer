import { PartialType } from '@nestjs/mapped-types'
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator'
import { severidades, statusFluxo, type Severidade, type StatusIncidente } from '../incidente.entity'

export class CreateIncidenteDto {
  @IsString() @MinLength(3) titulo: string
  @IsString() projeto: string
  @IsIn(severidades) severidade: Severidade
  @IsString() impacto: string
  @IsString() descricao: string
  @IsOptional() @IsString() responsavel?: string
}

export class UpdateIncidenteDto extends PartialType(CreateIncidenteDto) {
  @IsOptional() @IsIn(statusFluxo) status?: StatusIncidente
  @IsOptional() @IsString() causaRaiz?: string
}
