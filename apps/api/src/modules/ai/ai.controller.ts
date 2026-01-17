
import {
    Controller,
    Post,
    Body,
    UploadedFiles,
    UseInterceptors,
    BadRequestException
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import 'multer';
import { GeminiAnalystService } from './gemini-analyst.service';

@Controller('ai')
export class AIController {
    constructor(private readonly aiService: GeminiAnalystService) { }

    @Post('chat')
    @UseInterceptors(FilesInterceptor('files'))
    async chat(
        @Body('message') message: string,
        @Body('context') context: string,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        if (!message && (!files || files.length === 0)) {
            throw new BadRequestException('Message or files are required');
        }

        return this.aiService.analyzeContext(context, message, files);
    }
}
