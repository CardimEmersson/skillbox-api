import {
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { Curso } from './curso.entity';
import { Habilidade } from '../../habilidades/entities/habilidade.entity';

@Entity('cursos_habilidades')
export class CursoHabilidade {
  @PrimaryColumn()
  curso_id: number;

  @PrimaryColumn()
  habilidade_id: number;

  @ManyToOne(() => Curso, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'curso_id' })
  curso: Curso;

  @ManyToOne(() => Habilidade, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habilidade_id' })
  habilidade: Habilidade;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
