import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty() @IsString() @IsNotEmpty()
  name: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  description?: string;

  @ApiProperty() @Type(() => Number) @IsNumber() @Min(0)
  price: number;

  @ApiProperty() @Type(() => Number) @IsNumber() @Min(0)
  stock: number;
}
