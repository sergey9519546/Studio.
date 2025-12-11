import { GoogleGenAI, GoogleGenerativeAI } from "@google/genai";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmbeddingsProvider } from "../rag/providers/embeddings-provider.interface";

@Injectable()
export class VertexAIEmbeddingsService implements EmbeddingsProvider {
  private readonly logger = new Logger(VertexAIEmbeddingsService.name);
  private client: GoogleGenAI;
  private readonly project: string;
  private readonly location: string;
  private readonly embeddingModel = "text-embedding-004";

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>("GOOGLE_GENAI_API_KEY");
    const projectId = this.configService.get<string>("GCP_PROJECT_ID");

    if (!apiKey) {
      throw new Error("GOOGLE_GENAI_API_KEY is required for Vertex AI Embeddings");
    }

    if (!projectId) {
      throw new Error("GCP_PROJECT_ID is required for Vertex AI Embeddings");
    }

    this.project = projectId;
    this.location = this.configService.get<string>("GCP_LOCATION") || "us-central1";

    // Initialize Google Generative AI client
    this.client = new GoogleGenerativeAI({ apiKey });

    this.logger.log(`Vertex AI Embeddings initialized: ${this.embeddingModel}`);
  }

  /**
   * Generate embedding for a single text using Vertex AI
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const model = this.client.getGenerativeModel({
        model: `models/${this.embeddingModel}`,
      });

      const result = await model.embedContent(text);
      const embedding = result.embedding.values;

      if (!embedding || embedding.length === 0) {
        throw new Error("No embedding returned from Vertex AI");
      }

      this.logger.debug(
        `Generated embedding vector of length ${embedding.length}`
      );
      return embedding;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown embedding error";
      this.logger.error(
        `Failed to generate embedding: ${message}`,
        error instanceof Error ? error.stack : undefined
      );
      throw error;
    }
  }

  /**
   * Generate embeddings for multiple texts in a single batch
   */
  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const model = this.client.getGenerativeModel({
        model: `models/${this.embeddingModel}`,
      });

      // Process in batches to avoid rate limits
      const batchSize = 100;
      const results: number[][] = [];

      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        const batchPromises = batch.map(text => model.embedContent(text));

        const batchResults = await Promise.all(batchPromises);
        const embeddings = batchResults.map((result: any) => {
          const embedding = result.embedding.values;
          if (!embedding || embedding.length === 0) {
            throw new Error("No embedding returned from Vertex AI");
          }
          return embedding;
        });

        results.push(...embeddings);
      }

      this.logger.log(`Successfully generated ${results.length} embeddings`);
      return results;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown batch embedding error";
      this.logger.error(
        `Batch embedding failed: ${message}`,
        error instanceof Error ? error.stack : undefined
      );
      throw error;
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error("Vectors must have same length for cosine similarity");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dotProduct / denominator;
  }

  /**
   * Health check for embeddings service
   */
  async healthCheck(): Promise<{ status: string; model: string }> {
    return {
      status: "ok",
      model: this.embeddingModel,
    };
  }
}
