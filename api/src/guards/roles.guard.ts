import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      Array<'admin' | 'operador' | 'visor'>
    >(ROLES_KEY, [ctx.getHandler(), ctx.getClass()]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = ctx.switchToHttp().getRequest();
    const user = request.user as { role?: string };

    return !!user && requiredRoles.includes(user.role as any);
  }
}
