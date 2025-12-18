import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaHabilidade } from './entities/categoria-habilidade.entity';

@Injectable()
export class CategoriasHabilidadesService {
  constructor(
    @InjectRepository(CategoriaHabilidade)
    private readonly repository: Repository<CategoriaHabilidade>,
  ) {}

  findAllByCategoria(categoriaId: number) {
    return this.repository.find({
      where: { categoria_id: categoriaId },
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
      relations: ['categoria'],
      select: {
        categoria: {
          id: true,
          nome: true,
        },
      },
    });
  }
}
