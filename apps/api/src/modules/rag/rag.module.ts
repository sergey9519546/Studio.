import { Module } from '@nestjs/common';
import { RAGService } from './rag.service';
import { EmbeddingsService } from './embeddings.service';
import { VectorStoreService } from './vector-store.service';
import { ChunkingService } from './chunking.service';
import { RAGController } from './rag.controller';
import { AIModule } from '../ai/ai.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [AIModule, PrismaModule],
    controllers: [RAGController],
    providers: [RAGService, EmbeddingsService, VectorStoreService, ChunkingService],
    exports: [RAGService],
})
export class RAGModule { }
