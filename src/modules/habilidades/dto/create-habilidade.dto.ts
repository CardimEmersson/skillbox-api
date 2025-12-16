import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
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
}
