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
import * as fs from 'fs';
import * as multer from 'multer';
import { fileFilter, MAX_FILE_SIZE, saveImage } from 'src/utils/image';

@ApiTags('Habilidades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('habilidades')
export class HabilidadesController {
  constructor(private readonly habilidadesService: HabilidadesService) {}

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

    return this.habilidadesService.update(id, usuarioId, dto);
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
}
