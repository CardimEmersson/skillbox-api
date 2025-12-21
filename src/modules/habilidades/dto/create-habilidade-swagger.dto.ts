import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { NivelHabilidade } from '../enums/nivel-habilidade.enum';

export class CreateHabilidadeSwaggerDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  nome: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  icone?: any;

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

  @ApiProperty({
    required: false,
    type: [Number],
    description: 'Array de IDs de projetos a serem associadas a habilidade.',
  })
  @IsOptional()
  @IsArray()
  @IsNumberString({}, { each: true })
  projetos?: (number | string)[];

  @ApiProperty({
    required: false,
    type: [Number],
    description: 'Array de IDs de cursos a serem associadas a habilidade.',
  })
  @IsOptional()
  @IsArray()
  @IsNumberString({}, { each: true })
  cursos?: (number | string)[];
}
