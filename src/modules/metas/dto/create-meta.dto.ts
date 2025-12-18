import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
  IsArray,
  IsNumberString,
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

  @ApiProperty({
    required: false,
    type: [Number],
    description: 'Array de IDs de habilidades a serem associadas a meta.',
  })
  @IsOptional()
  @IsArray()
  @IsNumberString({}, { each: true })
  habilidades?: (number | string)[];
}
