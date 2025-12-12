import { Injectable } from '@nestjs/common';
import type { ToolCall } from '../types.js';
import { VertexAIService } from '../vertex-ai.service.js';
import { AIProvider, ChatOptions, ModelInfo } from './ai-provider.interface.js';

@Injectable()
export class VertexAIProvider implements AIProvider {
    name = 'vertex-ai';
    models = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'];

    private modelInfo: Record<string, ModelInfo> = {
        'gemini-1.5-pro': {
            name: 'gemini-1.5-pro',
            inputCostPer1kTokens: 0.00125,
            outputCostPer1kTokens: 0.00375,
            maxTokens: 1000000,
            capabilities: ['chat', 'extract', 'tools', 'vision'],
        },
        'gemini-1.5-flash': {
            name: 'gemini-1.5-flash',
            inputCostPer1kTokens: 0.000075,
            outputCostPer1kTokens: 0.0003,
            maxTokens: 1000000,
            capabilities: ['chat', 'extract', 'tools'],
        },
        'gemini-1.0-pro': {
            name: 'gemini-1.0-pro',
            inputCostPer1kTokens: 0.0005,
            outputCostPer1kTokens: 0.0015,
            maxTokens: 30720,
            capabilities: ['chat', 'extract'],
        },
    };

    constructor(private vertexAI: VertexAIService) { }

    async chat(
        messages: Array<{ role: string; content: string }>,
        systemPrompt: string,
        options?: ChatOptions
    ): Promise<string | { toolCalls: ToolCall[] }> {
        return this.vertexAI.chat(messages, systemPrompt, options?.tools);
    }

    async generateContent(prompt: string): Promise<string> {
        return this.vertexAI.generateContent(prompt);
    }

    async extractData(prompt: string, schema?: Record<string, unknown>): Promise<unknown> {
        return this.vertexAI.extractData(prompt, schema);
    }

    estimateCost(inputTokens: number, outputTokens: number, model: string = 'gemini-1.5-pro'): number {
        const modelData = this.modelInfo[model];
        if (!modelData) {
            throw new Error(`Model ${model} not found`);
        }

        return (
            (inputTokens / 1000) * modelData.inputCostPer1kTokens +
            (outputTokens / 1000) * modelData.outputCostPer1kTokens
        );
    }

    getModelInfo(model: string): ModelInfo {
        const info = this.modelInfo[model];
        if (!info) {
            throw new Error(`Model ${model} not found`);
        }
        return info;
    }

    getAllModels(): ModelInfo[] {
        return Object.values(this.modelInfo);
    }
}
