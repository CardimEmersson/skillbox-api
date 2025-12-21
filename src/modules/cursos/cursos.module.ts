import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';
import { Habilidade } from '../habilidades/entities/habilidade.entity';
import { CursoHabilidade } from './entities/curso-habilidade.entity';
import { CursosHabilidadesService } from './cursos-habilidades.service';
import { ImagemCurso } from './entities/imagem-curso.entity';
import { ImagensCursosService } from './imagens-cursos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Curso, Habilidade, CursoHabilidade, ImagemCurso]),
  ],
  controllers: [CursosController],
  providers: [CursosService, CursosHabilidadesService, ImagensCursosService],
  exports: [CursosService, CursosHabilidadesService],
})
export class CursosModule {}
