import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habilidade } from './entities/habilidade.entity';
import { CreateHabilidadeDto } from './dto/create-habilidade.dto';
import {
  OutputCreateUpdateDto,
  OutputDeleteDto,
} from 'src/utils/dto/output.dto';
import { HabilidadeOutputDto } from './dto/habilidade-output.dto';
import { IPaginationOptions, IPaginationResult } from 'src/utils/pagination';

@Injectable()
export class HabilidadesService {
  constructor(
    @InjectRepository(Habilidade)
    private readonly repository: Repository<Habilidade>,
  ) {}

  async create(
    usuarioId: number,
    dto: CreateHabilidadeDto,
  ): Promise<OutputCreateUpdateDto> {
    const habilidade = this.repository.create({
      ...dto,
      usuario_id: usuarioId,
    });

    const created = await this.repository.save(habilidade);

    return {
      id: created.id,
      message: 'Habilidade criado com sucesso',
    };
  }

  async findAll(
    usuarioId: number,
    options: IPaginationOptions,
  ): Promise<IPaginationResult<Habilidade>> {
    const { page, limit } = options;
    const [data, total] = await this.repository.findAndCount({
      where: { usuario_id: usuarioId },
      select: ['id', 'nome', 'icone', 'nivel'],
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

  async findById(id: number, usuarioId: number): Promise<HabilidadeOutputDto> {
    const habilidade = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
      select: ['id', 'nome', 'icone', 'nivel'],
    });
    if (!habilidade) throw new NotFoundException('Habilidade não encontrada');
    return habilidade;
  }

  async update(
    id: number,
    usuarioId: number,
    dto: CreateHabilidadeDto,
  ): Promise<OutputCreateUpdateDto> {
    const habilidade = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
    });

    if (!habilidade) throw new NotFoundException('Habilidade não encontrado');

    if (!dto.icone) {
      dto.icone = habilidade.icone;
    }

    Object.assign(habilidade, dto);
    const updated = await this.repository.save(habilidade);

    return {
      id: updated.id,
      message: 'Habilidade atualizada com sucesso',
    };
  }

  async remove(id: number): Promise<OutputDeleteDto> {
    const deleted = await this.repository.softDelete(id);

    if (deleted.affected !== 1) {
      throw new NotFoundException('Habilidade não foi apagada');
    }

    return {
      message: 'Habilidade apagado com sucesso',
    };
  }
}
