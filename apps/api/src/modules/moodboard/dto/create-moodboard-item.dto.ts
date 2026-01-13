import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateMoodboardItemDto {
  @IsUUID()
  projectId!: string;

  @IsEnum(["image", "video", "gif"])
  type!: "image" | "video" | "gif";

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsUUID()
  assetId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  moods?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[];

  @IsOptional()
  @IsString()
  shotType?: string;
}
