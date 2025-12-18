import { HabilidadeOutputDto } from '../../habilidades/dto/habilidade-output.dto';
import { Curso } from '../entities/curso.entity';

export class CursoOutputDto {
  id: number;
  nome: string;
  plataforma_instituicao?: string;
  prazo_conclusao?: string;
  em_andamento: boolean;
  instructor?: string;
  carga_horaria?: number;
  link?: string;
  habilidades?: Partial<HabilidadeOutputDto>[];

  constructor(curso: Curso) {
    this.id = curso.id;
    this.nome = curso.nome;
    this.plataforma_instituicao = curso.plataforma_instituicao;
    this.prazo_conclusao = curso.prazo_conclusao;
    this.em_andamento = curso.em_andamento;
    this.carga_horaria = curso.carga_horaria;
    this.instructor = curso.instructor;
    this.link = curso.link;
    this.habilidades = curso.habilidades.map(
      (habilidade) => new HabilidadeOutputDto(habilidade.habilidade),
    );
  }
}
