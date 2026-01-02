import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';

import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const emailExiste = await this.usuarioRepository.findOne({
      where: { email: dto.email },
    });

    if (emailExiste) {
      throw new BadRequestException('E-mail já cadastrado');
    }

    const token_confirmacao = crypto.randomInt(100000, 1000000).toString();

    const senhaHash = await bcrypt.hash(dto.senha, 10);

    const usuario = this.usuarioRepository.create({
      ...dto,
      token_confirmacao,
      senha: senhaHash,
    });

    return await this.usuarioRepository.save(usuario);
  }

  async findById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }
    return usuario;
  }

  async findByEmail(email: string) {
    if (!email) {
      throw new BadRequestException('E-mail não informado');
    }

    const usuario = await this.usuarioRepository.findOne({ where: { email } });

    return usuario;
  }

  async update(idUsuario: number, dto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: idUsuario },
    });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (dto.email !== usuario.email) {
      const emailExiste = await this.usuarioRepository.findOne({
        where: { email: dto.email },
      });

      if (emailExiste && emailExiste.id !== idUsuario) {
        throw new BadRequestException(
          'E-mail já está em uso por outro usuário',
        );
      }
    }

    if (!dto.avatar_url) {
      dto.avatar_url = usuario.avatar_url;
    }

    Object.assign(usuario, dto);
    const updatedUsuario = await this.usuarioRepository.save(usuario);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, senha, ...data } = updatedUsuario;

    return {
      ...data,
      avatar_url:
        updatedUsuario.avatar_url &&
        updatedUsuario.avatar_url.startsWith('http')
          ? updatedUsuario.avatar_url
          : `${process.env.API_URL}/${updatedUsuario.avatar_url}`,
    };
  }

  async confirmarEmail(email: string, token: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (usuario.token_confirmacao !== token) {
      throw new BadRequestException('Token de confirmação inválido.');
    }

    usuario.email_confirmado = true;
    usuario.token_confirmacao = null;

    await this.usuarioRepository.save(usuario);
  }

  async reenviarToken(email: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (usuario.email_confirmado) {
      throw new BadRequestException('Este e-mail já foi confirmado.');
    }

    usuario.token_confirmacao = crypto.randomInt(100000, 1000000).toString();

    return await this.usuarioRepository.save(usuario);
  }

  async esqueciSenha(email: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { email } });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const token = crypto.randomInt(100000, 1000000).toString();
    usuario.token_recuperacao_senha = token;

    await this.usuarioRepository.save(usuario);

    return usuario;
  }

  async redefinirSenha(email: string, token: string, novaSenha: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { email } });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (usuario.token_recuperacao_senha !== token) {
      throw new BadRequestException('Código de recuperação inválido.');
    }

    usuario.senha = await bcrypt.hash(novaSenha, 10);
    usuario.token_recuperacao_senha = null;

    await this.usuarioRepository.save(usuario);
  }

  async createSocialUser(data: {
    nome: string;
    sobrenome: string;
    email: string;
    avatar_url?: string;
  }) {
    const senhaRandom = crypto.randomBytes(16).toString('hex');
    const hash = await bcrypt.hash(senhaRandom, 10);

    const usuario = this.usuarioRepository.create({
      ...data,
      senha: hash,
    });

    return this.usuarioRepository.save(usuario);
  }
}
