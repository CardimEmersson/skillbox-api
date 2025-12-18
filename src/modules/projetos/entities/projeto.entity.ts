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
import { TipoProjeto } from '../enums/tipo-projeto.enum';
import { ImagemProjeto } from './imagem-projeto.entity';
import { ProjetoHabilidade } from './projeto-habilidade.entity';
import { ProjetoCurso } from './projeto-curso.entity';

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

  @OneToMany(() => ImagemProjeto, (imagem) => imagem.projeto, { cascade: true })
  imagens: ImagemProjeto[];

  @OneToMany(
    () => ProjetoHabilidade,
    (projetoHabilidade) => projetoHabilidade.projeto,
    { cascade: true },
  )
  habilidades: ProjetoHabilidade[];

  @OneToMany(() => ProjetoCurso, (projetoCurso) => projetoCurso.projeto, {
    cascade: true,
  })
  cursos: ProjetoCurso[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
