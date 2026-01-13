import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum MoodboardItemType {
    IMAGE = 'image',
    VIDEO = 'video',
    LINK = 'link',
    NOTE = 'note'
}

export class UpdateMoodboardItemDto {
    @IsOptional()
    @IsEnum(MoodboardItemType)
    type?: MoodboardItemType;

    @IsOptional()
    @IsString()
    url?: string;

    @IsOptional()
    @IsString()
    caption?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
