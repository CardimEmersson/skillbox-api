import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoProjeto } from '../enums/tipo-projeto.enum';

export class CreateProjetoDto {
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
}
