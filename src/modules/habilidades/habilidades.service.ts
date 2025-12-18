import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const habilidade = await this.repository.findOne({
      where: { id },
      relations: ['projetos', 'metas', 'cursos'],
    });

    if (!habilidade) {
      throw new NotFoundException('Habilidade não encontrada');
    }

    if (
      habilidade.projetos?.length > 0 ||
      habilidade.metas?.length > 0 ||
      habilidade.cursos?.length > 0
    ) {
      throw new BadRequestException(
        'Não é possível excluir uma habilidade que está associada a projetos, metas ou cursos.',
      );
    }

    await this.repository.softRemove(habilidade);

    return {
      message: 'Habilidade apagada com sucesso',
    };
  }
}
