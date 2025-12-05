import { IsString, IsDateString, IsEnum, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateAssignmentDto {
    @IsString()
    projectId!: string;

    @IsString()
    freelancerId!: string;

    @IsString()
    role!: string;

    @IsDateString()
    startDate!: string;

    @IsDateString()
    endDate!: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    allocation?: number;

    @IsOptional()
    @IsEnum(['Tentative', 'Confirmed', 'active'])
    status?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}

export class UpdateAssignmentDto {
    @IsOptional()
    @IsString()
    projectId?: string;

    @IsOptional()
    @IsString()
    freelancerId?: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    allocation?: number;

    @IsOptional()
    @IsEnum(['Tentative', 'Confirmed', 'active'])
    status?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
