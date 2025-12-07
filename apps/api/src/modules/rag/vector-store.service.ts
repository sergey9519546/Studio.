interface StoredVector {
    id: string;
    content: string;
    embedding: number[];
    metadata: Record<string, unknown>;
    createdAt: Date;
}

@Injectable()
export class VectorStoreService {
    private readonly logger = new Logger(VectorStoreService.name);
    // In-memory cache for performance (in production, use Redis or dedicated vector DB)
    private vectorStore: Map<string, StoredVector> = new Map();

    constructor(
        private prisma: PrismaService,
        private embeddings: EmbeddingsService
    ) {
        // FAST STARTUP: Only load vectors if RAG_WARMUP is explicitly enabled
        // This prevents blocking the constructor with embedding generation
        if (process.env.RAG_WARMUP === 'true') {
            this.logger.log('RAG warmup enabled - loading vectors in background...');
            // Non-blocking: run in background, don't await
            this.loadVectorsFromDatabase().catch(err => 
                this.logger.warn('Background vector loading failed:', err.message)
            );
        } else {
            this.logger.log('RAG warmup disabled - vectors will load on first query');
        }
    }

    /**
     * Store a document with its embedding
     */
    async storeDocument(
        content: string,
        metadata: Record<string, unknown> = {}
    ): Promise<string> {
        const embedding = await this.embeddings.generateEmbedding(content);
        const id = this.generateId();

        const vectorData: StoredVector = {
            id,
            content,
            embedding,
            metadata,
            createdAt: new Date(),
        };

        // Store in memory
        this.vectorStore.set(id, vectorData);

        // Persist to database (using KnowledgeSource table)
        try {
            await this.prisma.knowledgeSource.create({
                data: {
                    type: 'text',
                    title: metadata.title as string || 'Untitled',
                    originalContent: content,
                    status: 'indexed',
                    summary: metadata.summary as string,
                    projectId: metadata.projectId as string,
                },
            });
        } catch (error) {
            this.logger.warn('Failed to persist to database', error);
        }

        this.logger.debug(`Stored document with ID: ${id}`);
        return id;
    }

    /**
     * Store multiple documents in batch
     */
    async storeBatch(
        documents: Array<{ content: string; metadata?: Record<string, unknown> }>
    ): Promise<string[]> {
        const contents = documents.map(d => d.content);
        const embeddings = await this.embeddings.generateBatch(contents);

        const ids: string[] = [];

        for (let i = 0; i < documents.length; i++) {
            const id = this.generateId();
            const vectorData: StoredVector = {
                id,
                content: documents[i].content,
                embedding: embeddings[i],
                metadata: documents[i].metadata || {},
                createdAt: new Date(),
            };

            this.vectorStore.set(id, vectorData);
            ids.push(id);
        }

        this.logger.log(`Stored batch of ${ids.length} documents`);
        return ids;
    }

    /**
     * Search for similar documents
     */
    async search(
        query: string,
        options: {
            topK?: number;
            threshold?: number;
            filter?: Record<string, unknown>;
        } = {}
    ): Promise<Array<{ id: string; content: string; score: number; metadata: Record<string, unknown> }>> {
        const { topK = 5, threshold = 0.0, filter } = options;

        const queryEmbedding = await this.embeddings.generateEmbedding(query);

        // Convert to array for processing
        let vectors = Array.from(this.vectorStore.values());

        // Apply filters if provided
        if (filter) {
            vectors = vectors.filter(vec => {
                return Object.entries(filter).every(([key, value]) => {
                    // Safely check metadata property
                    return Object.prototype.hasOwnProperty.call(vec.metadata, key) && vec.metadata[key] === value;
                });
            });
        }

        // Calculate similarities
        const results = vectors.map(vec => ({
            id: vec.id,
            content: vec.content,
            score: this.cosineSimilarity(queryEmbedding, vec.embedding),
            metadata: vec.metadata,
        }));

        // Filter by threshold and sort by score
        return results
            .filter(r => r.score >= threshold)
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }

