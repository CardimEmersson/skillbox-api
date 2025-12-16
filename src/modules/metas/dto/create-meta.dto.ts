import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StatusMeta } from '../enums/status-meta.enum';

export class CreateMetaDto {
  @ApiProperty()
  @IsString()
  @MaxLength(150)
  nome: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  prazo_conclusao?: string;

  @ApiProperty({ enum: StatusMeta, required: false })
  @IsOptional()
  @IsEnum(StatusMeta)
  status?: StatusMeta;
}
