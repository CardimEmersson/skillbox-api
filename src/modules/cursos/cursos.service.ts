import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from './entities/curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';
import {
  OutputCreateUpdateDto,
  OutputDeleteDto,
} from 'src/utils/dto/output.dto';
import { IPaginationOptions, IPaginationResult } from 'src/utils/pagination';
import { CursoOutputDto } from './dto/curso-output.dto';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly repository: Repository<Curso>,
  ) {}

  async create(
    usuarioId: number,
    dto: CreateCursoDto,
  ): Promise<OutputCreateUpdateDto> {
    const curso = this.repository.create({
      ...dto,
      usuario_id: usuarioId,
    });

    const created = await this.repository.save(curso);

    return {
      id: created.id,
      message: 'Curso criado com sucesso',
    };
  }

  async findAll(
    usuarioId: number,
    options: IPaginationOptions,
  ): Promise<IPaginationResult<Curso>> {
    const { page, limit } = options;
    const [data, total] = await this.repository.findAndCount({
      where: { usuario_id: usuarioId },
      select: [
        'id',
        'nome',
        'plataforma_instituicao',
        'prazo_conclusao',
        'em_andamento',
        'instructor',
        'carga_horaria',
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

  async findById(id: number, usuarioId: number): Promise<CursoOutputDto> {
    const curso = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
      select: [
        'id',
        'nome',
        'plataforma_instituicao',
        'prazo_conclusao',
        'em_andamento',
        'instructor',
        'carga_horaria',
        'link',
      ],
    });
    if (!curso) throw new NotFoundException('Curso não encontrado');
    return curso;
  }

  async update(
    id: number,
    usuarioId: number,
    dto: CreateCursoDto,
  ): Promise<OutputCreateUpdateDto> {
    const curso = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
    });

    if (!curso) throw new NotFoundException('Curso não encontrada');

    Object.assign(curso, dto);
    const updated = await this.repository.save(curso);

    return {
      id: updated.id,
      message: 'Curso atualizado com sucesso',
    };
  }

  async remove(id: number, usuarioId: number): Promise<OutputDeleteDto> {
    const curso = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
    });

    if (!curso) {
      throw new NotFoundException('Curso não encontrado');
    }

    const deleted = await this.repository.softDelete(curso.id);

    if (deleted.affected !== 1) {
      throw new NotFoundException('Curso não foi apagada');
    }

    return {
      message: 'Meta apagada com sucesso',
    };
  }
}
