import { Logger as NestLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import 'reflect-metadata';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { AuthService } from './modules/auth/auth.service.js';

async function bootstrap() {
  const bootstrapLogger = new NestLogger('Bootstrap');
  bootstrapLogger.log('Boot: starting Nest application...');
  const app = await NestFactory.create(AppModule, {
    // bufferLogs: true, // Buffer logs until Pino is ready - TEMPORARILY DISABLED
  });
  bootstrapLogger.log('Boot: NestFactory.create completed');

  // Set global API prefix so routes resolve at /api/v1/*
  app.setGlobalPrefix('api');

  // Use Pino logger for structured logging
  app.useLogger(app.get(Logger));

  // Debug: Log NODE_ENV and CSP configuration
  bootstrapLogger.log(`Boot: NODE_ENV: ${process.env.NODE_ENV}`);
  bootstrapLogger.log(`Boot: CSP Development Mode: ${process.env.NODE_ENV !== 'production'}`);

  // Security: Helmet middleware for security headers with STRICT CSP
  app.use(
    helmet({
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
            // Allow inline scripts and external CDNs for development (React/Vite requirement)
            ...(process.env.NODE_ENV !== 'production'
              ? ["'unsafe-inline'", "'unsafe-eval'", 'https://cdn.tailwindcss.com']
              : []),
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
    }),
  );

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
  const corsOrigins =
    process.env.NODE_ENV === 'production'
      ? process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : []
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

  // Seed admin user (opt-in for production)
  const shouldSeedAdmin =
    process.env.SEED_ADMIN_ON_BOOT === 'true' ||
    (process.env.NODE_ENV !== 'production' &&
      process.env.ADMIN_PASSWORD &&
      process.env.ADMIN_EMAIL);

  if (shouldSeedAdmin) {
    try {
      const authService = app.get(AuthService);
      // Non-blocking: run in background
      authService.seedAdminUser().catch((error) => {
        bootstrapLogger.error('Failed to seed admin user in background:', error instanceof Error ? error.stack : String(error));
      });
    } catch (error) {
      bootstrapLogger.error('Failed to initiate admin user seeding:', error instanceof Error ? error.stack : String(error));
    }
  } else {
    bootstrapLogger.log('Admin seed skipped (production without opt-in or missing credentials).');
  }

  const port = parseInt(process.env.PORT || '3001', 10);
  await app.listen(port, '0.0.0.0');

  bootstrapLogger.log(`Server running on http://0.0.0.0:${port}`);
  bootstrapLogger.log(`Health check: http://0.0.0.0:${port}/health`);
  bootstrapLogger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Enable graceful shutdown
  app.enableShutdownHooks();

  // Handle shutdown signals
  const shutdown = async (signal: string) => {
    bootstrapLogger.log(`Received ${signal}, starting graceful shutdown`);

    try {
      await app.close();
      bootstrapLogger.log('Application closed successfully');
      process.exit(0);
    } catch (error) {
      bootstrapLogger.error('Error during shutdown', error instanceof Error ? error.stack : String(error));
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap();
