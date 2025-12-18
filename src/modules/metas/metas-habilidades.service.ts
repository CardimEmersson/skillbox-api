import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetaHabilidade } from './entities/meta-habilidade.entity';

@Injectable()
export class MetasHabilidadesService {
  constructor(
    @InjectRepository(MetaHabilidade)
    private readonly repository: Repository<MetaHabilidade>,
  ) {}

  findAllByMeta(metaId: number) {
    return this.repository.find({
      where: { meta_id: metaId },
      relations: ['habilidade'],
      select: {
        habilidade: {
          id: true,
          nome: true,
          nivel: true,
        },
      },
    });
  }
}
