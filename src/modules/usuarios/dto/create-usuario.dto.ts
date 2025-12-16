/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { NivelFormacao } from '../enums/nivel-formacao.enum';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Nome do usuário' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @ApiProperty({ description: 'Sobrenome do usuário' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sobrenome: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Telefone do usuário' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefone?: string;

  @ApiProperty({ description: 'Data de nascimento do usuário' })
  @IsOptional()
  @IsDateString()
  dataNascimento?: string;

  @ApiProperty({ description: 'Imagem do usuário' })
  @IsOptional()
  @IsString()
  avatar_url?: string;

  @ApiProperty({ description: 'Bio do usuário' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  @MinLength(6)
  senha: string;

  @ApiProperty({ description: 'Localização do usuário' })
  @IsOptional()
  @IsString()
  localizacao?: string;

  @ApiProperty({ description: 'Nivel formação do usuário' })
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(NivelFormacao)
  nivel_formacao?: NivelFormacao;

  @ApiProperty({ description: 'Instituição do usuário' })
  @IsOptional()
  @IsString()
  instituicao?: string;

  @ApiProperty({ description: 'Objetivo profissional do usuário' })
  @IsOptional()
  @IsString()
  objetivo_profissional?: string;

  @ApiProperty({ description: 'Area de interesse do usuário' })
  @IsOptional()
  @IsString()
  area_interesse?: string;

  @ApiProperty({ description: 'Linkedin do usuário' })
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiProperty({ description: 'Github do usuário' })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiProperty({ description: 'Site do usuário' })
  @IsOptional()
  @IsString()
  site?: string;
}
