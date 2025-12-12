import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateTranscriptDto } from "./dto/create-transcript.dto.js";
import { TranscriptsService } from "./transcripts.service.js";

@Controller({ path: "transcripts", version: "1" })
export class TranscriptsController {
  constructor(private readonly transcriptsService: TranscriptsService) {}

  @Post()
  create(@Body() dto: CreateTranscriptDto) {
    return this.transcriptsService.create(dto);
  }

  @Get(":jobId")
  poll(@Param("jobId") jobId: string) {
    return this.transcriptsService.poll(jobId);
  }
}
