import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { StorageModule } from "../storage/storage.module.js";
import { GCSMediaService } from "./gcs-media.service.js";
import { MediaProxyController } from "./media-proxy.controller.js";

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [MediaProxyController],
  providers: [GCSMediaService],
  exports: [GCSMediaService],
})
export class MediaProxyModule {}
