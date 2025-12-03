import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AuthService } from './modules/auth/auth.service';
import { HttpAdapterHost } from '@nestjs/core';
import helmet from 'helmet';
import compression from 'compression';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // Buffer logs until Pino is ready
  });

  // Use Pino logger
  app.useLogger(app.get(Logger));

  // Security: Helmet middleware for security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  }));

  // Performance: Response compression
  app.use(compression());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter with httpAdapterHost
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  // Seed admin user on startup (only if no users exist)
  try {
    const authService = app.get(AuthService);
    await authService.seedAdminUser();
  } catch (error) {
    app.get(Logger).error('Failed to seed admin user:', error);
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);

  app.get(Logger).log(`🚀 Server running on http://localhost:${port}`);
  app.get(Logger).log(`📊 Health check: http://localhost:${port}/health`);
  app.get(Logger).log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();
