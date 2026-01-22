import { CategoriaOutputDto } from 'src/modules/categorias/dto/categoria-output.dto';
import { Habilidade } from '../entities/habilidade.entity';
import { ProjetoOutputDto } from 'src/modules/projetos/dto/projeto-output.dto';
import { CursoOutputDto } from 'src/modules/cursos/dto/curso-output.dto';

export class HabilidadeOutputDto {
  id: number;
  nome: string;
  icone?: string;
  nivel: string;
  categorias?: Partial<CategoriaOutputDto>[];
  projetos?: Partial<ProjetoOutputDto>[];
  cursos?: Partial<CursoOutputDto>[];

  constructor(habilidade: Habilidade) {
    this.id = habilidade.id;
    this.nome = habilidade.nome;
    this.icone = habilidade.icone;
    this.nivel = habilidade.nivel;
    this.categorias = habilidade.categorias
      ?.filter((categoriaHabilidade) => categoriaHabilidade.categoria)
      ?.map((categoria) => new CategoriaOutputDto(categoria.categoria));
    this.projetos = habilidade.projetos
      ?.filter((projetoHabilidade) => projetoHabilidade.projeto)
      ?.map((projeto) => new ProjetoOutputDto(projeto.projeto));
    this.cursos = habilidade.cursos
      ?.filter((cursoHabilidade) => cursoHabilidade.curso)
      ?.map((cursoHabilidade) => new CursoOutputDto(cursoHabilidade.curso));
  }
}
