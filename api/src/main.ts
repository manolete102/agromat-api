import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cfg = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = cfg.get<number>('app.port') ?? 3000;
  const prefix = cfg.get<string>('app.prefix') ?? '/api/v1';
  app.setGlobalPrefix(prefix);
  setupSwagger(app);

  await app.listen(port);
  console.log(`✅ API: http://localhost:${port}${prefix}`);
  console.log(`📘 Swagger: http://localhost:${port}/docs`);
}
bootstrap();
