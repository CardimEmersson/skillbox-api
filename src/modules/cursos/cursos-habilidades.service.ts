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
}
