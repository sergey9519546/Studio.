import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { DataExtractorService } from './data-extractor.service';
import { GoogleClientFactory } from './google-client.factory';

describe('DataExtractorService', () => {
    let service: DataExtractorService;

    const mockSheets = {
        spreadsheets: {
            get: jest.fn(),
            values: {
                get: jest.fn(),
            },
        },
    };

    const mockDocs = {
        documents: {
            get: jest.fn(),
        },
    };

    const mockClientFactory = {
        createClients: jest.fn().mockReturnValue({
            sheets: mockSheets,
            docs: mockDocs,
        }),
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
                DataExtractorService,
                {
                    provide: GoogleClientFactory,
                    useValue: mockClientFactory,
                },
            ],
        }).compile();

        service = module.get<DataExtractorService>(DataExtractorService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('extractSheetData', () => {
        it('should extract and format sheet data as markdown', async () => {
            mockSheets.spreadsheets.get.mockResolvedValue({
                data: {
                    sheets: [{ properties: { title: 'Sheet1' } }],
                },
            });

            mockSheets.spreadsheets.values.get.mockResolvedValue({
                data: {
                    values: [
                        ['Project', 'Client', 'Budget'],
                        ['Alpha', 'Corp A', '50000'],
                        ['Beta', 'Corp B', '75000'],
                    ],
                },
            });

            const result = await service.extractSheetData(mockUser, 'sheet-123');

            expect(result).toContain('Project');
            expect(result).toContain('Alpha');
            expect(result).toContain('|');
            expect(result).toContain('---');
        });

        it('should handle empty sheets', async () => {
            mockSheets.spreadsheets.get.mockResolvedValue({
                data: { sheets: [{ properties: { title: 'Sheet1' } }] },
            });

            mockSheets.spreadsheets.values.get.mockResolvedValue({
                data: { values: [] },
            });

            const result = await service.extractSheetData(mockUser, 'sheet-123');

            expect(result).toBe('Sheet is empty.');
        });

        it('should truncate large datasets', async () => {
            mockSheets.spreadsheets.get.mockResolvedValue({
                data: { sheets: [{ properties: { title: 'Sheet1' } }] },
            });

            mockSheets.spreadsheets.values.get.mockResolvedValue({
                data: {
                    values: Array(600).fill(['A', 'B', 'C']),
                },
            });

            const result = await service.extractSheetData(mockUser, 'sheet-123');

            expect(result).toContain('Warning');
            expect(result).toContain('truncated');
        });
    });

    describe('extractDocText', () => {
        it('should extract text from Google Doc', async () => {
            mockDocs.documents.get.mockResolvedValue({
                data: {
                    body: {
                        content: [
                            {
                                paragraph: {
                                    elements: [
                                        { textRun: { content: 'This is a test document.' } },
                                        { textRun: { content: ' With multiple elements.' } },
                                    ],
                                },
                            },
                        ],
                    },
                },
            });

            const result = await service.extractDocText(mockUser, 'doc-123');

            expect(result).toContain('This is a test document.');
            expect(result).toContain('With multiple elements.');
        });

        it('should handle empty documents', async () => {
            mockDocs.documents.get.mockResolvedValue({
                data: { body: { content: [] } },
            });

            const result = await service.extractDocText(mockUser, 'doc-123');

            expect(result).toBe('');
        });

        it('should extract text from tables', async () => {
            mockDocs.documents.get.mockResolvedValue({
                data: {
                    body: {
                        content: [
                            {
                                table: {
                                    tableRows: [
                                        {
                                            tableCells: [
                                                {
                                                    content: [
                                                        {
                                                            paragraph: {
                                                                elements: [{ textRun: { content: 'Cell 1' } }],
                                                            },
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
            });

            const result = await service.extractDocText(mockUser, 'doc-123');

            expect(result).toContain('Cell 1');
        });

        it('should throw BadRequestException on API error', async () => {
            mockDocs.documents.get.mockRejectedValue(new Error('API Error'));

            await expect(
                service.extractDocText(mockUser, 'doc-123')
            ).rejects.toThrow(BadRequestException);
        });
    });
});
