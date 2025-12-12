import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UnsplashController } from './unsplash.controller.js';
import { UnsplashService } from './unsplash.service.js';

@Module({
  imports: [ConfigModule],
  controllers: [UnsplashController],
  providers: [UnsplashService],
  exports: [UnsplashService],
})
export class UnsplashModule {}
