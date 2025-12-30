import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { NivelFormacao } from '../enums/nivel-formacao.enum';
import { Exclude, Expose } from 'class-transformer';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 100 })
  sobrenome: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  telefone?: string;

  @Column({ type: 'date', nullable: true })
  dataNascimento?: Date;

  @Exclude()
  @Column({ length: 255, nullable: true })
  avatar_url?: string;

  @Expose()
  get avatar(): string | null {
    if (!this.avatar_url) return null;
    return this.avatar_url.startsWith('http')
      ? this.avatar_url
      : `${process.env.API_URL}/${this.avatar_url}`;
  }

  @Column({ length: 255, nullable: true })
  bio?: string;

  @Exclude()
  @Column({ length: 255 })
  senha: string;

  @Column({ length: 100, nullable: true })
  localizacao?: string;

  @Column({
    type: 'enum',
    enum: NivelFormacao,
    default: NivelFormacao.FUNDAMENTAL,
  })
  nivel_formacao: NivelFormacao;

  @Column({ length: 255, nullable: true })
  instituicao?: string;

  @Column({ length: 255, nullable: true })
  objetivo_profissional?: string;

  @Column({ length: 255, nullable: true })
  area_interesse?: string;

  @Column({ length: 255, nullable: true })
  linkedin?: string;

  @Column({ length: 255, nullable: true })
  github?: string;

  @Column({ length: 255, nullable: true })
  site?: string;

  @Column({ default: false })
  email_confirmado: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  token_confirmacao?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  token_recuperacao_senha?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at?: Date;
}
