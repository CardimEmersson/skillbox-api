import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';
import { Habilidade } from '../habilidades/entities/habilidade.entity';
import { CursoHabilidade } from './entities/curso-habilidade.entity';
import { CursosHabilidadesService } from './cursos-habilidades.service';

@Module({
  imports: [TypeOrmModule.forFeature([Curso, Habilidade, CursoHabilidade])],
  controllers: [CursosController],
  providers: [CursosService, CursosHabilidadesService],
})
export class CursosModule {}
