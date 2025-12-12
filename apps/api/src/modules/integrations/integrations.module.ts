import { Module } from '@nestjs/common';
import { GoogleModule } from '../google/google.module.js';
import { GoogleDriveAdapter } from './cloud-storage/adapters/google-drive.adapter.js';
import { CloudStorageController } from './cloud-storage/cloud-storage.controller.js';
import { CloudStorageService } from './cloud-storage/cloud-storage.service.js';
import { UnsplashModule } from './unsplash/unsplash.module.js';

@Module({
  imports: [GoogleModule, UnsplashModule],
  controllers: [CloudStorageController],
  providers: [CloudStorageService, GoogleDriveAdapter],
  exports: [CloudStorageService, UnsplashModule],
})
export class IntegrationsModule {}
