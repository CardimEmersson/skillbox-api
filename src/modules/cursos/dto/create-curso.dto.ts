import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsInt,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCursoDto {
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
}
