/* eslint-disable @typescript-eslint/no-unused-vars */
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
import * as fs from 'node:fs';
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
import { EmailService } from '../email/email.service';
import { User } from '../auth/user.decorator';
import { ConfirmarEmailDto } from './dto/confirmar-email.dto';
import { EsqueciSenhaDto } from './dto/esqueci-senha.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';
import { ReenviarEmailDto } from './dto/reenviar-email.dto';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly emailService: EmailService,
  ) {}

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
  async create(
    @Body() dto: CreateUsuarioDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    if (avatar) {
      const filename = saveImage(avatar, 'usuarios');

      dto.avatar_url = `uploads/usuarios/${filename}`;
    }

    const usuario = await this.usuariosService.create(dto);

    await this.emailService.enviarEmailConfirmacao(usuario);

    const {
      senha,
      token_confirmacao,
      email_confirmado,
      token_recuperacao_senha,
      ...result
    } = usuario;
    return result;
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

  @Post('reenviar-email')
  @ApiResponse({ status: 200, description: 'E-mail reenviado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async reenviarEmail(@Body() dto: ReenviarEmailDto) {
    const usuario = await this.usuariosService.reenviarToken(dto.email);
    await this.emailService.enviarEmailConfirmacao(usuario);
    return { message: 'E-mail enviado com sucesso!' };
  }

  @Post('confirmar-email')
  @ApiResponse({ status: 200, description: 'E-mail confirmado com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Token inválido ou dados incorretos.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async confirmarEmail(@Body() dto: ConfirmarEmailDto) {
    await this.usuariosService.confirmarEmail(dto.email, dto.token);
    return { message: 'E-mail confirmado com sucesso!' };
  }

  @Post('esqueci-senha')
  @ApiResponse({ status: 200, description: 'E-mail de recuperação enviado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async esqueciSenha(@Body() dto: EsqueciSenhaDto) {
    const usuario = await this.usuariosService.esqueciSenha(dto.email);
    await this.emailService.enviarEmailRecuperacaoSenha(usuario);
    return { message: 'E-mail de recuperação enviado com sucesso.' };
  }

  @Post('redefinir-senha')
  @ApiResponse({ status: 200, description: 'Senha redefinida com sucesso.' })
  @ApiResponse({ status: 400, description: 'Código inválido.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async redefinirSenha(@Body() dto: RedefinirSenhaDto) {
    await this.usuariosService.redefinirSenha(
      dto.email,
      dto.token,
      dto.novaSenha,
    );
    return { message: 'Senha redefinida com sucesso!' };
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
