import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({ enum: ['admin', 'operador', 'visor'] })
  @IsIn(['admin', 'operador', 'visor'])
  role: 'admin' | 'operador' | 'visor';
}
