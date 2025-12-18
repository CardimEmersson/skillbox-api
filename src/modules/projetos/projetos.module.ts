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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Projeto,
      ImagemProjeto,
      ProjetoHabilidade,
      Habilidade,
    ]),
  ],
  controllers: [ProjetosController],
  providers: [
    ProjetosService,
    ImagensProjetosService,
    ProjetosHabilidadesService,
  ],
})
export class ProjetosModule {}
