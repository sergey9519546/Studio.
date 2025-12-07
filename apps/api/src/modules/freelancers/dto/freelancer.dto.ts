import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from "class-validator";

export enum AvailabilityStatus {
  AVAILABLE = "available",
  BUSY = "busy",
  UNAVAILABLE = "unavailable",
}

// Matches Prisma schema: name, email, skills, role, rate, status, bio, phone, location, availability, portfolio, notes
export class CreateFreelancerDto {
  @IsString()
  name!: string;

  // Accept either email or legacy contactInfo; one is required
  @IsOptional()
  @ValidateIf((o) => !o.contactInfo)
  @IsEmail()
  email?: string;

  @IsOptional()
  @ValidateIf((o) => !o.email)
  @IsEmail()
  contactInfo?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rate?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  @IsString()
  portfolio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}

export class UpdateFreelancerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @ValidateIf((o) => !o.contactInfo)
  @IsEmail()
  email?: string;

  @IsOptional()
  @ValidateIf((o) => !o.email)
  @IsEmail()
  contactInfo?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rate?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  @IsString()
  portfolio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}

export class ImportFreelancerDto {
  @IsOptional()
  @IsUUID()
  id?: string; // For upsert logic in batch import

  @IsString()
  name!: string;

  @IsOptional()
  @ValidateIf((o) => !o.contactInfo)
  @IsEmail()
  email?: string;

  @IsOptional()
  @ValidateIf((o) => !o.email)
  @IsEmail()
  contactInfo?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rate?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  @IsString()
  portfolio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
