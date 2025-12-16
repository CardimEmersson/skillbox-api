import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projeto } from './entities/projeto.entity';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { ProjetoOutputDto } from './dto/projeto-output.dto';
import {
  OutputCreateUpdateDto,
  OutputDeleteDto,
} from 'src/utils/dto/output.dto';
import { IPaginationOptions, IPaginationResult } from 'src/utils/pagination';

@Injectable()
export class ProjetosService {
  constructor(
    @InjectRepository(Projeto)
    private readonly repository: Repository<Projeto>,
  ) {}

  async create(
    usuarioId: number,
    dto: CreateProjetoDto,
  ): Promise<OutputCreateUpdateDto> {
    const projeto = this.repository.create({
      ...dto,
      usuario_id: usuarioId,
    });

    const created = await this.repository.save(projeto);

    return {
      id: created.id,
      message: 'Projeto criado com sucesso',
    };
  }

  async findAll(
    usuarioId: number,
    options: IPaginationOptions,
  ): Promise<IPaginationResult<Projeto>> {
    const { page, limit } = options;
    const [data, total] = await this.repository.findAndCount({
      where: { usuario_id: usuarioId },
      select: [
        'id',
        'nome',
        'periodo_inicial',
        'periodo_final',
        'tipo_projeto',
        'descricao',
        'link',
      ],
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data,
      count: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async findById(id: number, usuarioId: number): Promise<ProjetoOutputDto> {
    const projeto = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
      select: [
        'id',
        'nome',
        'periodo_inicial',
        'periodo_final',
        'tipo_projeto',
        'descricao',
        'link',
      ],
    });
    if (!projeto) throw new NotFoundException('Projeto não encontrada');
    return projeto;
  }

  async update(
    id: number,
    usuarioId: number,
    dto: CreateProjetoDto,
  ): Promise<OutputCreateUpdateDto> {
    const projeto = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
    });

    if (!projeto) throw new NotFoundException('Projeto não encontrado');

    Object.assign(projeto, dto);
    const updated = await this.repository.save(projeto);

    return {
      id: updated.id,
      message: 'Projeto atualizado com sucesso',
    };
  }

  async remove(id: number, usuarioId: number): Promise<OutputDeleteDto> {
    const projeto = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
    });

    if (!projeto) throw new NotFoundException('Projeto não encontrado');

    const deleted = await this.repository.softDelete(projeto.id);

    if (deleted.affected !== 1) {
      throw new NotFoundException('Projeto não foi apagado');
    }

    return {
      message: 'Projeto apagado com sucesso',
    };
  }
}
