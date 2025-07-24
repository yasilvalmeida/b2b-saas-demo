import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration - Allow all origins for educational purposes
  app.enableCors({
    origin: true,
    credentials: true,
  });

  console.log('🔧 CORS enabled with origin: true');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('B2B SaaS Demo API')
    .setDescription(
      'Full B2B SaaS Demo API with authentication, deals, commissions, and billing'
    )
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

  const port = process.env.PORT || 4001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/docs`);
}

bootstrap();
