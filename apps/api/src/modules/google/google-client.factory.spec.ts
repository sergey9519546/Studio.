import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { GoogleClientFactory } from './google-client.factory';

describe('GoogleClientFactory', () => {
    let configService: ConfigService;

    const mockConfigService = {
        get: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GoogleClientFactory,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('initializeServiceAccount', () => {
        it('should initialize with service account credentials', () => {
            mockConfigService.get.mockImplementation((key: string) => {
                const config: Record<string, string> = {
                    GOOGLE_SERVICE_ACCOUNT_EMAIL: 'service@example.com',
                    GOOGLE_SERVICE_PRIVATE_KEY: 'mock-private-key',
                };
                return config[key];
            });

            const module = new GoogleClientFactory(configService);
            module.onModuleInit();

            expect(configService.get).toHaveBeenCalledWith('GOOGLE_SERVICE_ACCOUNT_EMAIL');
            expect(configService.get).toHaveBeenCalledWith('GOOGLE_SERVICE_PRIVATE_KEY');
        });

        it('should parse GCP_CREDENTIALS JSON if individual vars missing', () => {
            const gcpCreds = JSON.stringify({
                client_email: 'gcp@example.com',
                private_key: 'gcp-key',
            });

            mockConfigService.get.mockImplementation((key: string) => {
                if (key === 'GCP_CREDENTIALS') return gcpCreds;
                return undefined;
            });

            const module = new GoogleClientFactory(configService);
            module.onModuleInit();

            expect(configService.get).toHaveBeenCalledWith('GCP_CREDENTIALS');
        });

        it('should warn if no credentials configured', () => {
            mockConfigService.get.mockReturnValue(undefined);

            const module = new GoogleClientFactory(configService);
            module.onModuleInit();

            // Service account should not be configured
            const profile = module.getServiceAccountProfile();
            expect(profile.configured).toBe(false);
        });
    });

    describe('createAuth', () => {
        it('should create OAuth2 client with valid credentials', () => {
            mockConfigService.get.mockImplementation((key: string) => {
                const config: Record<string, string> = {
                    GOOGLE_CLIENT_ID: 'mock-client-id',
                    GOOGLE_CLIENT_SECRET: 'mock-client-secret',
                };
                return config[key];
            });

            const credentials = {
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
            };

            const module = new GoogleClientFactory(configService);
            const auth = module.createAuth(credentials);

            expect(auth).toBeDefined();
        });

        it('should throw UnauthorizedException if refresh token missing', () => {
            const module = new GoogleClientFactory(configService);

            expect(() => {
                module.createAuth({ refreshToken: '' });
            }).toThrow(UnauthorizedException);
        });
    });

    describe('createServiceAccountAuth', () => {
        it('should create JWT client for service account', () => {
            mockConfigService.get.mockImplementation((key: string) => {
                const config: Record<string, string> = {
                    GOOGLE_SERVICE_ACCOUNT_EMAIL: 'service@example.com',
                    GOOGLE_SERVICE_PRIVATE_KEY: 'mock-private-key',
                };
                return config[key];
            });

            const module = new GoogleClientFactory(configService);
            module.onModuleInit();

            const jwtClient = module.createServiceAccountAuth();

            expect(jwtClient).toBeDefined();
        });

        it('should throw error if service account not configured', () => {
            mockConfigService.get.mockReturnValue(undefined);

            const module = new GoogleClientFactory(configService);
            module.onModuleInit();

            expect(() => {
                module.createServiceAccountAuth();
            }).toThrow('Service Account configuration missing');
        });
    });

    describe('getServiceAccountProfile', () => {
        it('should return service account profile when configured', () => {
            mockConfigService.get.mockImplementation((key: string) => {
                const config: Record<string, string> = {
                    GOOGLE_SERVICE_ACCOUNT_EMAIL: 'service@example.com',
                    GOOGLE_SERVICE_PRIVATE_KEY: 'mock-private-key',
                };
                return config[key];
            });

            const module = new GoogleClientFactory(configService);
            module.onModuleInit();

            const profile = module.getServiceAccountProfile();

            expect(profile.email).toBe('service@example.com');
            expect(profile.configured).toBe(true);
        });
    });
});
