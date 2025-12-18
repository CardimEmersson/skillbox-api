import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Projeto } from './entities/projeto.entity';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { ProjetoOutputDto } from './dto/projeto-output.dto';
import {
  OutputCreateUpdateDto,
  OutputDeleteDto,
} from 'src/utils/dto/output.dto';
import { IPaginationOptions, IPaginationResult } from 'src/utils/pagination';
import { ImagemProjeto } from './entities/imagem-projeto.entity';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { ProjetoHabilidade } from './entities/projeto-habilidade.entity';

@Injectable()
export class ProjetosService {
  constructor(
    @InjectRepository(Projeto)
    private readonly repository: Repository<Projeto>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    usuarioId: number,
    dto: CreateProjetoDto,
    urlImagens: string[],
  ): Promise<OutputCreateUpdateDto> {
    const projetoSalvo = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const { habilidades, ...projetoDto } = dto;

        const projeto = transactionalEntityManager.create(Projeto, {
          ...projetoDto,
          usuario_id: usuarioId,
        });
        const projetoCriado = await transactionalEntityManager.save(projeto);

        await this.createImagensProjeto(
          urlImagens,
          transactionalEntityManager,
          projetoCriado,
        );

        await this.createHabilidadesProjeto(
          habilidades ?? [],
          transactionalEntityManager,
          projetoCriado,
        );

        return projetoCriado;
      },
    );
    return {
      id: projetoSalvo.id,
      message: 'Projeto criado com sucesso',
    };
  }

  async findAll(
    usuarioId: number,
    options: IPaginationOptions,
  ): Promise<IPaginationResult<ProjetoOutputDto>> {
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
      relations: ['imagens', 'habilidades', 'habilidades.habilidade'],
      take: limit,
      skip: (page - 1) * limit,
    });

    const formattedData = data.map((projeto) => new ProjetoOutputDto(projeto));

    return {
      data: formattedData,
      count: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async findById(id: number, usuarioId: number): Promise<ProjetoOutputDto> {
    const projeto = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
      relations: ['imagens', 'habilidades', 'habilidades.habilidade'],
    });
    if (!projeto) throw new NotFoundException('Projeto não encontrado');

    const formatedProjetos = new ProjetoOutputDto(projeto);

    return formatedProjetos;
  }

  async update(
    id: number,
    usuarioId: number,
    dto: UpdateProjetoDto,
    urlImagens: string[],
    deleteHabilidadesProjeto: ProjetoHabilidade[],
    createdHabilidadesProjeto: (number | string)[],
  ): Promise<OutputCreateUpdateDto> {
    const projeto = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
    });

    if (!projeto) throw new NotFoundException('Projeto não encontrado');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { habilidades, ...updateData } = dto;

    Object.assign(projeto, updateData);

    const projetoSalvo = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const projetoAtualizado = await transactionalEntityManager.save(
          Projeto,
          projeto,
        );

        await this.handleImagensProjeto(
          dto,
          transactionalEntityManager,
          urlImagens,
          projetoAtualizado,
        );

        await this.deleteHabilidadesProjeto(
          deleteHabilidadesProjeto,
          transactionalEntityManager,
        );

        await this.createHabilidadesProjeto(
          createdHabilidadesProjeto ?? [],
          transactionalEntityManager,
          projetoAtualizado,
        );

        return projetoAtualizado;
      },
    );
    return {
      id: projetoSalvo.id,
      message: 'Projeto atualizado com sucesso',
    };
  }

  async remove(id: number, usuarioId: number): Promise<OutputDeleteDto> {
    const projeto = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
      relations: ['imagens', 'habilidades'],
    });

    if (!projeto) throw new NotFoundException('Projeto não encontrado');

    await this.repository.softRemove(projeto);

    return {
      message: 'Projeto apagado com sucesso',
    };
  }

  private async handleImagensProjeto(
    dto: UpdateProjetoDto,
    transactionalEntityManager: EntityManager,
    urlImagens: string[],
    projetoAtualizado: Projeto,
  ) {
    // exclui imagens
    if (dto.excluir_imagens_ids?.length) {
      for (const id of dto.excluir_imagens_ids) {
        const imagem = await transactionalEntityManager.findOne(ImagemProjeto, {
          where: { id: Number(id) },
        });

        if (imagem) {
          await transactionalEntityManager.softDelete(ImagemProjeto, imagem.id);
        }
      }
    }

    // atualiza imagens
    if (dto.editar_imagens_ids?.length) {
      for (const [index, id] of dto.editar_imagens_ids.entries()) {
        const imagem = await transactionalEntityManager.findOne(ImagemProjeto, {
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
    await this.createImagensProjeto(
      urlImagens,
      transactionalEntityManager,
      projetoAtualizado,
    );
  }

  private async createImagensProjeto(
    urlImagens: string[],
    transactionalEntityManager: EntityManager,
    projeto: Projeto,
  ) {
    if (urlImagens && urlImagens.length > 0) {
      const imagens = urlImagens.map((url) =>
        transactionalEntityManager.create(ImagemProjeto, {
          projeto_id: projeto.id,
          imagem_url: url,
        }),
      );
      await transactionalEntityManager.save(imagens);
    }
  }

  private async createHabilidadesProjeto(
    habilidades: (number | string)[],
    transactionalEntityManager: EntityManager,
    projeto: Projeto,
  ) {
    if (habilidades && habilidades.length > 0) {
      for (const habilidade of habilidades) {
        const habilidadeId = Number(habilidade);

        const relacaoExistente = await transactionalEntityManager.findOne(
          ProjetoHabilidade,
          {
            where: { projeto_id: projeto.id, habilidade_id: habilidadeId },
            withDeleted: true,
          },
        );

        if (relacaoExistente?.deleted_at) {
          await transactionalEntityManager.recover(relacaoExistente);
        } else if (!relacaoExistente) {
          const novaRelacao = transactionalEntityManager.create(
            ProjetoHabilidade,
            { projeto_id: projeto.id, habilidade_id: habilidadeId },
          );
          await transactionalEntityManager.save(novaRelacao);
        }
      }
    }
  }

  private async deleteHabilidadesProjeto(
    habilidadesProjeto: ProjetoHabilidade[],
    transactionalEntityManager: EntityManager,
  ) {
    if (habilidadesProjeto?.length) {
      for (const habilidadeProjeto of habilidadesProjeto) {
        const habilidadeProjetoExistente =
          await transactionalEntityManager.findOne(ProjetoHabilidade, {
            where: {
              habilidade_id: Number(habilidadeProjeto.habilidade_id),
              projeto_id: Number(habilidadeProjeto.projeto_id),
            },
          });

        if (habilidadeProjetoExistente) {
          await transactionalEntityManager.softDelete(ProjetoHabilidade, {
            projeto_id: habilidadeProjetoExistente.projeto_id,
            habilidade_id: habilidadeProjetoExistente.habilidade_id,
          });
        }
      }
    }
  }
}
