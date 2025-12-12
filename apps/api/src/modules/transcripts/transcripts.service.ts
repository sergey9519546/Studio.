import axios from "axios";
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreateTranscriptDto } from "./dto/create-transcript.dto.js";

interface SupadataTranscriptResponse {
  content?: string;
  lang?: string;
  job_id?: string;
  status?: string;
}

@Injectable()
export class TranscriptsService {
  private readonly logger = new Logger(TranscriptsService.name);
  private readonly apiKey?: string;
  private readonly apiBase: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>("SUPADATA_API_KEY");
    this.apiBase =
      this.configService.get<string>("SUPADATA_API_URL") ||
      "https://api.supadata.ai";
  }

  async create(dto: CreateTranscriptDto) {
    if (!this.apiKey) {
      throw new InternalServerErrorException(
        "SUPADATA_API_KEY is not configured on the server"
      );
    }

    try {
      const response = await axios.post<SupadataTranscriptResponse>(
        `${this.apiBase}/v1/transcript`,
        {
          url: dto.url,
          lang: dto.lang,
          text: dto.text ?? true,
          mode: dto.mode || "auto",
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 30_000,
        }
      );

      const payload = response.data;
      return {
        content: payload.content,
        lang: payload.lang,
        jobId: payload.job_id,
        status: payload.status || (payload.content ? "done" : "processing"),
      };
    } catch (error: unknown) {
      const err = error as { message?: string; response?: { data?: unknown } };
      this.logger.error(
        `Supadata transcript request failed: ${err.message}`,
        err.response ? JSON.stringify(err.response.data) : undefined
      );
      throw new InternalServerErrorException("Failed to request transcript");
    }
  }

  async poll(jobId: string) {
    if (!this.apiKey) {
      throw new InternalServerErrorException(
        "SUPADATA_API_KEY is not configured on the server"
      );
    }

    try {
      const response = await axios.get<SupadataTranscriptResponse>(
        `${this.apiBase}/v1/batch/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
          timeout: 15_000,
        }
      );

      const payload = response.data;
      return {
        content: payload.content,
        lang: payload.lang,
        jobId,
        status: payload.status || (payload.content ? "done" : "processing"),
      };
    } catch (error: unknown) {
      const err = error as { message?: string; response?: { data?: unknown } };
      this.logger.warn(
        `Supadata poll failed for ${jobId}: ${err.message}`,
        err.response ? JSON.stringify(err.response.data) : undefined
      );
      throw new InternalServerErrorException("Failed to poll transcript job");
    }
  }
}
