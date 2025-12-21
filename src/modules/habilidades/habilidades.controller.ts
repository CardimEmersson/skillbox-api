import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HabilidadesService } from './habilidades.service';
import { CreateHabilidadeDto } from './dto/create-habilidade.dto';
import { User } from '../auth/user.decorator';
import { CreateHabilidadeSwaggerDto } from './dto/create-habilidade-swagger.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'node:fs';
import * as multer from 'multer';
import { fileFilter, MAX_FILE_SIZE, saveImage } from 'src/utils/image';
import { CategoriasHabilidadesService } from '../categorias/categorias-habilidades.service';
import { ProjetosHabilidadesService } from '../projetos/projetos-habilidades.service';
import { CursosHabilidadesService } from '../cursos/cursos-habilidades.service';

@ApiTags('Habilidades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('habilidades')
export class HabilidadesController {
  constructor(
    private readonly habilidadesService: HabilidadesService,
    private readonly categoriasHabilidadesService: CategoriasHabilidadesService,
    private readonly projetosHabilidadesService: ProjetosHabilidadesService,
    private readonly cursosHabilidadesService: CursosHabilidadesService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dados da habilidade com icone',
    type: CreateHabilidadeSwaggerDto,
  })
  @UseInterceptors(
    FileInterceptor('icone', {
      storage: multer.memoryStorage(),
      fileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  create(
    @Body() dto: CreateHabilidadeDto,
    @User('userId') usuarioId: number,
    @UploadedFile() icone?: Express.Multer.File,
  ) {
    if (icone) {
      const filename = saveImage(icone, 'habilidades');

      dto.icone = `uploads/habilidades/${filename}`;
    }

    return this.habilidadesService.create(usuarioId, dto);
  }

  @Get()
  findAll(
    @User('userId') usuarioId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    limit = Math.min(limit, 100);
    return this.habilidadesService.findAll(usuarioId, { page, limit });
  }

  @Get(':id')
  findById(@Param('id') id: number, @User('userId') usuarioId: number) {
    return this.habilidadesService.findById(id, usuarioId);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('icone', {
      storage: multer.memoryStorage(),
      fileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() dto: CreateHabilidadeDto,
    @User('userId') usuarioId: number,
    @UploadedFile() icone?: Express.Multer.File,
  ) {
    if (icone) {
      const usuario = await this.habilidadesService.findById(id, usuarioId);

      if (usuario.icone) {
        const oldPath = `./uploads/habilidades/${usuario.icone.split('/').pop()}`;
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const filename = saveImage(icone, 'habilidades');
      dto.icone = `uploads/habilidades/${filename}`;
    }

    const { deleteCategoriasHabilidade, createdCategoriasHabilidade } =
      await this.handleCategoriasHabilidades(id, dto.categorias);

    const { deleteProjetosHabilidade, createdProjetosHabilidade } =
      await this.handleProjetosHabilidades(id, dto.projetos);

    const { deleteCursosHabilidade, createdCursosHabilidade } =
      await this.handleCursosHabilidades(id, dto.cursos);

    return this.habilidadesService.update(
      id,
      usuarioId,
      dto,
      deleteCategoriasHabilidade ?? [],
      createdCategoriasHabilidade ?? [],
      deleteProjetosHabilidade ?? [],
      createdProjetosHabilidade ?? [],
      deleteCursosHabilidade ?? [],
      createdCursosHabilidade ?? [],
    );
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User('userId') usuarioId: number,
  ) {
    const habilidade = await this.habilidadesService.findById(id, usuarioId);

    if (!habilidade) {
      throw new NotFoundException('Habilidade não encontrada');
    }

    if (habilidade.icone) {
      const oldPath = `./uploads/habilidades/${habilidade.icone.split('/').pop()}`;

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    return this.habilidadesService.remove(habilidade.id);
  }

  private async handleCategoriasHabilidades(
    habilidadeId: number,
    categorias?: (string | number)[],
  ) {
    const categoriasHabilidade =
      await this.categoriasHabilidadesService.findAllByHabilidade(habilidadeId);

    const deleteCategoriasHabilidade = categoriasHabilidade?.filter(
      (item) => !categorias?.includes(item.habilidade_id?.toString()),
    );

    const existingCategoriaIds =
      categoriasHabilidade?.map((item) => item.habilidade_id.toString()) ?? [];

    const createdCategoriasHabilidade = categorias?.filter(
      (categoriaId) => !existingCategoriaIds.includes(categoriaId?.toString()),
    );

    return {
      deleteCategoriasHabilidade,
      createdCategoriasHabilidade,
    };
  }

  private async handleProjetosHabilidades(
    habilidadeId: number,
    projetos?: (string | number)[],
  ) {
    const projetosHabilidade =
      await this.projetosHabilidadesService.findAllByHabilidade(habilidadeId);

    const deleteProjetosHabilidade = projetosHabilidade?.filter(
      (item) => !projetos?.includes(item.projeto_id?.toString()),
    );

    const existingProjetoIds =
      projetosHabilidade?.map((item) => item.projeto_id.toString()) ?? [];

    const createdProjetosHabilidade = projetos?.filter(
      (projetoId) => !existingProjetoIds.includes(projetoId?.toString()),
    );

    return {
      deleteProjetosHabilidade,
      createdProjetosHabilidade,
    };
  }

  private async handleCursosHabilidades(
    habilidadeId: number,
    cursos?: (string | number)[],
  ) {
    const cursosHabilidade =
      await this.cursosHabilidadesService.findAllByHabilidade(habilidadeId);

    const deleteCursosHabilidade = cursosHabilidade?.filter(
      (item) => !cursos?.includes(item.curso_id?.toString()),
    );

    const existingCursoIds =
      cursosHabilidade?.map((item) => item.curso_id.toString()) ?? [];

    const createdCursosHabilidade = cursos?.filter(
      (cursoId) => !existingCursoIds.includes(cursoId?.toString()),
    );

    return {
      deleteCursosHabilidade,
      createdCursosHabilidade,
    };
  }
}
