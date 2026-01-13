import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for building AI context for a project
 */
export class BuildContextDto {
  @ApiProperty({ description: 'Project ID to build context for' })
  @IsString()
  projectId: string;

  @ApiPropertyOptional({ description: 'Agency ID for brand context' })
  @IsString()
  @IsOptional()
  agencyId?: string;

  @ApiProperty({ description: 'Context inclusion options' })
  @ValidateNested()
  @Type(() => ContextInclusionOptionsDto)
  include: ContextInclusionOptionsDto;
}

/**
 * Options for what context to include
 */
export class ContextInclusionOptionsDto {
  @ApiPropertyOptional({ default: true, description: 'Include brand voice model' })
  @IsBoolean()
  @IsOptional()
  brandVoice?: boolean = true;

  @ApiPropertyOptional({ default: true, description: 'Include visual identity model' })
  @IsBoolean()
  @IsOptional()
  visualIdentity?: boolean = true;

  @ApiPropertyOptional({ default: true, description: 'Include client preferences' })
  @IsBoolean()
  @IsOptional()
  clientPreferences?: boolean = true;

  @ApiPropertyOptional({ default: true, description: 'Include successful past campaigns' })
  @IsBoolean()
  @IsOptional()
  successfulCampaigns?: boolean = true;

  @ApiPropertyOptional({ default: true, description: 'Include freelancer performance notes' })
  @IsBoolean()
  @IsOptional()
  freelancerNotes?: boolean = true;

  @ApiPropertyOptional({ default: true, description: 'Include knowledge sources' })
  @IsBoolean()
  @IsOptional()
  knowledgeSources?: boolean = true;

  @ApiPropertyOptional({ default: true, description: 'Include related projects' })
  @IsBoolean()
  @IsOptional()
  relatedProjects?: boolean = true;

  @ApiPropertyOptional({ default: false, description: 'Force rebuild from database (skip cache)' })
  @IsBoolean()
  @IsOptional()
  forceRebuild?: boolean = false;
}

/**
 * DTO for recording approval feedback to learn preferences
 */
export class RecordApprovalDto {
  @ApiProperty({ description: 'Project ID' })
  @IsString()
  projectId: string;

  @ApiProperty({ description: 'Item type that was approved (creative, copy, visual, etc.)' })
  @IsString()
  itemType: string;

  @ApiProperty({ description: 'Item ID that was approved' })
  @IsString()
  itemId: string;

  @ApiProperty({ description: 'Approval rating (1-5)' })
  approvalRating: number;

  @ApiPropertyOptional({ description: 'Client ID who approved' })
  @IsString()
  @IsOptional()
  clientId?: string;

  @ApiPropertyOptional({ description: 'User ID who submitted for approval' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ description: 'Tags for this approval' })
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata about the approval' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Specific feedback notes' })
  @IsString()
  @IsOptional()
  feedback?: string;
}

/**
 * DTO for recording creative work to learn brand voice
 */
export class RecordCreativeWorkDto {
  @ApiProperty({ description: 'Project ID' })
  @IsString()
  projectId: string;

  @ApiProperty({ description: 'Creative content to analyze and learn from' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Type of creative work (headline, copy, tagline, etc.)' })
  @IsEnum(['headline', 'copy', 'tagline', 'script', 'description', 'other'])
  contentType: string;

  @ApiProperty({ description: 'Whether this was approved by client' })
  @IsBoolean()
  approved: boolean;

  @ApiPropertyOptional({ description: 'Tags associated with this work' })
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'User who created this work' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: 'Additional context' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for updating brand context directly
 */
export class UpdateBrandContextDto {
  @ApiProperty({ description: 'Agency ID' })
  @IsString()
  agencyId: string;

  @ApiProperty({ description: 'Brand context name (e.g., "Nike Brand Voice")' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Type of brand context' })
  @IsEnum(['BRAND_VOICE', 'VISUAL_IDENTITY', 'MESSAGING_PATTERN', 'CREATIVE_DIRECTION', 'COMPETITIVE_POSITIONING'])
  type: string;

  @ApiProperty({ description: 'Context data (will be embedded)' })
  @IsObject()
  data: Record<string, any>;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for querying brand contexts
 */
export class QueryBrandContextDto {
  @ApiPropertyOptional({ description: 'Agency ID' })
  @IsString()
  @IsOptional()
  agencyId?: string;

  @ApiPropertyOptional({ description: 'Filter by type' })
  @IsEnum(['BRAND_VOICE', 'VISUAL_IDENTITY', 'MESSAGING_PATTERN', 'CREATIVE_DIRECTION', 'COMPETITIVE_POSITIONING'])
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ default: 20, description: 'Limit results' })
  @IsOptional()
  limit?: number = 20;
}