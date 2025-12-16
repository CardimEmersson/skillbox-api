import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';

@ApiTags('Cursos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cursos')
export class CursosController {
  constructor(private readonly cursoService: CursosService) {}

  @Post()
  create(@Body() dto: CreateCursoDto, @User('userId') usuarioId: number) {
    return this.cursoService.create(usuarioId, dto);
  }

  @Get()
  findAll(
    @User('userId') usuarioId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    limit = Math.min(limit, 100);
    return this.cursoService.findAll(usuarioId, { page, limit });
  }

  @Get(':id')
  findById(@Param('id') id: number, @User('userId') usuarioId: number) {
    return this.cursoService.findById(id, usuarioId);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: CreateCursoDto,
    @User('userId') usuarioId: number,
  ) {
    return this.cursoService.update(id, usuarioId, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @User('userId') usuarioId: number,
  ) {
    return this.cursoService.remove(id, usuarioId);
  }
}
