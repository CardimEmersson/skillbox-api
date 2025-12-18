import { ApiProperty } from '@nestjs/swagger';

export class CategoriaOutputDto {
  @ApiProperty({ description: 'ID da categoria' })
  id: number;

  @ApiProperty({ description: 'Nome da categoria' })
  nome: string;

  constructor(categoria: CategoriaOutputDto) {
    this.id = categoria.id;
    this.nome = categoria.nome;
  }
}
