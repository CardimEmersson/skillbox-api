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
import { CursoHabilidade } from './curso-habilidade.entity';
import { ProjetoCurso } from '../../projetos/entities/projeto-curso.entity';

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario_id: number;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ length: 150 })
  nome: string;

  @Column({ length: 100, nullable: true })
  plataforma_instituicao?: string;

  @Column({ type: 'date', nullable: true })
  prazo_conclusao?: string;

  @Column({ default: false })
  em_andamento: boolean;

  @Column({ length: 100, nullable: true })
  instructor?: string;

  @Column({ type: 'int', nullable: true, comment: 'Duração em horas' })
  carga_horaria?: number;

  @Column({ length: 255, nullable: true })
  link?: string;

  @OneToMany(
    () => CursoHabilidade,
    (cursoHabilidade) => cursoHabilidade.curso,
    {
      cascade: true,
    },
  )
  habilidades: CursoHabilidade[];

  @OneToMany(() => ProjetoCurso, (projetoCurso) => projetoCurso.curso, {
    cascade: true,
  })
  projetos: ProjetoCurso[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
