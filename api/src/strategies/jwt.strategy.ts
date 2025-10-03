import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

type JwtPayload = { sub: number; email: string; role: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.get<string>('JWT_SECRET') ?? 'dev_fallback_secret',
    });
  }

  async validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
