import {
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  IsArray,
  IsNumberString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NivelHabilidade } from '../enums/nivel-habilidade.enum';

export class CreateHabilidadeDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  nome: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icone?: string;

  @ApiProperty({ enum: NivelHabilidade, required: false })
  @IsOptional()
  @IsEnum(NivelHabilidade)
  nivel?: NivelHabilidade;

  @ApiProperty({
    required: false,
    type: [Number],
    description: 'Array de IDs de categorias a serem associadas a habilidade.',
  })
  @IsOptional()
  @IsArray()
  @IsNumberString({}, { each: true })
  categorias?: (number | string)[];
}
