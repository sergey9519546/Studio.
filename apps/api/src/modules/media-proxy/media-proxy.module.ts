import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { StorageModule } from "../storage/storage.module";
import { GCSMediaService } from "./gcs-media.service";
import { MediaProxyController } from "./media-proxy.controller";

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [MediaProxyController],
  providers: [GCSMediaService],
  exports: [GCSMediaService],
})
export class MediaProxyModule {}
