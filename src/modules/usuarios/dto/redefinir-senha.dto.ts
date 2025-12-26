import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RedefinirSenhaDto {
  @ApiProperty({
    example: 'usuario@email.com',
    description: 'E-mail do usuário',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: 'Código de recuperação' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: 'NovaSenha123',
    description: 'Nova senha do usuário',
  })
  @IsString()
  @MinLength(6)
  novaSenha: string;
}
