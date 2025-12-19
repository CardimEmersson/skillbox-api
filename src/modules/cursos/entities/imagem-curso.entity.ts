import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Curso } from './curso.entity';

@Entity('imagens_cursos')
export class ImagemCurso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  curso_id: number;

  @ManyToOne(() => Curso, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'curso_id' })
  curso: Curso;

  @Column({ length: 255 })
  imagem_url: string;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploaded_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
