import { IsString, IsOptional, IsUUID } from 'class-validator';

// Script schema only has: id, content, projectId (no title or tags)
export class CreateScriptDto {
    @IsString()
    content: string;

    @IsUUID()
    projectId: string;
}

export class UpdateScriptDto {
    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsUUID()
    projectId?: string;
}
