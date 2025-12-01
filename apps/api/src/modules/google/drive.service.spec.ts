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
    });

    describe('listTeamAssets', () => {
        it('should return list of files from team folder', async () => {
            const mockFiles = [
                { id: '1', name: 'Document.docx', mimeType: 'application/vnd.google-apps.document' },
                { id: '2', name: 'Spreadsheet.xlsx', mimeType: 'application/vnd.google-apps.spreadsheet' },
            ];

            mockDrive.files.list.mockResolvedValue({
                data: { files: mockFiles },
            });

            const result = await service.listTeamAssets();

            expect(clientFactory.createDriveClient).toHaveBeenCalled();
            expect(mockDrive.files.list).toHaveBeenCalledWith({
                q: expect.stringContaining('in parents'),
                fields: 'files(id, name, mimeType, modifiedTime, webViewLink)',
                pageSize: 100,
            });
            expect(result).toEqual(mockFiles);
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

        it('should filter by mime type if specified', async () => {
            const mockFiles = [
                { id: '1', name: 'Document.docx', mimeType: 'application/vnd.google-apps.document' },
            ];

            mockDrive.files.list.mockResolvedValue({
                data: { files: mockFiles },
            });

            await service.listTeamAssets('application/vnd.google-apps.document');

            expect(mockDrive.files.list).toHaveBeenCalledWith(
                expect.objectContaining({
                    q: expect.stringContaining('mimeType'),
                })
            );
        });
    });
});
