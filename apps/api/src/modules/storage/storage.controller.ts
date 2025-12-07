
import { Controller, Get } from '@nestjs/common';
import { StorageService } from './storage.service';

@Controller({ path: "storage", version: "1" })
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get("info")
  async getInfo() {
    return this.storageService.getStorageInfo();
  }
}
