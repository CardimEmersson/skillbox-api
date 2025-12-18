import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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
        const projeto = transactionalEntityManager.create(Projeto, {
          ...dto,
          usuario_id: usuarioId,
        });
        const projetoSalvo = await transactionalEntityManager.save(projeto);

        if (urlImagens && urlImagens.length > 0) {
          const imagens = urlImagens.map((url) =>
            transactionalEntityManager.create(ImagemProjeto, {
              projeto_id: projetoSalvo.id,
              imagem_url: url,
            }),
          );
          await transactionalEntityManager.save(imagens);
        }

        return projetoSalvo;
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
      relations: ['imagens'],
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
      relations: ['imagens'],
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
  ): Promise<OutputCreateUpdateDto> {
    const projeto = await this.repository.findOne({
      where: { id, usuario_id: usuarioId },
    });

    if (!projeto) throw new NotFoundException('Projeto não encontrado');

    Object.assign(projeto, dto);

    const projetoSalvo = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        const projetoAtualizado =
          await transactionalEntityManager.save(projeto);

        // Remove imagens
        if (dto.excluir_imagens_ids?.length) {
          for (const id of dto.excluir_imagens_ids) {
            const imagem = await transactionalEntityManager.findOne(
              ImagemProjeto,
              {
                where: { id: Number(id) },
              },
            );

            if (imagem) {
              await transactionalEntityManager.softDelete(
                ImagemProjeto,
                imagem.id,
              );
            }
          }
        }

        // atualiza imagens
        if (dto.editar_imagens_ids?.length) {
          for (const [index, id] of dto.editar_imagens_ids.entries()) {
            const imagem = await transactionalEntityManager.findOne(
              ImagemProjeto,
              {
                where: { id: Number(id) },
              },
            );

            if (imagem) {
              imagem.imagem_url = urlImagens[index];
              urlImagens.splice(index, 1);
              await transactionalEntityManager.save(imagem);
            }
          }
        }

        // cria imagens
        if (urlImagens && urlImagens.length > 0) {
          const imagens = urlImagens.map((url) =>
            transactionalEntityManager.create(ImagemProjeto, {
              projeto_id: projetoAtualizado.id,
              imagem_url: url,
            }),
          );
          await transactionalEntityManager.save(imagens);
        }

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
