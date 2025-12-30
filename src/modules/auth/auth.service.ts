import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';
import axios from 'axios';
import { LoginOutputDto } from './dto/login-output.dto';
import { FacebookOutputDto } from './dto/facebook-output.dto';

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

    if (!usuario.email_confirmado) {
      throw new UnauthorizedException(
        'E-mail não confirmado. Por favor, verifique sua caixa de entrada.',
      );
    }

    const senhaValida = await bcrypt.compare(dto.senha, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: usuario.id, email: usuario.email };
    const token = this.jwtService.sign(payload);

    return new LoginOutputDto(token, usuario);
  }

  async loginWithGoogle(googleToken: string) {
    if (!googleToken) {
      throw new Error('Token do Google não enviado');
    }

    const googleUser = await axios
      .get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
        headers: { Authorization: `Bearer ${googleToken}` },
      })
      .catch(() => {
        throw new UnauthorizedException('Credenciais inválidas');
      });

    const { email, given_name, family_name, picture } = googleUser.data;

    let usuario = await this.usuariosService.findByEmail(email as string);

    if (!usuario) {
      usuario = await this.usuariosService.createSocialUser({
        nome: given_name,
        sobrenome: family_name,
        email,
        avatar_url: picture,
      });
    }

    const payload = { sub: usuario.id, email: usuario.email };
    const token = this.jwtService.sign(payload);

    return new LoginOutputDto(token, usuario);
  }

  async loginWithFacebook(facebookToken: string) {
    if (!facebookToken) {
      throw new UnauthorizedException('Token do Facebook não enviado');
    }

    const facebookUser = await axios
      .get<FacebookOutputDto>(
        `https://graph.facebook.com/me?fields=id,name,email,first_name,last_name,picture.height(500)&access_token=${facebookToken}`,
      )
      .catch(() => {
        throw new UnauthorizedException('Credenciais inválidas');
      });
    const { email, first_name, last_name, picture } = facebookUser.data;

    if (!email) {
      throw new UnauthorizedException(
        'Não foi possível obter o e-mail do Facebook. Verifique as permissões do aplicativo.',
      );
    }

    let usuario = await this.usuariosService.findByEmail(email);

    if (!usuario) {
      const avatarUrl = picture?.data?.url;

      usuario = await this.usuariosService.createSocialUser({
        nome: first_name,
        sobrenome: last_name,
        email,
        avatar_url: avatarUrl,
      });
    }

    const payload = { sub: usuario.id, email: usuario.email };
    const token = this.jwtService.sign(payload);

    return new LoginOutputDto(token, usuario);
  }
}
