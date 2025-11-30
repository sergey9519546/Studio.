export class CreateMoodboardItemDto {
    projectId: string;
    type: 'image' | 'video' | 'gif';
    url?: string;
    caption?: string;
    tags?: string[];
    moods?: string[];
    colors?: string[];
    shotType?: string;
}
