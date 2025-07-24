import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import fastifyCors from 'fastify-cors';
import fastifyHelmet from 'fastify-helmet';
import fastifyRateLimit from 'fastify-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );

  // Security middleware
  await app.register(fastifyHelmet);
  await app.register(fastifyCors, {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://yourdomain.com'] 
      : ['http://localhost:3000'],
    credentials: true,
  });
  await app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('B2B SaaS Demo API')
    .setDescription('Full B2B SaaS Demo API with authentication, deals, commissions, and billing')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('organizations', 'Organization management')
    .addTag('deals', 'Deal management and workflow')
    .addTag('commissions', 'Commission calculations')
    .addTag('kpis', 'Key Performance Indicators')
    .addTag('calendar', 'Calendar and availability')
    .addTag('billing', 'Billing and subscriptions')
    .addTag('audit', 'Audit logging')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/docs`);
}

bootstrap(); 