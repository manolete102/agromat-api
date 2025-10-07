import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';

// Controladores principales
import { AppController } from './app.controller';
import { HealthController } from './health.controller';

// Servicios
import { AppService } from './app.service';

// Módulos existentes
import { UsersModule } from './users.module';
import { AuthModule } from './auth.module';

// 👇 NUEVO: Importa el módulo de productos
import { ProductsModule } from './products/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    UsersModule,
    AuthModule,
    ProductsModule, // 👈 Agregado aquí
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
