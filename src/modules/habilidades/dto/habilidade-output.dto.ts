import { CategoriaOutputDto } from 'src/modules/categorias/dto/categoria-output.dto';
import { Habilidade } from '../entities/habilidade.entity';

export class HabilidadeOutputDto {
  id: number;
  nome: string;
  icone?: string;
  nivel: string;
  categorias?: Partial<CategoriaOutputDto>[];

  constructor(habilidade: Habilidade) {
    this.id = habilidade.id;
    this.nome = habilidade.nome;
    this.icone = habilidade.icone
      ? `${process.env.API_URL}/${habilidade.icone}`
      : '';
    this.nivel = habilidade.nivel;
    this.categorias = habilidade.categorias?.map(
      (categoria) => new CategoriaOutputDto(categoria.categoria),
    );
  }
}
