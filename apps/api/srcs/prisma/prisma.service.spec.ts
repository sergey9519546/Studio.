import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { INestApplication } from '@nestjs/common';

const mockPrismaService = {
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  _db: {
    close: jest.fn(),
  },
  onModuleInit: jest.fn(),
  onModuleDestroy: jest.fn(),
};

describe('PrismaService', () => {
  let app: INestApplication;
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await app.close();
    // onModuleDestroy is called during app.close(), so we check it here
    expect(service.onModuleDestroy).toHaveBeenCalled();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call onModuleInit on application bootstrap', async () => {
    expect(service.onModuleInit).toHaveBeenCalled();
  });
});
