import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Curso } from './entities/curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';
import {
  OutputCreateUpdateDto,
  OutputDeleteDto,
} from 'src/utils/dto/output.dto';
import { IPaginationOptions, IPaginationResult } from 'src/utils/pagination';
import { CursoOutputDto } from './dto/curso-output.dto';
import { CursoHabilidade } from './entities/curso-habilidade.entity';
import { ImagemCurso } from './entities/imagem-curso.entity';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly repository: Repository<Curso>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    usuarioId: number,
    dto: CreateCursoDto,
    urlImagens: string[],
  ): Promise<OutputCreateUpdateDto> {
    const cursoSalvo = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const { habilidades, ...cursoDto } = dto;

        const curso = transactionalEntityManager.create(Curso, {
          ...cursoDto,
          usuario_id: usuarioId,
        });
        const cursoCriado = await transactionalEntityManager.save(curso);

        await this.createImagensCurso(
          urlImagens,
          transactionalEntityManager,
          cursoCriado,
        );

        await this.createHabilidadesCurso(
          habilidades ?? [],
          transactionalEntityManager,
          cursoCriado,
        );

        return cursoCriado;
      },
    );

    return {
      id: cursoSalvo.id,
      message: 'Curso criado com sucesso',
    };
  }

  async findAll(
    usuarioId: number,
    options: IPaginationOptions,
  ): Promise<IPaginationResult<CursoOutputDto>> {
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
      relations: ['habilidades', 'habilidades.habilidade', 'imagens'],
      take: limit,
      skip: (page - 1) * limit,
    });

    const formatedCursos: CursoOutputDto[] = data.map(
      (curso) => new CursoOutputDto(curso),
    );

    return {
      data: formatedCursos,
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
      relations: ['habilidades', 'habilidades.habilidade', 'imagens'],
    });
    if (!curso) throw new NotFoundException('Curso não encontrado');

    const formatedCurso = new CursoOutputDto(curso);

    return formatedCurso;
  }

  async update(
    id: number,
    usuarioId: number,
    dto: CreateCursoDto,
    urlImagens: string[],
    deleteHabilidadesCurso: CursoHabilidade[],
    createdHabilidadesCurso: (number | string)[],
  ): Promise<OutputCreateUpdateDto> {
    const curso = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
    });

    if (!curso) throw new NotFoundException('Curso não encontrada');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { habilidades, ...updateData } = dto;

    Object.assign(curso, updateData);

    const cursoSalvo = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const cursoAtualizado = await transactionalEntityManager.save(
          Curso,
          curso,
        );

        await this.handleImagensCurso(
          dto,
          transactionalEntityManager,
          urlImagens,
          cursoAtualizado,
        );

        await this.deleteHabilidadesCurso(
          deleteHabilidadesCurso,
          transactionalEntityManager,
        );

        await this.createHabilidadesCurso(
          createdHabilidadesCurso ?? [],
          transactionalEntityManager,
          cursoAtualizado,
        );

        return cursoAtualizado;
      },
    );

    return {
      id: cursoSalvo.id,
      message: 'Curso atualizado com sucesso',
    };
  }

  async remove(id: number, usuarioId: number): Promise<OutputDeleteDto> {
    const curso = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
      relations: ['projetos', 'imagens'],
    });

    if (!curso) {
      throw new NotFoundException('Curso não encontrado');
    }

    if (curso.projetos?.length > 0) {
      throw new BadRequestException(
        'Não é possível excluir um curso que está associado a um projeto',
      );
    }

    await this.repository.softRemove(curso);

    return {
      message: 'Curso apagado com sucesso',
    };
  }

  private async createHabilidadesCurso(
    habilidades: (number | string)[],
    transactionalEntityManager: EntityManager,
    curso: Curso,
  ) {
    if (habilidades && habilidades.length > 0) {
      for (const habilidade of habilidades) {
        const habilidadeId = Number(habilidade);

        const relacaoExistente = await transactionalEntityManager.findOne(
          CursoHabilidade,
          {
            where: { curso_id: curso.id, habilidade_id: habilidadeId },
            withDeleted: true,
          },
        );

        if (relacaoExistente?.deleted_at) {
          await transactionalEntityManager.recover(relacaoExistente);
        } else if (!relacaoExistente) {
          const novaRelacao = transactionalEntityManager.create(
            CursoHabilidade,
            { curso_id: curso.id, habilidade_id: habilidadeId },
          );
          await transactionalEntityManager.save(novaRelacao);
        }
      }
    }
  }

  private async deleteHabilidadesCurso(
    habilidadesCurso: CursoHabilidade[],
    transactionalEntityManager: EntityManager,
  ) {
    if (habilidadesCurso?.length) {
      for (const habilidadeCurso of habilidadesCurso) {
        const habilidadeCursoExistente =
          await transactionalEntityManager.findOne(CursoHabilidade, {
            where: {
              habilidade_id: Number(habilidadeCurso.habilidade_id),
              curso_id: Number(habilidadeCurso.curso_id),
            },
          });

        if (habilidadeCursoExistente) {
          await transactionalEntityManager.softDelete(CursoHabilidade, {
            curso_id: habilidadeCursoExistente.curso_id,
            habilidade_id: habilidadeCursoExistente.habilidade_id,
          });
        }
      }
    }
  }

  private async createImagensCurso(
    urlImagens: string[],
    transactionalEntityManager: EntityManager,
    curso: Curso,
  ) {
    if (urlImagens && urlImagens.length > 0) {
      const imagens = urlImagens.map((url) =>
        transactionalEntityManager.create(ImagemCurso, {
          curso_id: curso.id,
          imagem_url: url,
        }),
      );
      await transactionalEntityManager.save(imagens);
    }
  }

  private async handleImagensCurso(
    dto: UpdateCursoDto,
    transactionalEntityManager: EntityManager,
    urlImagens: string[],
    cursoAtualizado: Curso,
  ) {
    // exclui imagens
    if (dto.excluir_imagens_ids?.length) {
      for (const id of dto.excluir_imagens_ids) {
        const imagem = await transactionalEntityManager.findOne(ImagemCurso, {
          where: { id: Number(id) },
        });

        if (imagem) {
          await transactionalEntityManager.softDelete(ImagemCurso, imagem.id);
        }
      }
    }

    // atualiza imagens
    if (dto.editar_imagens_ids?.length) {
      for (const [index, id] of dto.editar_imagens_ids.entries()) {
        const imagem = await transactionalEntityManager.findOne(ImagemCurso, {
          where: { id: Number(id) },
        });

        if (imagem) {
          imagem.imagem_url = urlImagens[index];
          urlImagens.splice(index, 1);
          await transactionalEntityManager.save(imagem);
        }
      }
    }

    // cria imagens
    await this.createImagensCurso(
      urlImagens,
      transactionalEntityManager,
      cursoAtualizado,
    );
  }
}
