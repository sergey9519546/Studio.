import { IsString, IsOptional, IsUUID, IsDateString, IsNumber, Min, Max } from 'class-validator';

export class UpdateAssignmentDto {
    @IsOptional()
    @IsUUID()
    freelancerId?: string;

    @IsOptional()
    @IsUUID()
    projectId?: string;

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
    @IsString()
    status?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    allocation?: number;
}
