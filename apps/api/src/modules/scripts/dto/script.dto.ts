import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateScriptDto {
  @IsString()
  projectId!: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  type?: string;
}

export class UpdateScriptDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  type?: string;
}

export class GenerateScriptDto {
  @IsString()
  projectId!: string;

  @IsString()
  prompt!: string;

  @IsOptional()
  @IsObject()
  context?: Record<string, unknown>;
}
