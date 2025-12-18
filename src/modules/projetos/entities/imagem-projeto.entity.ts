import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Projeto } from './projeto.entity';

@Entity('imagens_projetos')
export class ImagemProjeto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'projeto_id' })
  projeto_id: number;

  @Column({ name: 'imagem_url', length: 255 })
  imagem_url: string;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploaded_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  @ManyToOne(() => Projeto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projeto_id' })
  projeto: Projeto;
}
