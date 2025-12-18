import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habilidade } from './entities/habilidade.entity';
import { HabilidadesService } from './habilidades.service';
import { HabilidadesController } from './habilidades.controller';
import { CategoriasModule } from '../categorias/categorias.module';

@Module({
  imports: [TypeOrmModule.forFeature([Habilidade]), CategoriasModule],
  controllers: [HabilidadesController],
  providers: [HabilidadesService],
})
export class HabilidadesModule {}
