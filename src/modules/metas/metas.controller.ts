import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MetasService } from './metas.service';
import { CreateMetaDto } from './dto/create-meta.dto';
import { User } from '../auth/user.decorator';

@ApiTags('Metas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('metas')
export class MetasController {
  constructor(private readonly metasService: MetasService) {}

  @Post()
  create(@Body() dto: CreateMetaDto, @User('userId') usuarioId: number) {
    return this.metasService.create(usuarioId, dto);
  }

  @Get()
  findAll(
    @User('userId') usuarioId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    limit = Math.min(limit, 100);
    return this.metasService.findAll(usuarioId, { page, limit });
  }

  @Get(':id')
  findById(@Param('id') id: number, @User('userId') usuarioId: number) {
    return this.metasService.findById(id, usuarioId);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: CreateMetaDto,
    @User('userId') usuarioId: number,
  ) {
    return this.metasService.update(id, usuarioId, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @User('userId') usuarioId: number,
  ) {
    return this.metasService.remove(id, usuarioId);
  }
}