    /**
     * Hybrid search: combines keyword and semantic search
     */
    async hybridSearch(
        query: string,
        options: {
            topK?: number;
            semanticWeight?: number; // 0-1, how much to weight semantic vs keyword
            projectId?: string; // Add projectId filter
        } = {}
    ): Promise<Array<{ id: string; content: string; score: number; metadata: Record<string, unknown> }>> {
        const { topK = 5, semanticWeight = 0.7, projectId } = options;
        const keywordWeight = 1 - semanticWeight;

        // Semantic search
        const queryEmbedding = await this.embeddings.generateEmbedding(query);
        let vectors = Array.from(this.vectorStore.values());

        // Apply projectId filter if provided
        if (projectId) {
            vectors = vectors.filter(vec => vec.metadata.projectId === projectId);
        }

        const results = vectors.map(vec => {
            // Semantic similarity
            const semanticScore = this.cosineSimilarity(queryEmbedding, vec.embedding);

            // Keyword matching (simple BM25-like)
            const keywordScore = this.keywordScore(query.toLowerCase(), vec.content.toLowerCase());

            // Combined score
            const score = semanticWeight * semanticScore + keywordWeight * keywordScore;

            return {
                id: vec.id,
                content: vec.content,
                score,
                metadata: vec.metadata,
            };
        });

        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }

    /**
     * Get document content by ID
     */
    getDocumentContent(id: string): string | undefined {
        return this.vectorStore.get(id)?.content;
    }

    /**
     * Delete a document by ID
     */
    deleteDocument(id: string): boolean {
        return this.vectorStore.delete(id);
    }

    /**
     * Clear all vectors
     */
    clearAll(): void {
        this.vectorStore.clear();
        this.logger.log('Vector store cleared');
    }

    /**
     * Get statistics
     */
    getStats(): { totalDocuments: number; memoryUsage: string } {
        const totalDocs = this.vectorStore.size;
        const memoryBytes = JSON.stringify(Array.from(this.vectorStore.values())).length;
        const memoryMB = (memoryBytes / 1024 / 1024).toFixed(2);

        return {
            totalDocuments: totalDocs,
            memoryUsage: `${memoryMB} MB`,
        };
    }

    /**
     * Load vectors from database on startup
     */
    private async loadVectorsFromDatabase(): Promise<void> {
        try {
            const sources = await this.prisma.knowledgeSource.findMany({
                where: { status: 'indexed' },
                take: 1000, // Limit for memory
            });

            this.logger.log(`Loading ${sources.length} knowledge sources from database...`);

            // Generate embeddings for loaded documents
            if (sources.length > 0) {
                const contents = sources.map(s => s.originalContent || '');
                const embeddings = await this.embeddings.generateBatch(contents);

                sources.forEach((source, i) => {
                    this.vectorStore.set(source.id, {
                        id: source.id,
                        content: source.originalContent || '',
                        embedding: embeddings[i],
                        metadata: {
                            title: source.title,
                            projectId: source.projectId,
                            type: source.type,
                        },
                        createdAt: new Date(), // Use current date since Prisma type doesn't include it
                    });
                });

                this.logger.log(`Loaded ${this.vectorStore.size} vectors into memory`);
            }
        } catch (error) {
            this.logger.error('Failed to load vectors from database', error);
        }
    }

    /**
     * Cosine similarity between two vectors
     */
    private cosineSimilarity(a: number[], b: number[]): number {
        if (a.length !== b.length) return 0;

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
     * Simple keyword matching score
     */
    private keywordScore(query: string, text: string): number {
        const queryTerms = query.split(/\s+/).filter(t => t.length > 2);
        if (queryTerms.length === 0) return 0;

        let matches = 0;
        for (const term of queryTerms) {
            if (text.includes(term)) {
                matches++;
            }
        }

        return matches / queryTerms.length;
    }

    /**
     * Generate unique ID
     */
    private generateId(): string {
        return `vec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
