import { Habilidade } from '../../habilidades/entities/habilidade.entity';

export class ProjetoHabilidadeOutputDto {
  habilidade_id: number;
  nome: string;
  nivel: string;

  constructor(habilidade: Habilidade) {
    this.habilidade_id = habilidade.id;
    this.nome = habilidade.nome;
    this.nivel = habilidade.nivel;
  }
}
