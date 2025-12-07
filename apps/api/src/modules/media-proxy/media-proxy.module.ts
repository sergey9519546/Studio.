import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MediaProxyController } from './media-proxy.controller';
import { S3MediaService } from './s3-media.service';

@Module({
  imports: [PrismaModule],
  controllers: [MediaProxyController],
  providers: [S3MediaService],
  exports: [S3MediaService],
})
export class MediaProxyModule {}
