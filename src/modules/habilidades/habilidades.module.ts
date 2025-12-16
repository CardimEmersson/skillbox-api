import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habilidade } from './entities/habilidade.entity';
import { HabilidadesService } from './habilidades.service';
import { HabilidadesController } from './habilidades.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Habilidade])],
  controllers: [HabilidadesController],
  providers: [HabilidadesService],
})
export class HabilidadesModule {}
