import { Injectable, Logger } from '@nestjs/common';
import { AIProvider, ChatOptions } from './ai-provider.interface';
import { VertexAIProvider } from './vertex-ai.provider';

@Injectable()
export class AIProviderManager {
    private readonly logger = new Logger(AIProviderManager.name);
    private providers = new Map<string, AIProvider>();
    private defaultProvider = 'vertex-ai';

    constructor(
        private vertexAI: VertexAIProvider,
        // Future: Add more providers
        // private openAI: OpenAIProvider,
        // private claude: ClaudeProvider,
    ) {
        this.registerProvider(vertexAI);
    }

    /**
     * Register a new AI provider
     */
    registerProvider(provider: AIProvider) {
        this.providers.set(provider.name, provider);
        this.logger.log(`Registered AI provider: ${provider.name}`);
    }

    /**
     * Get provider by name
     */
    getProvider(name?: string): AIProvider {
        const providerName = name || this.defaultProvider;
        const provider = this.providers.get(providerName);

        if (!provider) {
            throw new Error(`Provider '${providerName}' not found`);
        }

        return provider;
    }

    /**
     * Set default provider
     */
    setDefaultProvider(name: string) {
        if (!this.providers.has(name)) {
            throw new Error(`Provider '${name}' not registered`);
        }
        this.defaultProvider = name;
        this.logger.log(`Default provider set to: ${name}`);
    }

    /**
     * List all registered providers
     */
    listProviders(): string[] {
        return Array.from(this.providers.keys());
    }

    /**
     * Chat with specific provider
     */
    async chat(
        providerName: string | undefined,
        messages: Array<{ role: string; content: string }>,
        systemPrompt: string,
        options?: ChatOptions
    ) {
        const provider = this.getProvider(providerName);
        return provider.chat(messages, systemPrompt, options);
    }

    /**
     * Generate content with specific provider
     */
    async generateContent(providerName: string | undefined, prompt: string, options?: Record<string, unknown>) {
        const provider = this.getProvider(providerName);
        return provider.generateContent(prompt, options);
    }

    /**
     * Extract data with specific provider
     */
    async extractData(providerName: string | undefined, prompt: string, schema?: Record<string, unknown>, options?: Record<string, unknown>) {
        const provider = this.getProvider(providerName);
        return provider.extractData(prompt, schema, options);
    }

    /**
     * Compare costs across providers
     */
    compareCosts(inputTokens: number, outputTokens: number): Record<string, number> {
        const costs: Record<string, number> = {};

        for (const [name, provider] of this.providers) {
            try {
                costs[name] = provider.estimateCost(inputTokens, outputTokens);
            } catch (error) {
                this.logger.warn(`Cost estimation failed for ${name}: ${error.message}`);
            }
        }

        return costs;
    }
}
