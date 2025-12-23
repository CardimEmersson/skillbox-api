import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habilidade } from '../habilidades/entities/habilidade.entity';
import { Curso } from '../cursos/entities/curso.entity';
import { Meta } from '../metas/entities/meta.entity';
import { Projeto } from '../projetos/entities/projeto.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Habilidade)
    private readonly habilidadesRepository: Repository<Habilidade>,
    @InjectRepository(Curso)
    private readonly cursosRepository: Repository<Curso>,
    @InjectRepository(Meta)
    private readonly metasRepository: Repository<Meta>,
    @InjectRepository(Projeto)
    private readonly projetosRepository: Repository<Projeto>,
  ) {}

  async getDashboard(usuarioId: number) {
    const [habilidades, cursos, metas, projetos] = await Promise.all([
      this.habilidadesRepository.count({
        where: { usuario_id: usuarioId },
      }),
      this.cursosRepository.count({
        where: { usuario_id: usuarioId },
      }),
      this.metasRepository.count({
        where: { usuario_id: usuarioId },
      }),
      this.projetosRepository.count({
        where: { usuario_id: usuarioId },
      }),
    ]);

    return {
      habilidades,
      cursos,
      metas,
      projetos,
    };
  }
}
