import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
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
}
