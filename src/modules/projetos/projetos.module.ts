import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projeto } from './entities/projeto.entity';
import { ImagemProjeto } from './entities/imagem-projeto.entity';
import { ProjetosService } from './projetos.service';
import { ProjetosController } from './projetos.controller';
import { ImagensProjetosService } from './imagens-projetos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Projeto, ImagemProjeto])],
  controllers: [ProjetosController],
  providers: [ProjetosService, ImagensProjetosService],
})
export class ProjetosModule {}
