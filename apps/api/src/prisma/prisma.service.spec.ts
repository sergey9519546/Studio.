import { Logger } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "./prisma.service.js";

// Mock @prisma/client to avoid real Prisma runtime initialization
jest.mock("@prisma/client", () => {
  class PrismaClient {
    $connect = jest.fn().mockResolvedValue(undefined);
    $disconnect = jest.fn().mockResolvedValue(undefined);
  }
  return { PrismaClient };
});

// Mock pg Pool
const mockPoolEnd = jest.fn().mockResolvedValue(undefined);
jest.mock("pg", () => {
  const Pool = jest.fn().mockImplementation(() => ({ end: mockPoolEnd }));
  return { Pool };
});

// Mock Prisma adapter
jest.mock("@prisma/adapter-pg", () => {
  const PrismaPg = jest.fn().mockImplementation(() => ({}));
  return { PrismaPg };
});

describe("PrismaService", () => {
  const env = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...env };
  });

  afterAll(() => {
    process.env = env;
  });

  it("Should construct with adapter when DATABASE_URL is defined", async () => {
    process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/db";

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    const service = module.get<PrismaService>(PrismaService);

    expect((service as any)._pool).toBeDefined();
  });

  it("Should construct without adapter when DATABASE_URL is not defined", async () => {
    delete process.env.DATABASE_URL;

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    const service = module.get<PrismaService>(PrismaService);

    expect((service as any)._pool).toBeUndefined();
  });

  it("onModuleInit should attempt lazy connect and log success", async () => {
    process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/db";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerLog = jest
      .spyOn(Logger.prototype as any, "log")
      .mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerWarn = jest
      .spyOn(Logger.prototype as any, "warn")
      .mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    const service = module.get<PrismaService>(PrismaService);

    service.$connect = jest.fn().mockResolvedValue(undefined);

    await service.onModuleInit();
    await Promise.resolve();

    expect(service.$connect).toHaveBeenCalled();
    expect(loggerLog).toHaveBeenCalledWith("Database connected successfully");
    expect(loggerWarn).not.toHaveBeenCalled();

    loggerLog.mockRestore();
    loggerWarn.mockRestore();
  });

  it("onModuleInit should log a warning if connect fails but not throw", async () => {
    process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/db";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loggerWarn = jest
      .spyOn(Logger.prototype as any, "warn")
      .mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    const service = module.get<PrismaService>(PrismaService);

    const error = new Error("connection failed");
    service.$connect = jest.fn().mockRejectedValue(error);

    await service.onModuleInit();
    await Promise.resolve();

    expect(loggerWarn).toHaveBeenCalled();

    loggerWarn.mockRestore();
  });

  it("onModuleDestroy should disconnect and end pool when present", async () => {
    process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/db";

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    const service = module.get<PrismaService>(PrismaService);

    const disconnectSpy = jest.fn().mockResolvedValue(undefined);
    service.$disconnect = disconnectSpy;

    await service.onModuleDestroy();

    expect(disconnectSpy).toHaveBeenCalled();
    expect(mockPoolEnd).toHaveBeenCalled();
  });
});
