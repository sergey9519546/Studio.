import { Module } from '@nestjs/common';
import { GoogleModule } from '../google/google.module';
import { GoogleDriveAdapter } from './cloud-storage/adapters/google-drive.adapter';
import { CloudStorageController } from './cloud-storage/cloud-storage.controller';
import { CloudStorageService } from './cloud-storage/cloud-storage.service';

@Module({
  imports: [GoogleModule],
  controllers: [CloudStorageController],
  providers: [CloudStorageService, GoogleDriveAdapter],
  exports: [CloudStorageService],
})
export class IntegrationsModule {}
