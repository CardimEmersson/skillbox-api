import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Projeto } from './projeto.entity';
import { Curso } from '../../cursos/entities/curso.entity';

@Entity('projetos_cursos')
export class ProjetoCurso {
  @PrimaryColumn()
  projeto_id: number;

  @PrimaryColumn()
  curso_id: number;

  @ManyToOne(() => Projeto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projeto_id' })
  projeto: Projeto;

  @ManyToOne(() => Curso, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'curso_id' })
  curso: Curso;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
