import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { GoogleDriveAdapter } from "./adapters/google-drive.adapter.js";
import { CloudStorageController } from "./cloud-storage.controller.js";
import { CloudStorageService } from "./cloud-storage.service.js";
import { CloudProviderType } from "./dto/cloud-storage.dto.js";

// Simple mock for GoogleDriveAdapter
const mockGoogleDriveAdapter = {
  providerId: CloudProviderType.GOOGLE_DRIVE,
  isConnected: jest.fn(),
  getAuthUrl: jest.fn(),
  listFiles: jest.fn(),
};

// Helper to build a fake request with user
interface FakeRequest {
  user: { id: string; email: string };
}
const makeRequest = (userId: string): FakeRequest => ({
  user: { id: userId, email: "test@example.com" },
});

describe("CloudStorageService", () => {
  let service: CloudStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudStorageService,
        {
          provide: GoogleDriveAdapter,
          useValue: mockGoogleDriveAdapter,
        },
      ],
    }).compile();

    service = module.get<CloudStorageService>(CloudStorageService);

    jest.clearAllMocks();
  });

  it("should return provider options with connection state and auth url", async () => {
    mockGoogleDriveAdapter.isConnected.mockResolvedValueOnce(true);
    mockGoogleDriveAdapter.getAuthUrl.mockResolvedValueOnce("https://auth-url");

    const result = await service.getProviderOptions(123);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: CloudProviderType.GOOGLE_DRIVE,
      name: "Google Drive",
      iconUrl: "https://cdn.simpleicons.org/googledrive",
      isConnected: true,
      authUrl: "https://auth-url",
    });

    expect(mockGoogleDriveAdapter.isConnected).toHaveBeenCalledWith(123);
    expect(mockGoogleDriveAdapter.getAuthUrl).toHaveBeenCalledWith(123);
  });

  it("should throw for unsupported provider in listFiles", async () => {
    await expect(
      service.listFiles(1, "unknown-provider", undefined)
    ).rejects.toThrow(
      new BadRequestException("Provider 'unknown-provider' is not supported.")
    );
  });

  it("should throw when user is not connected to provider", async () => {
    mockGoogleDriveAdapter.isConnected.mockResolvedValueOnce(false);

    await expect(
      service.listFiles(1, CloudProviderType.GOOGLE_DRIVE, undefined)
    ).rejects.toThrow(
      new BadRequestException(
        `User is not connected to ${CloudProviderType.GOOGLE_DRIVE}`
      )
    );

    expect(mockGoogleDriveAdapter.isConnected).toHaveBeenCalledWith(1);
  });

  it("should return files from adapter when connected", async () => {
    mockGoogleDriveAdapter.isConnected.mockResolvedValueOnce(true);
    mockGoogleDriveAdapter.listFiles.mockResolvedValueOnce({
      files: [
        {
          id: "1",
          name: "file1",
          mimeType: "text/plain",
          modifiedTime: "2025-01-01",
          size: "123",
        },
      ],
      nextPageToken: "next-page",
    });

    const result = await service.listFiles(
      1,
      CloudProviderType.GOOGLE_DRIVE,
      "folder-1"
    );

    expect(mockGoogleDriveAdapter.isConnected).toHaveBeenCalledWith(1);
    expect(mockGoogleDriveAdapter.listFiles).toHaveBeenCalledWith(
      1,
      "folder-1"
    );
    expect(result).toEqual({
      files: [
        {
          id: "1",
          name: "file1",
          mimeType: "text/plain",
          modifiedTime: "2025-01-01",
          size: "123",
        },
      ],
      nextPageToken: "next-page",
    });
  });
});

describe("CloudStorageController", () => {
  let controller: CloudStorageController;
  let service: CloudStorageService;

  const mockCloudStorageService = {
    getProviderOptions: jest.fn(),
    listFiles: jest.fn(),
  } as unknown as jest.Mocked<CloudStorageService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudStorageController],
      providers: [
        {
          provide: CloudStorageService,
          useValue: mockCloudStorageService,
        },
      ],
    }).compile();

    controller = module.get<CloudStorageController>(CloudStorageController);
    service = module.get<CloudStorageService>(CloudStorageService);

    jest.clearAllMocks();
  });

  it("should delegate to service.getProviderOptions with parsed user id", async () => {
    (service.getProviderOptions as jest.Mock).mockResolvedValueOnce([]);

    const req = makeRequest("42");
    const result = await controller.getOptions(req as any);

    expect(service.getProviderOptions).toHaveBeenCalledWith(42);
    expect(result).toEqual([]);
  });

  it("should delegate to service.listFiles with provider, folderId and parsed user id", async () => {
    (service.listFiles as jest.Mock).mockResolvedValueOnce({
      files: [],
      nextPageToken: undefined,
    });

    const req = makeRequest("7");
    const query = { folderId: "root", pageToken: "token" };
    const result = await controller.listFiles(
      "google-drive",
      query,
      req as any
    );

    expect(service.listFiles).toHaveBeenCalledWith(7, "google-drive", "root");
    expect(result).toEqual({ files: [], nextPageToken: undefined });
  });
});
