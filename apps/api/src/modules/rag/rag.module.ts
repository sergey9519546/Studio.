import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { AIModule } from '../ai/ai.module.js';
import { VertexAIEmbeddingsService } from '../ai/vertex-ai-embeddings.service.js';
import { ChunkingService } from './chunking.service.js';
import { EmbeddingsService } from './embeddings.service.js';
import { EMBEDDINGS_PROVIDER } from './providers/embeddings-provider.interface.js';
import { OllamaEmbeddingsService } from './providers/ollama-embeddings.service.js';
import { RAGController } from './rag.controller.js';
import { RAGService } from './rag.service.js';
import { VectorStoreService } from './vector-store.service.js';

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
