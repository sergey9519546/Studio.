import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { PromptTesterService } from './prompt-tester.service';
import { AIModule } from '../ai.module';

@Module({
    imports: [AIModule],
    controllers: [TestingController],
    providers: [PromptTesterService],
    exports: [PromptTesterService],
})
export class TestingModule { }
