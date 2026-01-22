import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Put,
  Query,
  DefaultValuePipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjetosService } from './projetos.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { User } from '../auth/user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileFilter, MAX_FILE_SIZE } from 'src/utils/image';
import { CreateProjetoSwaggerDto } from './dto/create-projeto-swagger.dto';
import { UpdateProjetoSwaggerDto } from './dto/update-projeto-swagger.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { ImagensProjetosService } from './imagens-projetos.service';
import { ImagemProjeto } from './entities/imagem-projeto.entity';
import { ProjetosHabilidadesService } from './projetos-habilidades.service';
import { ProjetoHabilidade } from './entities/projeto-habilidade.entity';
import { ProjetoCurso } from './entities/projeto-curso.entity';
import { ProjetosCursosService } from './projetos-cursos.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@ApiTags('Projetos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projetos')
export class ProjetosController {
  constructor(
    private readonly projetosService: ProjetosService,
    private readonly imagensProjetosService: ImagensProjetosService,
    private readonly projetoHabilidadesService: ProjetosHabilidadesService,
    private readonly projetoCursosService: ProjetosCursosService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dados do projeto com imagens',
    type: CreateProjetoSwaggerDto,
  })
  @UseInterceptors(
    FilesInterceptor('imagens', 4, {
      fileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async create(
    @Body() dto: CreateProjetoDto,
    @UploadedFiles() imagens: Array<Express.Multer.File>,
    @User('userId') usuarioId: number,
  ) {
    let urlImagens: string[] = [];
    try {
      urlImagens = await this.createImagensProjeto(imagens);

      return await this.projetosService.create(usuarioId, dto, urlImagens);
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      if (urlImagens.length) {
        for (const imagemUrl of urlImagens) {
          await this.cloudinaryService.deleteImage(imagemUrl);
        }
      }
      throw error;
    }
  }

  @Get()
  findAll(
    @User('userId') usuarioId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    limit = Math.min(limit, 100);
    return this.projetosService.findAll(usuarioId, { page, limit });
  }

  @Get(':id')
  findById(@Param('id') id: number, @User('userId') usuarioId: number) {
    return this.projetosService.findById(id, usuarioId);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dados do projeto com imagens',
    type: UpdateProjetoSwaggerDto,
  })
  @UseInterceptors(
    FilesInterceptor('imagens', 4, {
      fileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateProjetoDto,
    @UploadedFiles() imagens: Array<Express.Multer.File>,
    @User('userId') usuarioId: number,
  ) {
    let urlImagensNovas: string[] = [];
    let oldImages: ImagemProjeto[] = [];
    let deleteImages: ImagemProjeto[] = [];

    try {
      const imagensProjeto =
        await this.imagensProjetosService.findAllByProjeto(id);

      if (dto.editar_imagens_ids?.length) {
        oldImages = imagensProjeto?.filter((item) =>
          dto.editar_imagens_ids?.includes(item.id?.toString()),
        );
      }

      if (dto.excluir_imagens_ids?.length) {
        deleteImages = imagensProjeto?.filter((item) =>
          dto.excluir_imagens_ids?.includes(item.id?.toString()),
        );
      }

      urlImagensNovas = await this.createImagensProjeto(imagens);

      const { deleteHabilidadesProjeto, createdHabilidadesProjeto } =
        await this.handleHabilidadesProjeto(id, dto);

      const { deleteCursosProjeto, createdCursosProjeto } =
        await this.handleCursosProjeto(id, dto);

      const updated = await this.projetosService.update(
        id,
        usuarioId,
        dto,
        urlImagensNovas,
        deleteHabilidadesProjeto ?? [],
        createdHabilidadesProjeto ?? [],
        deleteCursosProjeto ?? [],
        createdCursosProjeto ?? [],
      );

      // apaga as imagens antigas
      if (updated && (oldImages?.length || deleteImages?.length)) {
        await this.deleteImagensProjeto(oldImages);
        await this.deleteImagensProjeto(deleteImages);
      }

      return updated;
    } catch (error) {
      console.error('Erro ao editar projeto:', error);
      if (urlImagensNovas.length) {
        for (const imagemUrl of urlImagensNovas) {
          await this.cloudinaryService.deleteImage(imagemUrl);
        }
      }
      throw error;
    }
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User('userId') usuarioId: number,
  ) {
    return this.projetosService.remove(id, usuarioId);
  }

  private async createImagensProjeto(
    imagens: Array<Express.Multer.File>,
  ): Promise<string[]> {
    const urlImagens: string[] = [];
    if (imagens && imagens.length > 0) {
      for (const imagem of imagens) {
        const result = await this.cloudinaryService.uploadImage(
          imagem,
          'projetos',
        );
        if (result?.secure_url) {
          urlImagens.push(result.secure_url);
        }
      }
    }
    return urlImagens;
  }

  private async deleteImagensProjeto(imagens: ImagemProjeto[]) {
    for (const imagem of imagens) {
      if (imagem.imagem_url) {
        await this.cloudinaryService.deleteImage(imagem.imagem_url);
      }
    }
  }

  private async handleHabilidadesProjeto(
    projetoId: number,
    dto: UpdateProjetoDto,
  ): Promise<{
    deleteHabilidadesProjeto: ProjetoHabilidade[];
    createdHabilidadesProjeto: (string | number)[] | undefined;
  }> {
    const habilidadesProjeto =
      await this.projetoHabilidadesService.findAllByProjeto(projetoId);

    const deleteHabilidadesProjeto = habilidadesProjeto?.filter(
      (item) => !dto.habilidades?.includes(item.habilidade_id?.toString()),
    );

    const existingHabilidadeIds =
      habilidadesProjeto?.map((item) => item.habilidade_id.toString()) ?? [];

    const createdHabilidadesProjeto = dto.habilidades?.filter(
      (habilidadeId) =>
        !existingHabilidadeIds.includes(habilidadeId?.toString()),
    );

    return {
      deleteHabilidadesProjeto,
      createdHabilidadesProjeto,
    };
  }

  private async handleCursosProjeto(
    projetoId: number,
    dto: UpdateProjetoDto,
  ): Promise<{
    deleteCursosProjeto: ProjetoCurso[];
    createdCursosProjeto: (string | number)[] | undefined;
  }> {
    const cursosProjeto =
      await this.projetoCursosService.findAllByProjeto(projetoId);

    const deleteCursosProjeto = cursosProjeto?.filter(
      (item) => !dto.cursos?.includes(item.curso_id?.toString()),
    );

    const existingCursoIds =
      cursosProjeto?.map((item) => item.curso_id.toString()) ?? [];

    const createdCursosProjeto = dto.cursos?.filter(
      (cursoId) => !existingCursoIds.includes(cursoId?.toString()),
    );

    return {
      deleteCursosProjeto,
      createdCursosProjeto,
    };
  }
}
