import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty() @IsString() @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'user@agromat.test' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8 })
  @IsString() @MinLength(8)
  password: string;

  @ApiProperty({ enum: ['admin', 'operador', 'visor'] })
  @IsIn(['admin', 'operador', 'visor'])
  role: 'admin' | 'operador' | 'visor';
}
