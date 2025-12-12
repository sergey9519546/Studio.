import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard.js';

/**
 * Common module for shared guards, filters, interceptors, and pipes
 */
@Module({
    providers: [JwtAuthGuard],
    exports: [JwtAuthGuard],
})
export class CommonModule { }
