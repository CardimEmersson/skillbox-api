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
import { NivelHabilidade } from '../enums/nivel-habilidade.enum';
import { Exclude, Expose } from 'class-transformer';
import { ProjetoHabilidade } from '../../projetos/entities/projeto-habilidade.entity';
import { MetaHabilidade } from '../../metas/entities/meta-habilidade.entity';

@Entity('habilidades')
export class Habilidade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario_id: number;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Exclude()
  @Column({ length: 255, nullable: true })
  icone?: string;

  @Expose()
  get icone_url(): string | null {
    if (!this.icone) return null;
    return `${process.env.API_URL}/${this.icone}`;
  }

  @Column({
    type: 'enum',
    enum: NivelHabilidade,
    default: NivelHabilidade.INICIANTE,
  })
  nivel: NivelHabilidade;

  @Column({ length: 100 })
  nome: string;

  @OneToMany(
    () => ProjetoHabilidade,
    (projetoHabilidade) => projetoHabilidade.habilidade,
  )
  projetos: ProjetoHabilidade[];

  @OneToMany(
    () => MetaHabilidade,
    (metaHabilidade) => metaHabilidade.habilidade,
  )
  metas: MetaHabilidade[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
