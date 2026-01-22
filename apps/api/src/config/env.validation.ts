
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

  @IsOptional()
  @IsString()
  GOOGLE_APPLICATION_CREDENTIALS_JSON?: string;

  @IsOptional()
  @IsString()
  GCP_CREDENTIALS?: string;

  @IsOptional()
  @IsString()
  GOOGLE_SERVICE_ACCOUNT_EMAIL?: string;

  @IsOptional()
  @IsString()
  GOOGLE_SERVICE_PRIVATE_KEY?: string;

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

  @IsOptional()
  @IsString()
  SUPADATA_API_KEY?: string;

  @IsOptional()
  @IsString()
  SUPADATA_API_URL?: string;

  @IsOptional()
  @IsString()
  ZHIPU_API_KEY?: string;

  @IsOptional()
  @IsString()
  ZHIPU_API_SECRET?: string;

  @IsOptional()
  @IsString()
  ZHIPU_API_ENDPOINT?: string;

  @IsOptional()
  @IsString()
  ZHIPU_MODEL?: string;

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

  const nodeEnv = validatedConfig.NODE_ENV || Environment.Development;
  const projectId =
    validatedConfig.GCP_PROJECT_ID || validatedConfig.GOOGLE_CLOUD_PROJECT;
  const canInferFirebaseBucket = !!projectId;

  const missingRequired: string[] = [];
  if (!validatedConfig.DATABASE_URL) missingRequired.push("DATABASE_URL");
  if (!projectId)
    missingRequired.push("GCP_PROJECT_ID or GOOGLE_CLOUD_PROJECT");

  const hasGcsCredentials =
    !!validatedConfig.GOOGLE_APPLICATION_CREDENTIALS_JSON ||
    !!validatedConfig.GCP_CREDENTIALS ||
    !!validatedConfig.GOOGLE_APPLICATION_CREDENTIALS ||
    (!!validatedConfig.GCP_CLIENT_EMAIL && !!validatedConfig.GCP_PRIVATE_KEY) ||
    (!!validatedConfig.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      !!validatedConfig.GOOGLE_SERVICE_PRIVATE_KEY);

  if (nodeEnv === Environment.Production) {
    if (!validatedConfig.STORAGE_BUCKET && !canInferFirebaseBucket) {
      missingRequired.push(
        "STORAGE_BUCKET (or provide GCP_PROJECT_ID so Firebase default bucket can be derived)"
      );
    }
    if (!hasGcsCredentials) {
      missingRequired.push(
        "GCS credentials (one of GOOGLE_APPLICATION_CREDENTIALS_JSON, GCP_CREDENTIALS, GOOGLE_APPLICATION_CREDENTIALS, or GCP_CLIENT_EMAIL+GCP_PRIVATE_KEY)"
      );
    }
  }

  if (missingRequired.length || validationErrors.length) {
    const details = [
      ...missingRequired.map((v) => `Missing env: ${v}`),
      ...validationErrors.map((e) => e.toString()),
    ].join("; ");
    throw new Error(details);
  }

  // Default STORAGE_BUCKET if not set
  if (!validatedConfig.STORAGE_BUCKET) {
    if (canInferFirebaseBucket) {
      validatedConfig.STORAGE_BUCKET = `${projectId}.appspot.com`;
    } else if (nodeEnv !== Environment.Production) {
      validatedConfig.STORAGE_BUCKET = "studio-roster-assets";
    }
  }

  // Normalize project id value for downstream consumers
  validatedConfig.GCP_PROJECT_ID = projectId;

  return validatedConfig;
}
