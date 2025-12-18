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
import { fileFilter, MAX_FILE_SIZE, saveImage } from 'src/utils/image';
import { CreateProjetoSwaggerDto } from './dto/create-projeto-swagger.dto';
import * as fs from 'node:fs';
import { UpdateProjetoSwaggerDto } from './dto/update-projeto-swagger.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { ImagensProjetosService } from './imagens-projetos.service';
import { ImagemProjeto } from './entities/imagem-projeto.entity';

@ApiTags('Projetos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projetos')
export class ProjetosController {
  constructor(
    private readonly projetosService: ProjetosService,
    private readonly imagensProjetosService: ImagensProjetosService,
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
    const urlImagens: string[] = [];
    try {
      for (const imagem of imagens) {
        const filename = saveImage(imagem, 'projetos');
        const imagemUrl = `uploads/projetos/${filename}`;

        urlImagens.push(imagemUrl);
      }

      return this.projetosService.create(usuarioId, dto, urlImagens);
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      if (urlImagens.length) {
        for (const imagem of urlImagens) {
          if (fs.existsSync(imagem)) {
            fs.unlinkSync(imagem);
          }
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
    const urlImagensNovas: string[] = [];
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

      if (imagens && imagens.length > 0) {
        for (const imagem of imagens) {
          const filename = saveImage(imagem, 'projetos');
          const imagemUrl = `uploads/projetos/${filename}`;
          urlImagensNovas.push(imagemUrl);
        }
      }

      const updated = await this.projetosService.update(
        id,
        usuarioId,
        dto,
        urlImagensNovas,
      );

      // apaga as imagens antigas
      if (updated && (oldImages?.length || deleteImages?.length)) {
        for (const imagem of oldImages) {
          if (fs.existsSync(imagem.imagem_url)) {
            fs.unlinkSync(imagem.imagem_url);
          }
        }

        for (const imagem of deleteImages) {
          if (fs.existsSync(imagem.imagem_url)) {
            fs.unlinkSync(imagem.imagem_url);
          }
        }
      }

      return updated;
    } catch (error) {
      console.error('Erro ao editar projeto:', error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User('userId') usuarioId: number,
  ) {
    try {
      const imagensProjeto =
        await this.imagensProjetosService.findAllByProjeto(id);

      let deleteImagensProjeto: string[] = [];
      if (imagensProjeto?.length) {
        deleteImagensProjeto = imagensProjeto.map((item) => item.imagem_url);
      }

      const deleted = await this.projetosService.remove(id, usuarioId);

      if (deleted && deleteImagensProjeto?.length) {
        for (const imagem of deleteImagensProjeto) {
          if (fs.existsSync(imagem)) {
            fs.unlinkSync(imagem);
          }
        }
      }

      return deleted;
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      throw error;
    }
  }
}
