import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { CategoriaHabilidade } from './categoria-habilidade.entity';

@Entity('categorias')
export class Categoria {
  @ApiProperty({ description: 'ID da categoria' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nome da categoria' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  nome: string;

  @ApiProperty({ description: 'ID do usuário que criou a categoria' })
  @Column({ name: 'usuario_id' })
  usuario_id: number;

  @ManyToOne(() => Usuario, { eager: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @OneToMany(
    () => CategoriaHabilidade,
    (categoriaHabilidade) => categoriaHabilidade.categoria,
  )
  habilidades: CategoriaHabilidade[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at?: Date;
}
