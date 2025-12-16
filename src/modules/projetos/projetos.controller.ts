import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Put,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjetosService } from './projetos.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { User } from '../auth/user.decorator';

@ApiTags('Projetos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projetos')
export class ProjetosController {
  constructor(private readonly projetosService: ProjetosService) {}

  @Post()
  create(@Body() dto: CreateProjetoDto, @User('userId') usuarioId: number) {
    return this.projetosService.create(usuarioId, dto);
  }

  @Get()
  findAll(
    @User('userId') usuarioId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    limit = Math.min(limit, 100);
    return this.projetosService.findAll(usuarioId, { page, limit });
  }

  @Get(':id')
  findById(@Param('id') id: number, @User('userId') usuarioId: number) {
    return this.projetosService.findById(id, usuarioId);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: CreateProjetoDto,
    @User('userId') usuarioId: number,
  ) {
    return this.projetosService.update(id, usuarioId, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @User('userId') usuarioId: number,
  ) {
    return this.projetosService.remove(id, usuarioId);
  }
}
