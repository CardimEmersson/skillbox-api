import { ApiProperty } from '@nestjs/swagger';
import { NivelFormacao } from '../enums/nivel-formacao.enum';

export class CreateUsuarioSwaggerDto {
  @ApiProperty({ example: 'Fulano' })
  nome: string;

  @ApiProperty({ example: 'Silva' })
  sobrenome: string;

  @ApiProperty({ example: 'fulano@email.com' })
  email: string;

  @ApiProperty({ required: false })
  telefone?: string;

  @ApiProperty({ required: false, example: '1990-01-01' })
  dataNascimento?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  avatar?: any;

  @ApiProperty({ required: false })
  bio?: string;

  @ApiProperty({ example: '123456' })
  senha: string;

  @ApiProperty({ required: false })
  localizacao?: string;

  @ApiProperty({
    required: false,
    enum: NivelFormacao,
    example: NivelFormacao.GRADUACAO,
  })
  nivel_formacao?: NivelFormacao;

  @ApiProperty({ required: false })
  instituicao?: string;

  @ApiProperty({ required: false })
  objetivo_profissional?: string;

  @ApiProperty({ required: false })
  area_interesse?: string;

  @ApiProperty({ required: false })
  linkedin?: string;

  @ApiProperty({ required: false })
  github?: string;

  @ApiProperty({ required: false })
  site?: string;
}
