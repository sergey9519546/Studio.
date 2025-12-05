import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

export class RoleRequirementDto {
  @IsString()
  role!: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  count?: number;

  @IsArray()
  @IsString({ each: true })
  skills!: string[];
}

export class CreateProjectDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  client?: string;

  @IsOptional()
  @IsEnum(["PLANNED", "IN_PROGRESS", "REVIEW", "DELIVERED", "ARCHIVED"])
  status?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleRequirementDto)
  roleRequirements?: RoleRequirementDto[];
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  client?: string;

  @IsOptional()
  @IsEnum(["PLANNED", "IN_PROGRESS", "REVIEW", "DELIVERED", "ARCHIVED"])
  status?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleRequirementDto)
  roleRequirements?: RoleRequirementDto[];
}
