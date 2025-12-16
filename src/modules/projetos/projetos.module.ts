import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Projeto } from './entities/projeto.entity';
import { ProjetosService } from './projetos.service';
import { ProjetosController } from './projetos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Projeto])],
  controllers: [ProjetosController],
  providers: [ProjetosService],
})
export class ProjetosModule {}
