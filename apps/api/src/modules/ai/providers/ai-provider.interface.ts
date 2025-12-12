/**
 * AI Provider Interface
 * 
 * Abstraction layer for multiple AI providers (Vertex AI, OpenAI, Claude, etc.)
 */

import type { ToolCall, ToolDefinition } from '../types.js';

export interface AIProvider {
    name: string;
    models: string[];

    chat(
        messages: Array<{ role: string; content: string }>,
        systemPrompt: string,
        options?: ChatOptions
    ): Promise<string | { toolCalls: ToolCall[] }>;

    generateContent(prompt: string, options?: GenerateOptions): Promise<string>;

    extractData(prompt: string, schema?: Record<string, unknown>, options?: ExtractOptions): Promise<unknown>;

    estimateCost(inputTokens: number, outputTokens: number, model?: string): number;
}

export interface ChatOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    tools?: ToolDefinition[];
}

export interface GenerateOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
}

export interface ExtractOptions extends GenerateOptions {
    schema?: Record<string, unknown>;
}

export interface ModelInfo {
    name: string;
    inputCostPer1kTokens: number;
    outputCostPer1kTokens: number;
    maxTokens: number;
    capabilities: string[];
}
