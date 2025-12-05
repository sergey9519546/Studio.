import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AuthService } from './modules/auth/auth.service';
import { HttpAdapterHost } from '@nestjs/core';
import helmet from 'helmet';
import compression from 'compression';
// import { Logger } from 'nestjs-pino'; // TEMPORARILY DISABLED

async function bootstrap() {
  console.log('🚀 Starting bootstrap...');
  const app = await NestFactory.create(AppModule, {
    // bufferLogs: true, // Buffer logs until Pino is ready - TEMPORARILY DISABLED
  });
  console.log('✅ NestFactory.create completed');

  // Use Pino logger - TEMPORARILY DISABLED to diagnose startup issue
  // app.useLogger(app.get(Logger));

  // Security: Helmet middleware for security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
        ],
        fontSrc: [
          "'self'",
          'https://fonts.gstatic.com',
          'data:',
        ],
        scriptSrc: [
          "'self'",
          'https://cdn.tailwindcss.com',
        ],
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
  // const pinoLogger = app.get(Logger); // TEMPORARILY DISABLED
  // Seed admin user in background (don't await)
  try {
    const authService = app.get(AuthService);
    // Non-blocking: run in background
    authService.seedAdminUser().catch(error => {
      console.error('Failed to seed admin user in background:', error);
    });
  } catch (error) {
    console.error('Failed to initiate admin user seeding:', error);
  }

  const port = parseInt(process.env.PORT || '3001', 10);
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
  console.log(`📊 Health check: http://0.0.0.0:${port}/health`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);

  // Enable graceful shutdown
  app.enableShutdownHooks();

  // Handle shutdown signals
  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}, starting graceful shutdown`);

    try {
      await app.close();
      console.log('Application closed successfully');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown', error);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap();
