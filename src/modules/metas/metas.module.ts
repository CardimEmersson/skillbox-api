import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meta } from './entities/meta.entity';
import { MetasService } from './metas.service';
import { MetasController } from './metas.controller';
import { MetasHabilidadesService } from './metas-habilidades.service';
import { Habilidade } from '../habilidades/entities/habilidade.entity';
import { MetaHabilidade } from './entities/meta-habilidade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meta, MetaHabilidade, Habilidade])],
  controllers: [MetasController],
  providers: [MetasService, MetasHabilidadesService],
})
export class MetasModule {}
