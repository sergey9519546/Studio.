import { Module } from '@nestjs/common';
import { RAGService } from './rag.service';
import { EmbeddingsService } from './embeddings.service';
import { VectorStoreService } from './vector-store.service';

@Module({
    providers: [RAGService, EmbeddingsService, VectorStoreService],
    exports: [RAGService],
})
export class RAGModule { }
