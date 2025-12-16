import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { TipoProjeto } from '../enums/tipo-projeto.enum';

@Entity('projetos')
export class Projeto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario_id: number;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ length: 150 })
  nome: string;

  @Column({ type: 'date', nullable: true })
  periodo_inicial?: string;

  @Column({ type: 'date', nullable: true })
  periodo_final?: string;

  @Column({
    type: 'enum',
    enum: TipoProjeto,
    default: TipoProjeto.APRENDIZADO,
  })
  tipo_projeto: TipoProjeto;

  @Column({ length: 255, nullable: true })
  descricao?: string;

  @Column({ length: 255, nullable: true })
  link?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
