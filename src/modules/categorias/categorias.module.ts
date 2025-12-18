import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { Categoria } from './entities/categoria.entity';
import { Habilidade } from '../habilidades/entities/habilidade.entity';
import { CategoriaHabilidade } from './entities/categoria-habilidade.entity';
import { CategoriasHabilidadesService } from './categorias-habilidades.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Categoria, CategoriaHabilidade, Habilidade]),
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService, CategoriasHabilidadesService],
  exports: [CategoriasHabilidadesService],
})
export class CategoriasModule {}
