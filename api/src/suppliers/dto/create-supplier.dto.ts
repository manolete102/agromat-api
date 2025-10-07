import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({ example: 'AgroProveedora SA' })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'ventas@agroproveedora.test', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+52 55 1234 5678', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  phone?: string;

  @ApiProperty({ example: 'Av. Siempre Viva 123, CDMX', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(180)
  address?: string;
}
