import { HabilidadeOutputDto } from 'src/modules/habilidades/dto/habilidade-output.dto';
import { ImagemProjetoOutputDto } from './imagem-projeto-output.dto';
import { Projeto } from '../entities/projeto.entity';

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

  constructor(projeto: Projeto) {
    this.id = projeto.id;
    this.nome = projeto.nome;
    this.periodo_inicial = projeto.periodo_inicial;
    this.periodo_final = projeto.periodo_final;
    this.tipo_projeto = projeto.tipo_projeto;
    this.descricao = projeto.descricao;
    this.link = projeto.link;
    this.habilidades = projeto.habilidades?.map((habilidade) => ({
      id: habilidade?.habilidade?.id,
      nome: habilidade?.habilidade?.nome,
      icone_url: habilidade?.habilidade?.icone_url,
      nivel: habilidade?.habilidade?.nivel,
    }));
    this.imagens = projeto.imagens?.map((imagem) => ({
      id: imagem.id,
      imagem_url: `${process.env.API_URL}/${imagem.imagem_url}`,
      uploaded_at: imagem.uploaded_at,
    }));
  }
}
