import { Test, TestingModule } from '@nestjs/testing';
import { RAGService } from "../rag/rag.service";
import { AIController } from "./ai.controller";
import { GeminiAnalystService } from "./gemini-analyst.service";
import { GeminiService } from "./gemini.service";
import { StreamingService } from "./streaming.service";
import { ConversationsService } from "../conversations/conversations.service";

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

  const mockGeminiService = {
    generateContent: jest.fn(),
    generateWithGoogleSearch: jest.fn(),
    executeCode: jest.fn(),
    generateImage: jest.fn(),
    performDeepResearch: jest.fn(),
    createMultiToolInteraction: jest.fn(),
    createAdvancedConversation: jest.fn(),
    continueAdvancedConversation: jest.fn(),
    batchGenerateContent: jest.fn(),
    generateWithCustomConfig: jest.fn(),
    healthCheck: jest.fn(),
  };

  const mockConversationsService = {
    findById: jest.fn(),
    getMessages: jest.fn(),
    create: jest.fn(),
    addMessage: jest.fn(),
    generateContextSnapshot: jest.fn(),
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
          provide: GeminiService,
          useValue: mockGeminiService,
        },
        {
          provide: RAGService,
          useValue: mockRAGService,
        },
        {
          provide: StreamingService,
          useValue: mockStreamingService,
        },
        {
          provide: ConversationsService,
          useValue: mockConversationsService,
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
