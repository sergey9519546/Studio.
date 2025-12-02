import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { SheetIngestorService } from './sheet-ingestor.service';
import { GoogleClientFactory } from './google-client.factory';

describe('SheetIngestorService', () => {
    let service: SheetIngestorService;
    let clientFactory: GoogleClientFactory;

    const mockSheets = {
        spreadsheets: {
            get: jest.fn(),
            values: {
                get: jest.fn(),
            },
        },
    };

    const mockClientFactory = {
        createClients: jest.fn().mockReturnValue({ sheets: mockSheets }),
    };

    const mockUser = {
        id: '1',
        email: 'test@example.com',
        googleCredentials: {
            accessToken: 'token',
            refreshToken: 'refresh',
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SheetIngestorService,
                {
                    provide: GoogleClientFactory,
                    useValue: mockClientFactory,
                },
            ],
        }).compile();

        service = module.get<SheetIngestorService>(SheetIngestorService);
        clientFactory = module.get<GoogleClientFactory>(GoogleClientFactory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchAndFormatSheet', () => {
        it('should fetch and convert sheet to markdown', async () => {
            const mockMetadata = {
                data: {
                    sheets: [
                        { properties: { title: 'Sheet1', hidden: false } },
                    ],
                },
            };

            const mockData = {
                data: {
                    values: [
                        ['Name', 'Email', 'Role'],
                        ['John Doe', 'john@example.com', 'Developer'],
                        ['Jane Smith', 'jane@example.com', 'Designer'],
                    ],
                },
            };

            mockSheets.spreadsheets.get.mockResolvedValue(mockMetadata);
            mockSheets.spreadsheets.values.get.mockResolvedValue(mockData);

            const result = await service.fetchAndFormatSheet(mockUser, 'file-123');

            expect(result).toContain('Name');
            expect(result).toContain('John Doe');
            expect(result).toContain('|');
            expect(mockSheets.spreadsheets.get).toHaveBeenCalledWith({
                spreadsheetId: 'file-123',
            });
            expect(mockSheets.spreadsheets.values.get).toHaveBeenCalledWith({
                spreadsheetId: 'file-123',
                range: 'Sheet1',
                valueRenderOption: 'FORMATTED_VALUE',
            });
        });

        it('should throw BadRequestException for missing credentials', async () => {
            const userWithoutCreds = { ...mockUser, googleCredentials: undefined };

            await expect(
                service.fetchAndFormatSheet(userWithoutCreds, 'file-123')
            ).rejects.toThrow(BadRequestException);
        });

        it('should return empty message for empty sheet', async () => {
            mockSheets.spreadsheets.get.mockResolvedValue({
                data: { sheets: [{ properties: { title: 'Sheet1' } }] },
            });
            mockSheets.spreadsheets.values.get.mockResolvedValue({
                data: { values: [] },
            });

            const result = await service.fetchAndFormatSheet(mockUser, 'file-123');

            expect(result).toBe('The sheet appears to be empty.');
        });

        it('should handle truncation for large datasets', async () => {
            const largeData = {
                data: {
                    values: Array(600).fill(['col1', 'col2', 'col3']),
                },
            };

            mockSheets.spreadsheets.get.mockResolvedValue({
                data: { sheets: [{ properties: { title: 'Sheet1' } }] },
            });
            mockSheets.spreadsheets.values.get.mockResolvedValue(largeData);

            const result = await service.fetchAndFormatSheet(mockUser, 'file-123');

            // Service should return truncated data (check it's not empty)
            expect(result.length).toBeGreaterThan(0);
            expect(result).toContain('col1');
        });

        it('should throw error for no visible sheets', async () => {
            mockSheets.spreadsheets.get.mockResolvedValue({
                data: { sheets: [{ properties: { hidden: true } }] },
            });

            await expect(
                service.fetchAndFormatSheet(mockUser, 'file-123')
            ).rejects.toThrow(BadRequestException);
        });
    });
});
