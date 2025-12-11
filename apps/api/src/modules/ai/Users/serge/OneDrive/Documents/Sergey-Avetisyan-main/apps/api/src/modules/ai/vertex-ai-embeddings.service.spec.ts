import { Test, TestingModule } from '@nestjs/testing';
import { VertexAiEmbeddingsService } from './vertex-ai-embeddings.service';

describe('VertexAiEmbeddingsService', () => {
  let service: VertexAiEmbeddingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VertexAiEmbeddingsService],
    }).compile();

    service = module.get<VertexAiEmbeddingsService>(VertexAiEmbeddingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
