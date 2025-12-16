import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateCategoriaDto, @User('userId') usuarioId: number) {
    return this.categoriasService.create(dto, usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@User('userId') usuarioId: number) {
    return this.categoriasService.findAll(usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: number, @User('userId') usuarioId: number) {
    return this.categoriasService.findById(id, usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateCategoriaDto,
    @User('userId') usuarioId: number,
  ) {
    return this.categoriasService.update(id, usuarioId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @User('userId') usuarioId: number) {
    return this.categoriasService.remove(id, usuarioId);
  }
}
