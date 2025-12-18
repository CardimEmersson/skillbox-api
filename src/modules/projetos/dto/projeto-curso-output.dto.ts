import { Curso } from '../../cursos/entities/curso.entity';

export class ProjetoCursoOutputDto {
  curso_id: number;
  nome: string;
  plataforma_instituicao?: string;
  prazo_conclusao?: Date | string;

  constructor(curso: Curso) {
    this.curso_id = curso.id;
    this.nome = curso.nome;
    this.plataforma_instituicao = curso.plataforma_instituicao;
    this.prazo_conclusao = curso.prazo_conclusao;
  }
}
