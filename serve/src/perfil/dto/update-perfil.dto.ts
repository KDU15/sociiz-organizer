import { Type } from 'class-transformer'
import { IsBoolean, IsEmail, IsString, ValidateNested } from 'class-validator'

class NotificacoesDto {
  @IsBoolean() incidentes: boolean
  @IsBoolean() demandas: boolean
  @IsBoolean() publicacoes: boolean
}

export class UpdatePerfilDto {
  @IsString() nome: string
  @IsString() cargo: string
  @IsEmail() email: string
  @ValidateNested() @Type(() => NotificacoesDto) notificacoes: NotificacoesDto
}
