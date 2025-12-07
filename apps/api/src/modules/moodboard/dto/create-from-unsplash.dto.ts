import { IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

/**
 * DTO for creating a moodboard item from an Unsplash image
 * This captures all necessary Unsplash data for attribution compliance
 */
export class CreateFromUnsplashDto {
  @IsUUID()
  projectId!: string;

  @IsString()
  unsplashId!: string; // Unsplash photo ID

  @IsUrl()
  imageUrl!: string; // URL to the regular-size image

  @IsString()
  photographerName!: string; // Required for attribution

  @IsUrl()
  photographerUrl!: string; // Link to photographer's Unsplash profile

  @IsOptional()
  @IsString()
  description?: string; // Image description

  @IsOptional()
  @IsString()
  altDescription?: string; // Alt text

  @IsString()
  color!: string; // Dominant color (hex)

  @IsOptional()
  @IsString()
  width?: number; // Original width

  @IsOptional()
  @IsString()
  height?: number; // Original height
}
