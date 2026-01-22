import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projeto } from './entities/projeto.entity';
import { ImagemProjeto } from './entities/imagem-projeto.entity';
import { ProjetosService } from './projetos.service';
import { ProjetosController } from './projetos.controller';
import { ImagensProjetosService } from './imagens-projetos.service';
import { ProjetoHabilidade } from './entities/projeto-habilidade.entity';
import { ProjetosHabilidadesService } from './projetos-habilidades.service';
import { Habilidade } from '../habilidades/entities/habilidade.entity';
import { ProjetoCurso } from './entities/projeto-curso.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { ProjetosCursosService } from './projetos-cursos.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Projeto,
      ImagemProjeto,
      ProjetoHabilidade,
      Habilidade,
      ProjetoCurso,
      Curso,
    ]),
    CloudinaryModule,
  ],
  controllers: [ProjetosController],
  providers: [
    ProjetosService,
    ImagensProjetosService,
    ProjetosCursosService,
    ProjetosHabilidadesService,
  ],
  exports: [ProjetosService, ProjetosHabilidadesService],
})
export class ProjetosModule {}
