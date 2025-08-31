import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SECRET_SERVICE_TOKEN } from '@/domain/services/secret.service.interface';
import { ISecretService } from '@/domain/services/secret.service.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get SecretService for configuration
  const secretService = app.get<ISecretService>(SECRET_SERVICE_TOKEN);

  // Enable CORS using SecretService
  const corsConfig = secretService.getCorsConfig();
  app.enableCors({
    origin: corsConfig.origins,
    methods: corsConfig.methods,
    allowedHeaders: corsConfig.allowedHeaders,
    credentials: corsConfig.credentials,
    maxAge: corsConfig.maxAge,
  });

  const port = secretService.getNumber('PORT');
  await app.listen(port);
}
bootstrap();
