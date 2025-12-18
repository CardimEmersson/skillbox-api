import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjetoHabilidade } from './entities/projeto-habilidade.entity';

@Injectable()
export class ProjetosHabilidadesService {
  constructor(
    @InjectRepository(ProjetoHabilidade)
    private readonly repository: Repository<ProjetoHabilidade>,
  ) {}

  findAllByProjeto(projetoId: number) {
    return this.repository.find({
      where: { projeto_id: projetoId },
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
