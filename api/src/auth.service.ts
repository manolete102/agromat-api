import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    console.log('[AuthService.validateUser] login attempt:', email);

    const user = await this.users.findByEmail(email);
    if (!user) {
      console.log('[AuthService.validateUser] user not found');
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const ok = await this.users.validatePassword(password?.trim(), user.passwordHash);
    if (!ok) {
      console.log('[AuthService.validateUser] bad password');
      throw new UnauthorizedException('Credenciales inválidas');
    }

    console.log('[AuthService.validateUser] login success:', user.email);
    return user;
  }

  async login(user: { id: number; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    console.log('[AuthService.login] issuing token for:', payload);

    return { access_token: this.jwt.sign(payload) };
  }
}
