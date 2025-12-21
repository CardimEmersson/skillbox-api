import { HabilidadeOutputDto } from 'src/modules/habilidades/dto/habilidade-output.dto';
import { Projeto } from '../entities/projeto.entity';
import { ImagemProjetoOutputDto } from './imagem-projeto-output.dto';
import { ProjetoCursoOutputDto } from './projeto-curso-output.dto';

export class ProjetoOutputDto {
  id: number;
  nome: string;
  periodo_inicial?: string;
  periodo_final?: string;
  tipo_projeto: string;
  descricao?: string;
  link?: string;
  imagens: Partial<ImagemProjetoOutputDto>[];
  habilidades: Partial<HabilidadeOutputDto>[];
  cursos: Partial<ProjetoCursoOutputDto>[];

  constructor(projeto: Projeto) {
    this.id = projeto.id;
    this.nome = projeto.nome;
    this.periodo_inicial = projeto.periodo_inicial;
    this.periodo_final = projeto.periodo_final;
    this.tipo_projeto = projeto.tipo_projeto;
    this.descricao = projeto.descricao;
    this.link = projeto.link;
    this.habilidades = projeto.habilidades
      ?.filter((projetoHabilidade) => projetoHabilidade.habilidade)
      ?.map((habilidade) => new HabilidadeOutputDto(habilidade.habilidade));
    this.cursos = projeto.cursos
      ?.filter((cursoProjeto) => cursoProjeto.curso)
      ?.map((curso) => new ProjetoCursoOutputDto(curso.curso));
    this.imagens = projeto.imagens?.map((imagem) => ({
      id: imagem.id,
      imagem_url: `${process.env.API_URL}/${imagem.imagem_url}`,
      uploaded_at: imagem.uploaded_at,
    }));
  }
}
