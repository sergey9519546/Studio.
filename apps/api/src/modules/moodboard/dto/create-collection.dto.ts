import { IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * DTO for creating a moodboard collection
 */
export class CreateCollectionDto {
  @IsUUID()
  projectId!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
