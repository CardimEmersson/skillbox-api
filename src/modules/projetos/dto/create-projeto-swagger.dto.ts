import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TipoProjeto } from '../enums/tipo-projeto.enum';

export class CreateProjetoSwaggerDto {
  @ApiProperty()
  @IsString()
  @MaxLength(150)
  nome: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  periodo_inicial?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  periodo_final?: string;

  @ApiProperty({ enum: TipoProjeto, required: false })
  @IsOptional()
  @IsEnum(TipoProjeto)
  tipo_projeto?: TipoProjeto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: false,
  })
  imagens?: any;
}
