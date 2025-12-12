import { Module } from '@nestjs/common';
import { DeepReaderService } from './deep-reader.service.js';

@Module({
  providers: [DeepReaderService],
  exports: [DeepReaderService],
})
export class IntelligenceModule {}