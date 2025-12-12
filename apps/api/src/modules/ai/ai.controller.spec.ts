import { Test, TestingModule } from '@nestjs/testing';
import { RAGService } from "../rag/rag.service.js";
import { AIController } from "./ai.controller.js";
import { GeminiAnalystService } from "./gemini-analyst.service.js";
import { StreamingService } from "./streaming.service.js";

describe("AIController", () => {
  let controller: AIController;

  const mockGeminiAnalystService = {
    chat: jest.fn(),
    extractData: jest.fn(),
    analyzeProjectProfitability: jest.fn(),
    analyzeFreelancerPerformance: jest.fn(),
    generateProjectBrief: jest.fn(),
    executeTool: jest.fn(),
  };

  const mockRAGService = {
    query: jest.fn(),
    getStats: jest.fn(),
  };

  const mockStreamingService = {
    chatStreamEnhanced: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AIController],
      providers: [
        {
          provide: GeminiAnalystService,
          useValue: mockGeminiAnalystService,
        },
        {
          provide: RAGService,
          useValue: mockRAGService,
        },
        {
          provide: StreamingService,
          useValue: mockStreamingService,
        },
      ],
    }).compile();

    controller = module.get<AIController>(AIController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
