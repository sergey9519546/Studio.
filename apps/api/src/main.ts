import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AuthService } from './modules/auth/auth.service';
import { HttpAdapterHost } from '@nestjs/core';
import helmet from 'helmet';
import compression from 'compression';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  console.log('🚀 Starting bootstrap...');
  const app = await NestFactory.create(AppModule, {
    // bufferLogs: true, // Buffer logs until Pino is ready - TEMPORARILY DISABLED
  });
  console.log('✅ NestFactory.create completed');

  // Use Pino logger for structured logging
  app.useLogger(app.get(Logger));

  // Security: Helmet middleware for security headers with STRICT CSP
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // Required for some UI frameworks - REVIEW AND REMOVE IF POSSIBLE
          'https://fonts.googleapis.com', // Required for Google Fonts
        ],
        fontSrc: [
          "'self'",
          'https://fonts.gstatic.com', // Required for Google Fonts
          'data:', // Required for base64 encoded fonts
        ],
        scriptSrc: [
          "'self'",
          // Remove unsafe external CDNs for production
          ...(process.env.NODE_ENV !== 'production' ? ['https://cdn.tailwindcss.com'] : []),
        ],
        imgSrc: [
          "'self'",
          'data:', // Required for base64 images
          'https:', // Required for external images (profiles, assets, etc.)
        ],
        connectSrc: [
          "'self'",
          // Add any external APIs your app needs to connect to
          'https://*.googleapis.com', // For Google APIs
        ],
        upgradeInsecureRequests: [], // Force HTTPS in production
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
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

  // CORS configuration - STRICT MODE: Only allow specific origins in production
  const corsOrigins = process.env.NODE_ENV === 'production'
    ? (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400, // 24 hours
  });

  // Enable API versioning (URI-based, e.g., /v1/endpoint)
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
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
