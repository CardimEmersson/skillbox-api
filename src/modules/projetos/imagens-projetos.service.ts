import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImagemProjeto } from './entities/imagem-projeto.entity';
import { Projeto } from './entities/projeto.entity';

@Injectable()
export class ImagensProjetosService {
  constructor(
    @InjectRepository(ImagemProjeto)
    private readonly repository: Repository<ImagemProjeto>,
    @InjectRepository(Projeto)
    private readonly projetosRepository: Repository<Projeto>,
  ) {}

  findAllByProjeto(projetoId: number) {
    return this.repository.find({
      where: { projeto_id: projetoId },
      select: ['id', 'imagem_url', 'uploaded_at'],
    });
  }
}
