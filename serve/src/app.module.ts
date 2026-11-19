import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { HealthModule } from './health/health.module'
import { DemandasModule } from './demandas/demandas.module'
import { IncidentesModule } from './incidentes/incidentes.module'
import { ProjetosModule } from './projetos/projetos.module'
import { RecursosModule } from './recursos/recursos.module'
import { PerfilModule } from './perfil/perfil.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    DemandasModule,
    IncidentesModule,
    ProjetosModule,
    RecursosModule,
    PerfilModule,
  ],
})
export class AppModule {}
