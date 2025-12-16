import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meta } from './entities/meta.entity';
import { CreateMetaDto } from './dto/create-meta.dto';
import {
  OutputCreateUpdateDto,
  OutputDeleteDto,
} from 'src/utils/dto/output.dto';
import { IPaginationOptions, IPaginationResult } from 'src/utils/pagination';
import { MetaOutputDto } from './dto/meta-output.dto';

@Injectable()
export class MetasService {
  constructor(
    @InjectRepository(Meta)
    private readonly repository: Repository<Meta>,
  ) {}

  async create(
    usuarioId: number,
    dto: CreateMetaDto,
  ): Promise<OutputCreateUpdateDto> {
    const meta = this.repository.create({
      ...dto,
      usuario_id: usuarioId,
    });

    const created = await this.repository.save(meta);

    return {
      id: created.id,
      message: 'Meta criada com sucesso',
    };
  }

  async findAll(
    usuarioId: number,
    options: IPaginationOptions,
  ): Promise<IPaginationResult<Meta>> {
    const { page, limit } = options;
    const [data, total] = await this.repository.findAndCount({
      where: { usuario_id: usuarioId },
      select: ['id', 'nome', 'descricao', 'prazo_conclusao', 'status'],
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

  async findById(id: number, usuarioId: number): Promise<MetaOutputDto> {
    const meta = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
      select: ['id', 'nome', 'descricao', 'prazo_conclusao', 'status'],
    });
    if (!meta) throw new NotFoundException('Meta não encontrada');
    return meta;
  }

  async update(
    id: number,
    usuarioId: number,
    dto: CreateMetaDto,
  ): Promise<OutputCreateUpdateDto> {
    const meta = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
    });

    if (!meta) throw new NotFoundException('Meta não encontrada');

    Object.assign(meta, dto);
    const updated = await this.repository.save(meta);

    return {
      id: updated.id,
      message: 'Meta atualizada com sucesso',
    };
  }

  async remove(id: number, usuarioId: number): Promise<OutputDeleteDto> {
    const meta = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
    });

    if (!meta) {
      throw new NotFoundException('Meta não encontrada');
    }

    const deleted = await this.repository.softDelete(meta.id);

    if (deleted.affected !== 1) {
      throw new NotFoundException('Meta não foi apagada');
    }

    return {
      message: 'Meta apagada com sucesso',
    };
  }
}
