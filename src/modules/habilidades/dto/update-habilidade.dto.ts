import { ApiProperty } from '@nestjs/swagger';
import { CreateHabilidadeDto } from './create-habilidade.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateHabilidadeDto extends CreateHabilidadeDto {
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return Boolean(value);
  })
  @IsBoolean()
  excluir_imagem?: boolean;
}
