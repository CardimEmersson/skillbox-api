import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjetoCurso } from './entities/projeto-curso.entity';

@Injectable()
export class ProjetosCursosService {
  constructor(
    @InjectRepository(ProjetoCurso)
    private readonly repository: Repository<ProjetoCurso>,
  ) {}

  findAllByProjeto(projetoId: number) {
    return this.repository.find({
      where: { projeto_id: projetoId },
      relations: ['curso'],
      select: {
        curso: {
          id: true,
          nome: true,
          plataforma_instituicao: true,
          prazo_conclusao: true,
        },
      },
    });
  }
}
