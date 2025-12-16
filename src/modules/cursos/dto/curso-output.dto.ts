export class CursoOutputDto {
  id: number;
  nome: string;
  plataforma_instituicao?: string;
  prazo_conclusao?: string;
  em_andamento: boolean;
  instructor?: string;
  carga_horaria?: number;
  link?: string;
}
