import {
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { Projeto } from './projeto.entity';
import { Habilidade } from '../../habilidades/entities/habilidade.entity';

@Entity('projetos_habilidades')
export class ProjetoHabilidade {
  @PrimaryColumn()
  projeto_id: number;

  @PrimaryColumn()
  habilidade_id: number;

  @ManyToOne(() => Projeto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projeto_id' })
  projeto: Projeto;

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
