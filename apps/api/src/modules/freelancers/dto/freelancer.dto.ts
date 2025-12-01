import { IsString, IsEmail, IsOptional, IsEnum, IsNumber, IsArray, Min } from 'class-validator';

export class CreateFreelancerDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    role: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    skills?: string[];

    @IsOptional()
    @IsNumber()
    @Min(0)
    rate?: number;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    portfolio?: string;

    @IsOptional()
    @IsEnum(['Active', 'Inactive', 'Archived'])
    status?: string;
}

export class UpdateFreelancerDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    skills?: string[];

    @IsOptional()
    @IsNumber()
    @Min(0)
    rate?: number;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    portfolio?: string;

    @IsOptional()
    @IsEnum(['Active', 'Inactive', 'Archived'])
    status?: string;
}
