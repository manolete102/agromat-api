import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from './users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard'; // <---

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET') ?? 'dev_fallback_secret',
        signOptions: { expiresIn: cfg.get<string>('JWT_EXPIRES') ?? '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard], // <---
  exports: [AuthService],
})
export class AuthModule {}
