import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.usuariosService['usuarioRepository'].findOne({
      where: { email: dto.email },
    });

    if (!usuario || usuario.deleted_at) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(dto.senha, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: usuario.id, email: usuario.email };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: usuario.id,
        nome: usuario.nome,
        sobrenome: usuario.sobrenome,
        email: usuario.email,
        telefone: usuario.telefone,
        data_nascimento: usuario.dataNascimento,
        avatar_url: usuario.avatar_url
          ? `${process.env.API_URL}/${usuario.avatar_url}`
          : '',
      },
    };
  }
}
