import { HabilidadeOutputDto } from 'src/modules/habilidades/dto/habilidade-output.dto';
import { Meta } from '../entities/meta.entity';

export class MetaOutputDto {
  id: number;
  nome: string;
  descricao?: string;
  prazo_conclusao?: string;
  status: string;
  habilidades?: Partial<HabilidadeOutputDto>[];

  constructor(meta: Meta) {
    this.id = meta.id;
    this.nome = meta.nome;
    this.descricao = meta.descricao;
    this.prazo_conclusao = meta.prazo_conclusao;
    this.status = meta.status;
    this.habilidades = meta.habilidades
      ?.filter((metaHabilidade) => metaHabilidade.habilidade)
      ?.map((habilidade) => new HabilidadeOutputDto(habilidade.habilidade));
  }
}
