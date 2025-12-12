import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller.js';
import { PromptTesterService } from './prompt-tester.service.js';
import { AIModule } from '../ai.module.js';

@Module({
    imports: [AIModule],
    controllers: [TestingController],
    providers: [PromptTesterService],
    exports: [PromptTesterService],
})
export class TestingModule { }
