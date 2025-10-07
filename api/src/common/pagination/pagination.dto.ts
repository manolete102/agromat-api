import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PageQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

export class PageMeta {
  @ApiPropertyOptional()
  page: number;

  @ApiPropertyOptional()
  limit: number;

  @ApiPropertyOptional()
  total: number;

  @ApiPropertyOptional()
  pageCount: number;
}

export class PageDto<T> {
  data: T[];
  meta: PageMeta;
}
