import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Meta } from './entities/meta.entity';
import { CreateMetaDto } from './dto/create-meta.dto';
import {
  OutputCreateUpdateDto,
  OutputDeleteDto,
} from 'src/utils/dto/output.dto';
import { IPaginationOptions, IPaginationResult } from 'src/utils/pagination';
import { MetaOutputDto } from './dto/meta-output.dto';
import { MetaHabilidade } from './entities/meta-habilidade.entity';

@Injectable()
export class MetasService {
  constructor(
    @InjectRepository(Meta)
    private readonly repository: Repository<Meta>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    usuarioId: number,
    dto: CreateMetaDto,
  ): Promise<OutputCreateUpdateDto> {
    const metaSalva = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const { habilidades, ...metaDto } = dto;

        const meta = transactionalEntityManager.create(Meta, {
          ...metaDto,
          usuario_id: usuarioId,
        });
        const metaCriada = await transactionalEntityManager.save(meta);

        await this.createHabilidadesMeta(
          habilidades ?? [],
          transactionalEntityManager,
          metaCriada,
        );

        return metaCriada;
      },
    );

    return {
      id: metaSalva.id,
      message: 'Meta criada com sucesso',
    };
  }

  async findAll(
    usuarioId: number,
    options: IPaginationOptions,
  ): Promise<IPaginationResult<MetaOutputDto>> {
    const { page, limit } = options;
    const [data, total] = await this.repository.findAndCount({
      where: { usuario_id: usuarioId },
      select: ['id', 'nome', 'descricao', 'prazo_conclusao', 'status'],
      relations: ['habilidades', 'habilidades.habilidade'],
      take: limit,
      skip: (page - 1) * limit,
    });

    const formatedMetas: MetaOutputDto[] = data.map(
      (meta) => new MetaOutputDto(meta),
    );

    return {
      data: formatedMetas,
      count: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async findById(id: number, usuarioId: number): Promise<MetaOutputDto> {
    const meta = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
      select: ['id', 'nome', 'descricao', 'prazo_conclusao', 'status'],
      relations: ['habilidades', 'habilidades.habilidade'],
    });
    if (!meta) throw new NotFoundException('Meta não encontrada');

    const formatedMeta = new MetaOutputDto(meta);

    return formatedMeta;
  }

  async update(
    id: number,
    usuarioId: number,
    dto: CreateMetaDto,
    deleteHabilidadesMeta: MetaHabilidade[],
    createdHabilidadesMeta: (number | string)[],
  ): Promise<OutputCreateUpdateDto> {
    const meta = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
    });

    if (!meta) throw new NotFoundException('Meta não encontrada');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { habilidades, ...updateData } = dto;

    Object.assign(meta, updateData);

    const metaSalva = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const metaAtualizada = await transactionalEntityManager.save(
          Meta,
          meta,
        );

        await this.deleteHabilidadesMeta(
          deleteHabilidadesMeta,
          transactionalEntityManager,
        );

        await this.createHabilidadesMeta(
          createdHabilidadesMeta ?? [],
          transactionalEntityManager,
          metaAtualizada,
        );

        return metaAtualizada;
      },
    );

    return {
      id: metaSalva.id,
      message: 'Meta atualizada com sucesso',
    };
  }

  async remove(id: number, usuarioId: number): Promise<OutputDeleteDto> {
    const meta = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
      relations: ['habilidades'],
    });

    if (!meta) {
      throw new NotFoundException('Meta não encontrada');
    }

    await this.repository.softRemove(meta);

    return {
      message: 'Meta apagada com sucesso',
    };
  }

  private async createHabilidadesMeta(
    habilidades: (number | string)[],
    transactionalEntityManager: EntityManager,
    meta: Meta,
  ) {
    if (habilidades && habilidades.length > 0) {
      for (const habilidade of habilidades) {
        const habilidadeId = Number(habilidade);

        const relacaoExistente = await transactionalEntityManager.findOne(
          MetaHabilidade,
          {
            where: { meta_id: meta.id, habilidade_id: habilidadeId },
            withDeleted: true,
          },
        );

        if (relacaoExistente?.deleted_at) {
          await transactionalEntityManager.recover(relacaoExistente);
        } else if (!relacaoExistente) {
          const novaRelacao = transactionalEntityManager.create(
            MetaHabilidade,
            { meta_id: meta.id, habilidade_id: habilidadeId },
          );
          await transactionalEntityManager.save(novaRelacao);
        }
      }
    }
  }

  private async deleteHabilidadesMeta(
    habilidadesMeta: MetaHabilidade[],
    transactionalEntityManager: EntityManager,
  ) {
    if (habilidadesMeta?.length) {
      for (const habilidadeMeta of habilidadesMeta) {
        const habilidadeMetaExistente =
          await transactionalEntityManager.findOne(MetaHabilidade, {
            where: {
              habilidade_id: Number(habilidadeMeta.habilidade_id),
              meta_id: Number(habilidadeMeta.meta_id),
            },
          });

        if (habilidadeMetaExistente) {
          await transactionalEntityManager.softDelete(MetaHabilidade, {
            meta_id: habilidadeMetaExistente.meta_id,
            habilidade_id: habilidadeMetaExistente.habilidade_id,
          });
        }
      }
    }
  }
}
