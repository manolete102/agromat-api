import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from './users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule, // para usar ConfigService aquí
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (cfg: ConfigService) => {
        const secret = cfg.get<string>('JWT_SECRET');
        if (!secret) {
          console.warn('[AuthModule] JWT_SECRET no está definido. Usando fallback de desarrollo.');
        }
        return {
          secret: secret ?? 'dev_fallback_secret',
          signOptions: { expiresIn: cfg.get<string>('JWT_EXPIRES') ?? '7d' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
