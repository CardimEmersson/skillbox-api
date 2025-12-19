import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsInt,
  MaxLength,
  IsArray,
  IsNumberString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCursoDto {
  @ApiProperty()
  @IsString()
  @MaxLength(150)
  nome: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  plataforma_instituicao?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  prazo_conclusao?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  em_andamento?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  instructor?: string;

  @ApiProperty({ required: false, description: 'Carga horária em horas' })
  @IsOptional()
  @IsInt()
  carga_horaria?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({
    required: false,
    type: [Number],
    description: 'Array de IDs de habilidades a serem associadas ao curso.',
  })
  @IsOptional()
  @IsArray()
  @IsNumberString({}, { each: true })
  habilidades?: (number | string)[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsNumberString({}, { each: true })
  editar_imagens_ids?: (number | string)[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsNumberString({}, { each: true })
  excluir_imagens_ids?: (number | string)[];
}
