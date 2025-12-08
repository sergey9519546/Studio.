import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { AIModule } from '../ai/ai.module';
import { VertexAIEmbeddingsService } from '../ai/vertex-ai-embeddings.service';
import { ChunkingService } from './chunking.service';
import { EmbeddingsService } from './embeddings.service';
import { EMBEDDINGS_PROVIDER } from './providers/embeddings-provider.interface';
import { OllamaEmbeddingsService } from './providers/ollama-embeddings.service';
import { RAGController } from './rag.controller';
import { RAGService } from './rag.service';
import { VectorStoreService } from './vector-store.service';

@Module({
    imports: [forwardRef(() => AIModule), PrismaModule, ConfigModule],
    controllers: [RAGController],
    providers: [
        RAGService,
        EmbeddingsService,
        VectorStoreService,
        ChunkingService,
        OllamaEmbeddingsService,
        {
            provide: EMBEDDINGS_PROVIDER,
            useFactory: (
                configService: ConfigService,
                ollamaService: OllamaEmbeddingsService,
                vertexService: VertexAIEmbeddingsService,
            ) => {
                const provider = configService.get<string>('EMBEDDINGS_PROVIDER') || 'vertex';
                if (provider === 'ollama') {
                    return ollamaService;
                }
                return vertexService;
            },
            inject: [ConfigService, OllamaEmbeddingsService, VertexAIEmbeddingsService],
        },
    ],
    exports: [RAGService],
})
export class RAGModule { }
