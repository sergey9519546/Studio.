
import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { CloudStorageService } from './cloud-storage.service';
import { ListFilesQueryDto } from './dto/cloud-storage.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: { id: string; email: string };
}

@UseGuards(JwtAuthGuard)
@Controller('integrations/storage')
export class CloudStorageController {
  constructor(private readonly storageService: CloudStorageService) { }

  @Get('options')
  async getOptions(@Req() req: RequestWithUser) {
    const userId = parseInt(req.user.id, 10);
    return this.storageService.getProviderOptions(userId);
  }

  @Get(':provider/files')
  async listFiles(
    @Param('provider') provider: string,
    @Query() query: ListFilesQueryDto,
    @Req() req: RequestWithUser
  ) {
    const userId = parseInt(req.user.id, 10);
    return this.storageService.listFiles(userId, provider, query.folderId);
  }
}
