import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheController } from './cache.controller';

@Global()
@Module({
    imports: [
        NestCacheModule.register({
            ttl: 300000, // Default 5 minutes (ms)
            max: 100, // Maximum number of items in cache
            isGlobal: true,
        }),
    ],
    controllers: [CacheController],
    exports: [NestCacheModule],
})
export class CacheModule { }
