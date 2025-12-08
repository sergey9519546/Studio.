import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TranscriptsController } from "./transcripts.controller";
import { TranscriptsService } from "./transcripts.service";

@Module({
  imports: [ConfigModule],
  controllers: [TranscriptsController],
  providers: [TranscriptsService],
  exports: [TranscriptsService],
})
export class TranscriptsModule {}
