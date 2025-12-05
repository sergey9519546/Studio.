
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, IsOptional, validateSync } from 'class-validator';

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
}

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment = Environment.Development;

    @IsString()
    DATABASE_URL!: string;

    @IsString()
    JWT_SECRET!: string;

    // GCP_PROJECT_ID is optional - can fall back to GOOGLE_CLOUD_PROJECT (set by Cloud Run)
    @IsOptional()
    @IsString()
    GCP_PROJECT_ID?: string;

    @IsOptional()
    @IsString()
    GCP_CLIENT_EMAIL?: string;

    @IsOptional()
    @IsString()
    GCP_PRIVATE_KEY?: string;

    // STORAGE_BUCKET is optional - defaults to project-assets
    @IsOptional()
    @IsString()
    STORAGE_BUCKET?: string;

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
    
    // Default STORAGE_BUCKET if not set
    if (!config.STORAGE_BUCKET) {
        config.STORAGE_BUCKET = `${config.GCP_PROJECT_ID || 'studio-roster'}-assets`;
    }

    const validatedConfig = plainToInstance(
        EnvironmentVariables,
        config,
        { enableImplicitConversion: true },
    );
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: true, // Allow optional properties
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
