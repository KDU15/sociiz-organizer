import { IsIn, IsOptional, IsString, MinLength } from 'class-validator'
import { categorias, urgencias, type Categoria, type Urgencia } from '../demanda.entity'

export class CreateDemandaDto {
  @IsString() @MinLength(3) titulo: string
  @IsIn(categorias) categoria: Categoria
  @IsString() projeto: string
  @IsString() solicitante: string
  @IsString() descricao: string
  @IsIn(urgencias) urgencia: Urgencia
  @IsOptional() @IsString() impacto?: string
}
