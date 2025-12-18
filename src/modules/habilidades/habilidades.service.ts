import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Habilidade } from './entities/habilidade.entity';
import { CreateHabilidadeDto } from './dto/create-habilidade.dto';
import {
  OutputCreateUpdateDto,
  OutputDeleteDto,
} from 'src/utils/dto/output.dto';
import { HabilidadeOutputDto } from './dto/habilidade-output.dto';
import { IPaginationOptions, IPaginationResult } from 'src/utils/pagination';
import { CategoriaHabilidade } from '../categorias/entities/categoria-habilidade.entity';

@Injectable()
export class HabilidadesService {
  constructor(
    @InjectRepository(Habilidade)
    private readonly repository: Repository<Habilidade>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    usuarioId: number,
    dto: CreateHabilidadeDto,
  ): Promise<OutputCreateUpdateDto> {
    const habilidadeSalva = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const { categorias, ...habilidadeDto } = dto;

        const habilidade = transactionalEntityManager.create(Habilidade, {
          ...habilidadeDto,
          usuario_id: usuarioId,
        });
        const habilidadeCriada =
          await transactionalEntityManager.save(habilidade);

        await this.createCategoriaHabilidade(
          categorias ?? [],
          transactionalEntityManager,
          habilidadeCriada,
        );

        return habilidadeCriada;
      },
    );

    return {
      id: habilidadeSalva.id,
      message: 'Habilidade criado com sucesso',
    };
  }

  async findAll(
    usuarioId: number,
    options: IPaginationOptions,
  ): Promise<IPaginationResult<HabilidadeOutputDto>> {
    const { page, limit } = options;
    const [data, total] = await this.repository.findAndCount({
      where: { usuario_id: usuarioId },
      select: ['id', 'nome', 'icone', 'nivel'],
      relations: ['categorias', 'categorias.categoria'],
      take: limit,
      skip: (page - 1) * limit,
    });

    const formatedHabilidades: HabilidadeOutputDto[] = data.map(
      (curso) => new HabilidadeOutputDto(curso),
    );

    return {
      data: formatedHabilidades,
      count: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async findById(id: number, usuarioId: number): Promise<HabilidadeOutputDto> {
    const habilidade = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
      select: ['id', 'nome', 'icone', 'nivel'],
      relations: ['categorias', 'categorias.categoria'],
    });
    if (!habilidade) throw new NotFoundException('Habilidade não encontrada');

    const formatedHabilidade = new HabilidadeOutputDto(habilidade);

    return formatedHabilidade;
  }

  async update(
    id: number,
    usuarioId: number,
    dto: CreateHabilidadeDto,
    deleteCategoriasHabilidade: CategoriaHabilidade[],
    createdCategoriasHabilidade: (number | string)[],
  ): Promise<OutputCreateUpdateDto> {
    const habilidade = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
    });

    if (!habilidade) throw new NotFoundException('Habilidade não encontrado');

    if (!dto.icone) {
      dto.icone = habilidade.icone;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categorias, ...updateData } = dto;

    Object.assign(habilidade, updateData);
    // const updated = await this.repository.save(habilidade);

    const habilidadeSalva = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const habilidadeAtualizada = await transactionalEntityManager.save(
          Habilidade,
          habilidade,
        );

        await this.deleteCategoriasHabilidade(
          deleteCategoriasHabilidade,
          transactionalEntityManager,
        );

        await this.createCategoriaHabilidade(
          createdCategoriasHabilidade ?? [],
          transactionalEntityManager,
          habilidadeAtualizada,
        );

        return habilidadeAtualizada;
      },
    );

    return {
      id: habilidadeSalva.id,
      message: 'Habilidade atualizada com sucesso',
    };
  }

  async remove(id: number): Promise<OutputDeleteDto> {
    const habilidade = await this.repository.findOne({
      where: { id },
      relations: ['projetos', 'metas', 'cursos', 'categorias'],
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

  private async createCategoriaHabilidade(
    categorias: (number | string)[],
    transactionalEntityManager: EntityManager,
    habilidade: Habilidade,
  ) {
    if (categorias && categorias.length > 0) {
      for (const categoria of categorias) {
        const categoriaId = Number(categoria);

        const relacaoExistente = await transactionalEntityManager.findOne(
          CategoriaHabilidade,
          {
            where: { categoria_id: categoriaId, habilidade_id: habilidade.id },
            withDeleted: true,
          },
        );

        if (relacaoExistente?.deleted_at) {
          await transactionalEntityManager.recover(relacaoExistente);
        } else if (!relacaoExistente) {
          const novaRelacao = transactionalEntityManager.create(
            CategoriaHabilidade,
            { categoria_id: categoriaId, habilidade_id: habilidade.id },
          );
          await transactionalEntityManager.save(novaRelacao);
        }
      }
    }
  }

  private async deleteCategoriasHabilidade(
    categoriashabilidade: CategoriaHabilidade[],
    transactionalEntityManager: EntityManager,
  ) {
    if (categoriashabilidade?.length) {
      for (const categoriaHabilidade of categoriashabilidade) {
        const categoriaHabilidadeExistente =
          await transactionalEntityManager.findOne(CategoriaHabilidade, {
            where: {
              habilidade_id: Number(categoriaHabilidade.habilidade_id),
              categoria_id: Number(categoriaHabilidade.categoria_id),
            },
          });

        if (categoriaHabilidadeExistente) {
          await transactionalEntityManager.softDelete(CategoriaHabilidade, {
            categoria_id: categoriaHabilidadeExistente.categoria_id,
            habilidade_id: categoriaHabilidadeExistente.habilidade_id,
          });
        }
      }
    }
  }
}
