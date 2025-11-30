
import { 
  Controller, 
  Post, 
  Get, 
  Delete,
  Param, 
  Body, 
  UseInterceptors, 
  UploadedFile, 
  ParseFilePipe, 
  MaxFileSizeValidator, 
  FileTypeValidator,
  Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssetsService, MulterFile } from './assets.service';

@Controller('assets')
export class AssetsController {
  private readonly logger = new Logger(AssetsController.name);

  constructor(private readonly assetsService: AssetsService) {
    this.logger.log('AssetsController Initialized');
  }

  @Get()
  async findAll() {
    return this.assetsService.findAll();
  }

  @Get('health')
  healthCheck() {
    return { status: 'Assets Module Online' };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100 * 1024 * 1024 }), // 100MB
          // Accepting all types to prevent validation errors on specific mimetypes
          new FileTypeValidator({ fileType: /.*/ }), 
        ],
        fileIsRequired: true,
      }),
    )
    file: MulterFile,
    @Body('projectId') projectId?: string,
  ) {
    this.logger.log(`Uploading file: ${file.originalname} (${file.mimetype})`);
    return this.assetsService.create(file, projectId);
  }

  @Get(':id/url')
  async getUrl(@Param('id') id: string) {
    const url = await this.assetsService.getDownloadUrl(id);
    return { url };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.assetsService.delete(id);
  }
}
