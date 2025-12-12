
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { StorageService } from './storage.service.js';

@Controller({ path: "storage", version: "1" })
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get("info")
  async getInfo() {
    return this.storageService.getStorageInfo();
  }
}
