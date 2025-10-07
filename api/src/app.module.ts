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
import { ProductsModule } from './products/product.module';

// NUEVO: Categories
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    CategoriesModule, // 👈 agregado
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
