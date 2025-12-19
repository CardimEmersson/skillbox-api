import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImagemCurso } from './entities/imagem-curso.entity';
import { Curso } from './entities/curso.entity';

@Injectable()
export class ImagensCursosService {
  constructor(
    @InjectRepository(ImagemCurso)
    private readonly repository: Repository<ImagemCurso>,
    @InjectRepository(Curso)
    private readonly cursosRepository: Repository<Curso>,
  ) {}

  async create(cursoId: number, imagemUrl: string) {
    const curso = await this.cursosRepository.findOne({
      where: { id: cursoId },
    });

    if (!curso) {
      throw new NotFoundException('Curso não encontrado');
    }

    const imagem = this.repository.create({
      curso_id: cursoId,
      imagem_url: imagemUrl,
    });

    return this.repository.save(imagem);
  }

  findAllByCurso(cursoId: number) {
    return this.repository.find({
      where: { curso_id: cursoId },
      select: ['id', 'imagem_url', 'uploaded_at'],
    });
  }

  async remove(id: number): Promise<void> {
    const imagem = await this.repository.findOne({ where: { id } });

    if (!imagem) {
      throw new NotFoundException('Imagem não encontrada');
    }

    await this.repository.softDelete(imagem.id);
  }
}
