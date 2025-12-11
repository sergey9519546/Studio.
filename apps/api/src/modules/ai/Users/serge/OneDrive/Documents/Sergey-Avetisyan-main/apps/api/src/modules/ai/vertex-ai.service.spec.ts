import { Test, TestingModule } from '@nestjs/testing';
import { VertexAiService } from './vertex-ai.service';

describe('VertexAiService', () => {
  let service: VertexAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VertexAiService],
    }).compile();

    service = module.get<VertexAiService>(VertexAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
