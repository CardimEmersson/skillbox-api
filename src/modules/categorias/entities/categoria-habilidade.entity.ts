import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Categoria } from './categoria.entity';
import { Habilidade } from '../../habilidades/entities/habilidade.entity';

@Entity('categorias_habilidades')
export class CategoriaHabilidade {
  @PrimaryColumn()
  categoria_id: number;

  @PrimaryColumn()
  habilidade_id: number;

  @ManyToOne(() => Categoria, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

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
