import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Habilidade } from '../habilidades/entities/habilidade.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { Meta } from '../metas/entities/meta.entity';
import { Projeto } from '../projetos/entities/projeto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Habilidade, Curso, Meta, Projeto])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
