import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TranscriptsController } from "./transcripts.controller.js";
import { TranscriptsService } from "./transcripts.service.js";

@Module({
  imports: [ConfigModule],
  controllers: [TranscriptsController],
  providers: [TranscriptsService],
  exports: [TranscriptsService],
})
export class TranscriptsModule {}
