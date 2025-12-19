import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { CursosHabilidadesService } from './cursos-habilidades.service';
import { CreateCursoSwaggerDto } from './dto/create-curso-swagger.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileFilter, MAX_FILE_SIZE, saveImage } from 'src/utils/image';
import * as fs from 'node:fs';
import { UpdateCursoSwaggerDto } from './dto/update-curso-swagger.dto';
import { ImagemCurso } from './entities/imagem-curso.entity';
import { ImagensCursosService } from './imagens-cursos.service';
import { UpdateCursoDto } from './dto/update-curso.dto';

@ApiTags('Cursos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cursos')
export class CursosController {
  constructor(
    private readonly cursoService: CursosService,
    private readonly cursosHabilidadesService: CursosHabilidadesService,
    private readonly imagensCursosService: ImagensCursosService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dados do curso com imagens',
    type: CreateCursoSwaggerDto,
  })
  @UseInterceptors(
    FilesInterceptor('imagens', 4, {
      fileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  create(
    @Body() dto: CreateCursoDto,
    @UploadedFiles() imagens: Array<Express.Multer.File>,
    @User('userId') usuarioId: number,
  ) {
    let urlImagens: string[] = [];
    try {
      urlImagens = this.createImagensCurso(imagens);

      return this.cursoService.create(usuarioId, dto, urlImagens);
    } catch (error) {
      console.error('Erro ao criar curso:', error);
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
    return this.cursoService.findAll(usuarioId, { page, limit });
  }

  @Get(':id')
  findById(@Param('id') id: number, @User('userId') usuarioId: number) {
    return this.cursoService.findById(id, usuarioId);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dados do curso com imagens',
    type: UpdateCursoSwaggerDto,
  })
  @UseInterceptors(
    FilesInterceptor('imagens', 4, {
      fileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateCursoDto,
    @UploadedFiles() imagens: Array<Express.Multer.File>,
    @User('userId') usuarioId: number,
  ) {
    let urlImagensNovas: string[] = [];
    let oldImages: ImagemCurso[] = [];
    let deleteImages: ImagemCurso[] = [];
    try {
      const imagensCurso = await this.imagensCursosService.findAllByCurso(id);

      if (dto.editar_imagens_ids?.length) {
        oldImages = imagensCurso?.filter((item) =>
          dto.editar_imagens_ids?.includes(item.id?.toString()),
        );
      }

      if (dto.excluir_imagens_ids?.length) {
        deleteImages = imagensCurso?.filter((item) =>
          dto.excluir_imagens_ids?.includes(item.id?.toString()),
        );
      }

      urlImagensNovas = this.createImagensCurso(imagens);

      const habilidadesCurso =
        await this.cursosHabilidadesService.findAllByCurso(id);

      const deleteHabilidadesCurso = habilidadesCurso?.filter(
        (item) => !dto.habilidades?.includes(item.curso_id?.toString()),
      );

      const existingHabilidadeIds =
        habilidadesCurso?.map((item) => item.curso_id.toString()) ?? [];

      const createdHabilidadesCurso = dto.habilidades?.filter(
        (habilidadeId) =>
          !existingHabilidadeIds.includes(habilidadeId?.toString()),
      );

      const updated = await this.cursoService.update(
        id,
        usuarioId,
        dto,
        urlImagensNovas,
        deleteHabilidadesCurso ?? [],
        createdHabilidadesCurso ?? [],
      );

      // apaga as imagens antigas
      if (updated && (oldImages?.length || deleteImages?.length)) {
        this.deleteImagensCurso(oldImages);
        this.deleteImagensCurso(deleteImages);
      }

      return updated;
    } catch (error) {
      console.error('Erro ao editar curso:', error);
      if (urlImagensNovas.length) {
        for (const imagem of urlImagensNovas) {
          if (fs.existsSync(imagem)) {
            fs.unlinkSync(imagem);
          }
        }
      }
      throw error;
    }
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @User('userId') usuarioId: number,
  ) {
    return this.cursoService.remove(id, usuarioId);
  }

  private createImagensCurso(imagens: Array<Express.Multer.File>): string[] {
    const urlImagens: string[] = [];
    if (imagens && imagens.length > 0) {
      for (const imagem of imagens) {
        const filename = saveImage(imagem, 'cursos');
        const imagemUrl = `uploads/cursos/${filename}`;
        urlImagens.push(imagemUrl);
      }
    }
    return urlImagens;
  }

  private deleteImagensCurso(imagens: ImagemCurso[]) {
    for (const imagem of imagens) {
      if (fs.existsSync(imagem.imagem_url)) {
        fs.unlinkSync(imagem.imagem_url);
      }
    }
  }
}
