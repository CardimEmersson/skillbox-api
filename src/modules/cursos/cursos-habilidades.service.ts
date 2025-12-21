import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CursoHabilidade } from './entities/curso-habilidade.entity';

@Injectable()
export class CursosHabilidadesService {
  constructor(
    @InjectRepository(CursoHabilidade)
    private readonly repository: Repository<CursoHabilidade>,
  ) {}

  findAllByCurso(cursoId: number) {
    return this.repository.find({
      where: { curso_id: cursoId },
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

  findAllByHabilidade(habilidadeId: number) {
    return this.repository.find({
      where: { habilidade_id: habilidadeId },
      relations: ['curso'],
      select: {
        curso: {
          id: true,
          nome: true,
          carga_horaria: true,
          em_andamento: true,
          plataforma_instituicao: true,
          prazo_conclusao: true,
          link: true,
          instructor: true,
        },
      },
    });
  }
}
