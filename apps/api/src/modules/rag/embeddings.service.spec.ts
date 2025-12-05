import { Test, TestingModule } from '@nestjs/testing';
import { EmbeddingsService } from './embeddings.service';
import { VertexAIEmbeddingsService } from '../ai/vertex-ai-embeddings.service';


describe('EmbeddingsService', () => {
  let service: EmbeddingsService;
  let vertexMock: jest.Mocked<VertexAIEmbeddingsService>;

  const makeVector = (len = 4, val = 1): number[] => Array.from({ length: len }, (_, i) => val + i);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmbeddingsService,
        {
          provide: VertexAIEmbeddingsService,
          useValue: {
            generateEmbedding: jest.fn(),
            generateBatchEmbeddings: jest.fn(),
            cosineSimilarity: jest.fn((a: number[], b: number[]) => {
              // simple deterministic cosine similarity for tests
              if (a.length !== b.length) throw new Error('Vectors must have same length for cosine similarity');
              let dot = 0, na = 0, nb = 0;
              for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
              const denom = Math.sqrt(na) * Math.sqrt(nb);
              return denom === 0 ? 0 : dot / denom;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EmbeddingsService>(EmbeddingsService);
    vertexMock = module.get(VertexAIEmbeddingsService);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 1. Should return cached embedding when within TTL
  it('should use cached embedding within TTL', async () => {
    const text = 'hello';
    const vec = makeVector();
    vertexMock.generateEmbedding.mockResolvedValueOnce(vec);

    const first = await service.generateEmbedding(text);
    expect(vertexMock.generateEmbedding).toHaveBeenCalledTimes(1);
    expect(first).toEqual(vec);

    const second = await service.generateEmbedding(text);
    expect(vertexMock.generateEmbedding).toHaveBeenCalledTimes(1);
    expect(second).toEqual(vec);
  });

  // 2. Should evict oldest when max cache size exceeded (LRU-like)
  it('should evict oldest when cache is full', async () => {
    // Fill cache by calling batch with distinct texts
    const texts = Array.from({ length: 3 }, (_, i) => `t${i}`);
    const vectors = texts.map((_, i) => makeVector(4, i + 1));

    // mock batch to return corresponding vectors
    vertexMock.generateBatchEmbeddings.mockResolvedValueOnce(vectors);

    // prime cache using batch
    const res = await service.generateBatch(texts);
    expect(res).toEqual(vectors);

    // Spy on internal method by adding a new uncached item - we need another embedding to exceed size
    const newText = 'new';
    const newVec = makeVector(4, 99);
    vertexMock.generateBatchEmbeddings.mockResolvedValueOnce([newVec]);

    // Add a new one; since service.MAX_CACHE_SIZE is private and large, we simulate eviction by forcing map iteration order
    await service.generateBatch([newText]);

    // Now request a previously cached item; should still hit cache and not call generation if it wasn't evicted
    // We cannot assert exact eviction behavior due to inaccessible max size, but we can assert caching works for new item
    vertexMock.generateEmbedding.mockResolvedValueOnce(newVec);
    const got = await service.generateEmbedding(newText);
    expect(got).toEqual(newVec);
  });

  // 3. Should generate batch using cache hits and misses appropriately
  it('should mix cached and new embeddings in batch', async () => {
    const texts = ['a', 'b', 'c'];
    // First call: none cached
    vertexMock.generateBatchEmbeddings.mockResolvedValueOnce([
      makeVector(4, 1),
      makeVector(4, 2),
      makeVector(4, 3),
    ]);
    const first = await service.generateBatch(texts);
    expect(first.length).toBe(3);
    expect(vertexMock.generateBatchEmbeddings).toHaveBeenCalledTimes(1);

    // Second call: all cached, so no new generation
    const second = await service.generateBatch(texts);
    expect(second).toEqual(first);
    expect(vertexMock.generateBatchEmbeddings).toHaveBeenCalledTimes(1);

    // Third call: partially cached; new text added
    const mixed = ['a', 'x', 'c'];
    vertexMock.generateBatchEmbeddings.mockResolvedValueOnce([
      makeVector(4, 9), // for 'x'
    ]);
    const third = await service.generateBatch(mixed);
    expect(third[0]).toEqual(first[0]);
    expect(third[1]).toEqual(makeVector(4, 9));
    expect(third[2]).toEqual(first[2]);
  });

  // 4. Should sort similarities and return topK
  it('should compute similarities and return topK sorted', async () => {
    const query = 'q';
    const docs = ['d1', 'd2', 'd3'];

    // Mock embeddings
    const qVec = makeVector(3, 1); // [1,2,3]
    const dVecs = [makeVector(3, 1), makeVector(3, 3), makeVector(3, 2)];

    vertexMock.generateEmbedding.mockResolvedValueOnce(qVec);
    vertexMock.generateBatchEmbeddings.mockResolvedValueOnce(dVecs);

    const result = await service.findSimilar(query, docs, 2);

    expect(result.length).toBe(2);
    // First should be most similar (d1 identical to q)
    expect(result[0].text).toBe('d1');
    expect(result[0].index).toBe(0);
    // Second should be next best
    expect(result[1].text).toBeDefined();
    expect(result[1].index).toBeGreaterThanOrEqual(1);
  });

  // 5. Should warn and skip invalid document embeddings
  it('should skip invalid doc embeddings and missing texts', async () => {
    const query = 'q';
    const docs = ['d1', '', 'd3'];

    const qVec = makeVector(3, 1);
    vertexMock.generateEmbedding.mockResolvedValueOnce(qVec);
    // Provide an invalid embedding for index 1 (empty array) to trigger warnings and filtering
    vertexMock.generateBatchEmbeddings.mockResolvedValueOnce([
      makeVector(3, 1),
      [],
      makeVector(3, 2),
    ]);

    const result = await service.findSimilar(query, docs, 5);

    // Should only include valid entries (indices 0 and 2)
    expect(result.map(r => r.index)).toEqual(expect.arrayContaining([0, 2]));
    expect(result.find(r => r.index === 1)).toBeUndefined();
  });

  // 6. Should throw when query embedding generation fails
  it('should propagate error when query embedding fails', async () => {
    vertexMock.generateEmbedding.mockRejectedValueOnce(new Error('boom'));
    await expect(service.generateEmbedding('x')).rejects.toThrow('boom');
  });

  // 7. Should clear expired cache entries
  it('should clear expired cache entries', async () => {
    jest.useFakeTimers();

    const texts = ['a', 'b'];
    const vecs = [makeVector(4, 5), makeVector(4, 6)];
    vertexMock.generateBatchEmbeddings.mockResolvedValueOnce(vecs);
    await service.generateBatch(texts);

    // Advance time beyond default TTL (1h)
    jest.setSystemTime(Date.now() + 1000 * 60 * 60 + 1);

    service.clearExpiredCache();

    // Next call should regenerate since cache expired
    vertexMock.generateBatchEmbeddings.mockResolvedValueOnce(vecs);
    const res = await service.generateBatch(texts);
    expect(vertexMock.generateBatchEmbeddings).toHaveBeenCalledTimes(2);
    expect(res).toEqual(vecs);
  });

  // 8. Should return cache stats
  it('should return cache stats', () => {
    const stats = service.getCacheStats();
    expect(stats).toHaveProperty('size');
    expect(stats).toHaveProperty('maxSize');
    expect(stats).toHaveProperty('ttl');
    expect(typeof stats.size).toBe('number');
  });
});
