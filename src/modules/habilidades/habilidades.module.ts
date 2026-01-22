import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habilidade } from './entities/habilidade.entity';
import { HabilidadesService } from './habilidades.service';
import { HabilidadesController } from './habilidades.controller';
import { CategoriasModule } from '../categorias/categorias.module';
import { ProjetoHabilidade } from '../projetos/entities/projeto-habilidade.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { CursoHabilidade } from '../cursos/entities/curso-habilidade.entity';
import { Projeto } from '../projetos/entities/projeto.entity';
import { ProjetosModule } from '../projetos/projetos.module';
import { CursosModule } from '../cursos/cursos.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Habilidade,
      Projeto,
      ProjetoHabilidade,
      Curso,
      CursoHabilidade,
    ]),
    CategoriasModule,
    ProjetosModule,
    CursosModule,
    CloudinaryModule,
  ],
  controllers: [HabilidadesController],
  providers: [HabilidadesService],
})
export class HabilidadesModule {}
