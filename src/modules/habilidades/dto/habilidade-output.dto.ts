import { Habilidade } from '../entities/habilidade.entity';

export class HabilidadeOutputDto {
  id: number;
  nome: string;
  icone?: string;
  nivel: string;

  constructor(habilidade: Habilidade) {
    this.id = habilidade.id;
    this.nome = habilidade.nome;
    this.icone = habilidade.icone;
    this.nivel = habilidade.nivel;
  }
}
