import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { StatusMeta } from '../enums/status-meta.enum';
import { MetaHabilidade } from './meta-habilidade.entity';

@Entity('metas')
export class Meta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario_id: number;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ length: 150 })
  nome: string;

  @Column({ length: 255, nullable: true })
  descricao?: string;

  @Column({ type: 'date', nullable: true })
  prazo_conclusao?: string;

  @Column({
    type: 'enum',
    enum: StatusMeta,
    default: StatusMeta.PLANEJADO,
  })
  status: StatusMeta;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @OneToMany(() => MetaHabilidade, (metaHabilidade) => metaHabilidade.meta, {
    cascade: true,
  })
  habilidades: MetaHabilidade[];
}
