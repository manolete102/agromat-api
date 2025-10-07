import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Fertilizantes' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
