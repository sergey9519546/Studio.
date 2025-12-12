
import { Module } from '@nestjs/common';
import { KnowledgeController } from './knowledge.controller.js';
import { KnowledgeService } from './knowledge.service.js';
import { AssetsModule } from '../assets/assets.module.js';
import { IntelligenceModule } from '../intelligence/intelligence.module.js';
import { StorageModule } from '../storage/storage.module.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AssetsModule, IntelligenceModule, ConfigModule, StorageModule],
  controllers: [KnowledgeController],
  providers: [KnowledgeService],
  exports: [KnowledgeService]
})
export class KnowledgeModule {}
