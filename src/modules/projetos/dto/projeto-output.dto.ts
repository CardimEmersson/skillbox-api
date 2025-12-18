import { ImagemProjetoOutputDto } from './imagem-projeto-output.dto';

export class ProjetoOutputDto {
  id: number;
  nome: string;
  periodo_inicial?: string;
  periodo_final?: string;
  tipo_projeto: string;
  descricao?: string;
  link?: string;
  imagens?: ImagemProjetoOutputDto[];

  constructor(partial: Partial<ProjetoOutputDto>) {
    Object.assign(this, partial);
    if (partial.imagens?.length) {
      this.imagens = partial.imagens.map((imagem) => ({
        id: imagem.id,
        imagem_url: `${process.env.API_URL}/${imagem.imagem_url}`,
        uploaded_at: imagem.uploaded_at,
      }));
    }
  }
}
