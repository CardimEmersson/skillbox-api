import {
  Controller,
  Post,
  Put,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as multer from 'multer';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import {
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { Usuario } from './entities/usuario.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateUsuarioSwaggerDto } from './dto/create-usuario-swagger.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { fileFilter, MAX_FILE_SIZE, saveImage } from 'src/utils/image';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dados do usuário com avatar',
    type: CreateUsuarioSwaggerDto,
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: multer.memoryStorage(),
      fileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(
    @Body() dto: CreateUsuarioDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    if (avatar) {
      const filename = saveImage(avatar, 'usuarios');

      dto.avatar_url = `uploads/usuarios/${filename}`;
    }

    return this.usuariosService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: multer.memoryStorage(),
      fileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async update(
    @User('userId') userId: number,
    @Body() dto: UpdateUsuarioDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    if (avatar) {
      const usuario = await this.usuariosService.findById(userId);

      if (usuario.avatar_url) {
        const oldPath = `./uploads/usuarios/${usuario.avatar_url.split('/').pop()}`;
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const filename = saveImage(avatar, 'usuarios');
      dto.avatar_url = `uploads/usuarios/${filename}`;
    }

    return this.usuariosService.update(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@User('userId') userId: number) {
    return this.usuariosService.findById(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number, description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  findById(@Param('id', ParseIntPipe) id: number): Promise<Usuario> {
    return this.usuariosService.findById(id);
  }
}
