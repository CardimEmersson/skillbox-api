import { Usuario } from '../../usuarios/entities/usuario.entity';

type TypeUsuarioLoginOutput = {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  telefone?: string;
  data_nascimento?: Date;
  avatar_url: string;
};

export class LoginOutputDto {
  access_token: string;
  user: TypeUsuarioLoginOutput;

  constructor(token: string, usuario: Usuario) {
    this.access_token = token;
    this.user = {
      id: usuario.id,
      nome: usuario.nome,
      sobrenome: usuario.sobrenome,
      email: usuario.email,
      telefone: usuario.telefone,
      data_nascimento: usuario.dataNascimento,
      avatar_url: usuario.avatar_url
        ? usuario.avatar_url.startsWith('http')
          ? usuario.avatar_url
          : `${process.env.API_URL}/${usuario.avatar_url}`
        : '',
    };
  }
}
