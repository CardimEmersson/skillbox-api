import {
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { Meta } from './meta.entity';
import { Habilidade } from '../../habilidades/entities/habilidade.entity';

@Entity('metas_habilidades')
export class MetaHabilidade {
  @PrimaryColumn()
  meta_id: number;

  @PrimaryColumn()
  habilidade_id: number;

  @ManyToOne(() => Meta, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meta_id' })
  meta: Meta;

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
