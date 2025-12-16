import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @ApiProperty({ description: 'Nome da categoria' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;
}
