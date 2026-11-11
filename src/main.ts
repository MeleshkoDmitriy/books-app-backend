import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix(config.getOrThrow<string>('HTTP_PREFIX'));
  app.set('trust proxy', 1);
  app.use(helmet());
  app.enableCors({
    origin: config.getOrThrow<string>('HTTP_CORS_ORIGIN'),
  });
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(config.getOrThrow<number>('HTTP_PORT'));
}
await bootstrap();
