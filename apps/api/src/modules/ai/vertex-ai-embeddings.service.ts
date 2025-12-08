import { PredictionServiceClient, protos } from "@google-cloud/aiplatform";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmbeddingsProvider } from "../rag/providers/embeddings-provider.interface";

// Vertex AI client typings are not published; use a loose type until official typings are available.
type IValue = any;

interface EmbeddingValue {
  numberValue?: number | null;
}

@Injectable()
export class VertexAIEmbeddingsService implements EmbeddingsProvider {
  private readonly logger = new Logger(VertexAIEmbeddingsService.name);
  private client: PredictionServiceClient;
  private readonly project: string;
  private readonly location: string;
  private readonly publisher = "google";
  private readonly embeddingModel = "textembedding-gecko@003";

  constructor(private configService: ConfigService) {
    const projectId = this.configService.get<string>("GCP_PROJECT_ID");
    if (!projectId) {
      throw new Error("GCP_PROJECT_ID is required for Vertex AI Embeddings");
    }
    this.project = projectId;
    this.location =
      this.configService.get<string>("GCP_LOCATION") || "us-central1";

    this.client = new PredictionServiceClient({
      apiEndpoint: `${this.location}-aiplatform.googleapis.com`,
    });

    this.logger.log(`Vertex AI Embeddings initialized: ${this.embeddingModel}`);
  }

  /**
   * Generate embedding for a single text using Vertex AI
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const endpoint = `projects/${this.project}/locations/${this.location}/publishers/${this.publisher}/models/${this.embeddingModel}`;

      const instance: IValue = {
        structValue: {
          fields: {
            content: {
              stringValue: text,
            },
          },
        },
      };

      const request = {
        endpoint,
        instances: [instance],
      };

      this.logger.debug(`Generating embedding for text (${text.length} chars)`);
      const [response] = await this.client.predict(request);

      if (!response.predictions || response.predictions.length === 0) {
        throw new Error("No embeddings returned from Vertex AI");
      }

      const prediction = response.predictions[0];
      const embeddings =
        prediction.structValue?.fields?.embeddings?.structValue?.fields?.values
          ?.listValue?.values;

      if (!embeddings) {
        this.logger.warn("Unexpected response structure", prediction);
        throw new Error("Unable to extract embeddings from Vertex AI response");
      }

      // Extract number values from the embedding
      const embeddingVector = embeddings.map(
        (v: EmbeddingValue) => v.numberValue || 0
      );

      this.logger.debug(
        `Generated embedding vector of length ${embeddingVector.length}`
      );
      return embeddingVector;
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
      const endpoint = `projects/${this.project}/locations/${this.location}/publishers/${this.publisher}/models/${this.embeddingModel}`;

      const instances: IValue[] = texts.map((text) => ({
        structValue: {
          fields: {
            content: {
              stringValue: text,
            },
          },
        },
      }));

      const request = {
        endpoint,
        instances,
      };

      this.logger.debug(`Batch generating ${texts.length} embeddings`);
      const [response] = await this.client.predict(request);

      if (!response.predictions || response.predictions.length === 0) {
        throw new Error("No embeddings returned from Vertex AI");
      }

      const predictions = (response.predictions as IValue[]) ?? [];
      const embeddings = predictions.map((prediction: IValue) => {
        const values =
          prediction.structValue?.fields?.embeddings?.structValue?.fields?.values?.listValue?.values;
        if (!values) {
          throw new Error("Unable to extract embeddings from response");
        }
        return values.map((v: EmbeddingValue) => v.numberValue || 0);
      });

      this.logger.log(`Successfully generated ${embeddings.length} embeddings`);
      return embeddings;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown batch embedding error";
      this.logger.error(
        `Batch embedding failed: ${message}`,
        error instanceof Error ? error.stack : undefined
      );
      // Fallback to individual requests if batch fails
      this.logger.warn("Falling back to individual embedding requests");
      return Promise.all(texts.map((text) => this.generateEmbedding(text)));
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
