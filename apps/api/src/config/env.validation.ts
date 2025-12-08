
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from "class-validator";

enum Environment {
  Development = "development",
  Production = "production",
  Test = "test",
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsString()
  DATABASE_URL!: string;

  @IsString()
  JWT_SECRET!: string;

  @IsOptional()
  @IsString()
  ADMIN_EMAIL?: string;

  @IsOptional()
  @IsString()
  ADMIN_PASSWORD?: string;

  // GCP_PROJECT_ID is optional - can fall back to GOOGLE_CLOUD_PROJECT (set by Cloud Run)
  @IsOptional()
  @IsString()
  GCP_PROJECT_ID?: string;

  // GOOGLE_CLOUD_PROJECT is set automatically on Cloud Run/Cloud Functions
  @IsOptional()
  @IsString()
  GOOGLE_CLOUD_PROJECT?: string;

  @IsOptional()
  @IsString()
  GCP_LOCATION?: string;

  @IsOptional()
  @IsString()
  GCP_CLIENT_EMAIL?: string;

  @IsOptional()
  @IsString()
  GCP_PRIVATE_KEY?: string;

  @IsOptional()
  @IsString()
  GOOGLE_APPLICATION_CREDENTIALS?: string;

  // STORAGE_BUCKET is optional - defaults to project-assets
  @IsOptional()
  @IsString()
  STORAGE_BUCKET?: string;

  @IsOptional()
  @IsString()
  ALLOWED_ORIGINS?: string;

  @IsOptional()
  @IsString()
  FRONTEND_URL?: string;

  // PORT is optional - Cloud Run sets this to 8080
  @IsOptional()
  @IsNumber()
  PORT?: number;
}

export function validate(config: Record<string, unknown>) {
  // Fall back GCP_PROJECT_ID to GOOGLE_CLOUD_PROJECT (set by Cloud Run)
  if (!config.GCP_PROJECT_ID && config.GOOGLE_CLOUD_PROJECT) {
    config.GCP_PROJECT_ID = config.GOOGLE_CLOUD_PROJECT;
  }

  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const validationErrors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  const projectId =
    validatedConfig.GCP_PROJECT_ID || validatedConfig.GOOGLE_CLOUD_PROJECT;

  const missingRequired: string[] = [];
  if (!validatedConfig.DATABASE_URL) missingRequired.push("DATABASE_URL");
  if (!validatedConfig.JWT_SECRET) missingRequired.push("JWT_SECRET");
  if (!validatedConfig.ADMIN_EMAIL) missingRequired.push("ADMIN_EMAIL");
  if (!validatedConfig.ADMIN_PASSWORD) missingRequired.push("ADMIN_PASSWORD");
  if (!projectId)
    missingRequired.push("GCP_PROJECT_ID or GOOGLE_CLOUD_PROJECT");

  if (missingRequired.length || validationErrors.length) {
    const details = [
      ...missingRequired.map((v) => `Missing env: ${v}`),
      ...validationErrors.map((e) => e.toString()),
    ].join("; ");
    throw new Error(details);
  }

  // Default STORAGE_BUCKET if not set
  if (!validatedConfig.STORAGE_BUCKET) {
    validatedConfig.STORAGE_BUCKET = `${projectId || "studio-roster"}-assets`;
  }

  // Normalize project id value for downstream consumers
  validatedConfig.GCP_PROJECT_ID = projectId;

  return validatedConfig;
}
