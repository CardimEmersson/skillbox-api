import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CategoriaOutputDto } from './dto/categoria-output.dto';
import {
  OutputCreateUpdateDto,
  OutputDeleteDto,
} from 'src/utils/dto/output.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly repository: Repository<Categoria>,
  ) {}

  async create(
    dto: CreateCategoriaDto,
    usuarioId: number,
  ): Promise<OutputCreateUpdateDto> {
    const categoria = this.repository.create({ ...dto, usuario_id: usuarioId });

    const saved = await this.repository.save(categoria);

    return {
      id: saved.id,
      message: 'Categoria criada com sucesso',
    };
  }

  findAll(usuarioId: number): Promise<CategoriaOutputDto[]> {
    return this.repository.find({
      where: {
        usuario_id: usuarioId,
      },
      select: ['id', 'nome'],
    });
  }

  async findById(id: number, usuarioId: number): Promise<CategoriaOutputDto> {
    const categoria = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
      select: ['id', 'nome'],
    });
    if (!categoria) throw new NotFoundException('Categoria não encontrada');
    return categoria;
  }

  async update(
    id: number,
    usuarioId: number,
    dto: UpdateCategoriaDto,
  ): Promise<OutputCreateUpdateDto> {
    const categoria = await this.findById(id, usuarioId);
    Object.assign(categoria, dto);
    const updated = await this.repository.save(categoria);

    return {
      id: updated.id,
      message: 'Categoria atualizada com sucesso',
    };
  }

  async remove(id: number, usuarioId: number): Promise<OutputDeleteDto> {
    const categoria = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
      relations: ['habilidades'],
    });

    if (!categoria) throw new NotFoundException('Categoria não encontrada');

    if (categoria.habilidades?.length > 0) {
      throw new NotFoundException(
        'Não é possível excluir uma categoria que está associada a habilidades.',
      );
    }

    await this.repository.softRemove(categoria);

    return {
      message: 'Categoria apagada com sucesso',
    };
  }
}
