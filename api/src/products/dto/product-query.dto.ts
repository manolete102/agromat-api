import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductsQueryDto {
  @ApiPropertyOptional({ example: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Texto a buscar en name/description', example: 'fertilizante' })
  @IsOptional() @IsString()
  q?: string;

  @ApiPropertyOptional({ description: 'true | false', example: 'true' })
  @IsOptional() @IsBooleanString()
  onlyActive?: string;

  @ApiPropertyOptional({ description: 'Campo de orden', enum: ['name','price','stock','id'], example: 'name' })
  @IsOptional() @IsIn(['name','price','stock','id'])
  sortBy?: 'name' | 'price' | 'stock' | 'id' = 'id';

  @ApiPropertyOptional({ description: 'Dirección', enum: ['asc','desc'], example: 'asc' })
  @IsOptional() @IsIn(['asc','desc'])
  sortDir?: 'asc' | 'desc' = 'asc';
}
