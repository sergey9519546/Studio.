import { Module } from '@nestjs/common';
import { GoogleModule } from '../google/google.module.js';
import { GoogleDriveAdapter } from './cloud-storage/adapters/google-drive.adapter.js';
import { CloudStorageController } from './cloud-storage/cloud-storage.controller.js';
import { CloudStorageService } from './cloud-storage/cloud-storage.service.js';

@Module({
  imports: [GoogleModule],
  controllers: [CloudStorageController],
  providers: [CloudStorageService, GoogleDriveAdapter],
  exports: [CloudStorageService],
})
export class IntegrationsModule {}
