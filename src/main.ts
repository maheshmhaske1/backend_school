import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);

  // Enable global validation using class-validator
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transforms payload to DTO objects
  }));

  dotenv.config();

  // Enable CORS for all origins
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE',"PATCH"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(5000);
}

bootstrap();
