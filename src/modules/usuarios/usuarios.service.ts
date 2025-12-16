import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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

    const senhaHash = await bcrypt.hash(dto.senha, 10);

    const usuario = this.usuarioRepository.create({
      ...dto,
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

  async update(id: number, dto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (dto.email !== usuario.email) {
      const emailExiste = await this.usuarioRepository.findOne({
        where: { email: dto.email },
      });

      if (emailExiste && emailExiste.id !== id) {
        throw new BadRequestException(
          'E-mail já está em uso por outro usuário',
        );
      }
    }

    if (!dto.avatar_url) {
      dto.avatar_url = usuario.avatar_url;
    }

    Object.assign(usuario, dto);
    return this.usuarioRepository.save(usuario);
  }
}
