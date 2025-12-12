import { Module } from '@nestjs/common';
import { ToolHandlersService } from './tool-handlers.service.js';

@Module({
    providers: [ToolHandlersService],
    exports: [ToolHandlersService],
})
export class ToolsModule { }
