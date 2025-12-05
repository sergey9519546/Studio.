import { Test, TestingModule } from '@nestjs/testing';
import { DriveService } from './drive.service';
import { GoogleClientFactory } from './google-client.factory';

describe('DriveService', () => {
    let service: DriveService;
    let clientFactory: GoogleClientFactory;

    const mockDrive = {
        files: {
            list: jest.fn(),
        },
    };

    const mockClientFactory = {
        createDriveClient: jest.fn().mockReturnValue(mockDrive),
    };

    beforeEach(async () => {
        // Set environment variable so service doesn't return early
        process.env.GOOGLE_TEAM_FOLDER_ID = 'test-folder-id';

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DriveService,
                {
                    provide: GoogleClientFactory,
                    useValue: mockClientFactory,
                },
            ],
        }).compile();

        service = module.get<DriveService>(DriveService);
        clientFactory = module.get<GoogleClientFactory>(GoogleClientFactory);
    });

    afterEach(() => {
        jest.clearAllMocks();
        // Clean up environment variable
        delete process.env.GOOGLE_TEAM_FOLDER_ID;
    });

    describe('listTeamAssets', () => {
        it('should return list of files with DTO mapping from team folder', async () => {
            const mockFiles = [
              {
                id: "1",
                name: "Document.docx",
                mimeType: "application/vnd.google-apps.document",
                thumbnailLink: "https://thumbnail1.jpg",
                webViewLink: "https://view1",
                iconLink: "https://icon1",
                modifiedTime: "2025-01-01",
                size: "1024",
              },
              {
                id: "2",
                name: "Spreadsheet.xlsx",
                mimeType: "application/vnd.google-apps.spreadsheet",
                thumbnailLink: undefined,
                webViewLink: "https://view2",
                iconLink: undefined,
                modifiedTime: "2025-01-02",
                size: "2048",
              },
            ];

            mockDrive.files.list.mockResolvedValue({
              data: { files: mockFiles },
            });

            const result = await service.listTeamAssets();

            expect(clientFactory.createDriveClient).toHaveBeenCalled();
            expect(mockDrive.files.list).toHaveBeenCalledWith({
              q: expect.stringContaining("in parents"),
              fields:
                "files(id, name, mimeType, thumbnailLink, webViewLink, iconLink, modifiedTime, size)",
              pageSize: 100,
              orderBy: "folder, modifiedTime desc",
            });

            // Verify DTO mapping
            expect(result).toEqual([
              {
                id: "1",
                name: "Document.docx",
                mimeType: "application/vnd.google-apps.document",
                thumbnailLink: "https://thumbnail1.jpg",
                webViewLink: "https://view1",
                iconLink: "https://icon1",
                modifiedTime: "2025-01-01",
                size: "1024",
              },
              {
                id: "2",
                name: "Spreadsheet.xlsx",
                mimeType: "application/vnd.google-apps.spreadsheet",
                thumbnailLink: undefined,
                webViewLink: "https://view2",
                iconLink: undefined,
                modifiedTime: "2025-01-02",
                size: "2048",
              },
            ]);
        });

        it('should return empty array on API error', async () => {
            mockDrive.files.list.mockRejectedValue(new Error('Drive API error'));

            const result = await service.listTeamAssets();

            expect(result).toEqual([]);
        });

        it('should handle null files response', async () => {
            mockDrive.files.list.mockResolvedValue({
                data: { files: null },
            });

            const result = await service.listTeamAssets();

            expect(result).toEqual([]);
        });

        it('should filter out files with empty id', async () => {
            const mockFiles = [
                { id: '1', name: 'Document.docx', mimeType: 'application/vnd.google-apps.document' },
                { id: '', name: 'Invalid', mimeType: 'application/octet-stream' }, // Should be filtered
                { id: null, name: 'Also Invalid', mimeType: 'application/octet-stream' }, // Should be filtered
            ];

            mockDrive.files.list.mockResolvedValue({
                data: { files: mockFiles },
            });

            const result = await service.listTeamAssets();

            // Only the file with valid id should be returned
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('1');
        });
    });
});
