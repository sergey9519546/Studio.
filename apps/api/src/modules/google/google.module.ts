
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DriveController } from './drive.controller.js';
import { DriveService } from './drive.service.js';
import { GoogleClientFactory } from './google-client.factory.js';
import { DataExtractorService } from './data-extractor.service.js';
import { SheetIngestorService } from './sheet-ingestor.service.js';

@Module({
  imports: [ConfigModule],
  controllers: [DriveController],
  providers: [DriveService, GoogleClientFactory, DataExtractorService, SheetIngestorService],
  exports: [GoogleClientFactory, DriveService, DataExtractorService, SheetIngestorService],
})
export class GoogleModule {}
