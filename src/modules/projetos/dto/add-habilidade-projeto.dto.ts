import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddHabilidadeProjetoDto {
  @ApiProperty()
  @IsInt()
  habilidade_id: number;
}
