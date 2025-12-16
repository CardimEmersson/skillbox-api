import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meta } from './entities/meta.entity';
import { MetasService } from './metas.service';
import { MetasController } from './metas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Meta])],
  controllers: [MetasController],
  providers: [MetasService],
})
export class MetasModule {}
