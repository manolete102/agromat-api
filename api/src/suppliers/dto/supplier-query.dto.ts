import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';

export class SupplierQueryDto {
  @ApiPropertyOptional({ example: '1' })
  @IsNumberString()
  @IsOptional()
  page?: string;

  @ApiPropertyOptional({ example: '10' })
  @IsNumberString()
  @IsOptional()
  limit?: string;

  @ApiPropertyOptional({ example: 'agro' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({ example: 'true', description: 'Solo activos' })
  @IsBooleanString()
  @IsOptional()
  onlyActive?: string;
}
