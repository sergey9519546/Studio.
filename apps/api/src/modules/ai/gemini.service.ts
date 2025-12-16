import { GoogleGenAI } from '@google/genai';
import type { SafetySetting, HarmCategory } from '@google/genai';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { writeFile } from 'fs/promises';
import { Script, createContext } from 'vm';

/**
 * Service for interacting with Google's Gemini API using the new Gen AI SDK
 * Supports both direct API and Vertex AI based on environment configuration
 */

type GeminiClientConfig = ConstructorParameters<typeof GoogleGenAI>[0];

interface ToolDefinition {
  type: 'function';
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

interface CodeExecutionOptions {
  model?: string;
}

interface ImageGenerationOptions {
  style?: 'natural' | 'vivid' | 'artistic';
  model?: string;
  savePath?: string;
}

interface DeepResearchOptions {
  background?: boolean;
  maxWaitTime?: number;
}

interface MultiToolOptions {
  model?: string;
  agent?: string;
  background?: boolean;
}

interface AdvancedConversationConfig {
  initialPrompt: string;
  systemPrompt?: string;
  memorySize?: number;
  model?: string;
  tools?: Array<ToolDefinition>;
}

interface ContinueConversationOptions {
  memorySize?: number;
  model?: string;
  tools?: Array<ToolDefinition>;
}

interface CustomModelConfig {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
  stopSequences?: string[];
  candidateCount?: number;
  safetySettings?: SafetySetting[];
}

interface ContentQualityCriteria {
  checkGrammar?: boolean;
  checkClarity?: boolean;
  checkEngagement?: boolean;
  checkOriginality?: boolean;
  targetAudience?: string;
}

interface MoodboardConfig {
  theme: string;
  style?: 'minimalist' | 'vibrant' | 'elegant' | 'modern' | 'vintage' | 'industrial' | 'organic' | 'futuristic';
  colors?: string[];
  targetAudience?: string;
  projectType?: 'website' | 'branding' | 'product' | 'interior' | 'fashion' | 'marketing';
  mood?: string[];
  generateImages?: boolean;
  imageCount?: number;
}

interface ConversationMemory {
  systemPrompt?: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  memorySize: number;
  model: string;
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private client: GoogleGenAI;
  private conversationMemory = new Map<string, ConversationMemory>();

  constructor(private configService: ConfigService) {
    const useVertexAI = this.configService.get<string>('GOOGLE_GENAI_USE_VERTEXAI') === 'true' ||
                       this.configService.get<string>('GOOGLE_GENAI_USE_VERTEXAI') === 'True';

    let clientConfig: GeminiClientConfig = {
      vertexai: false,
    };

    if (useVertexAI) {
      const project = this.configService.get<string>('GOOGLE_CLOUD_PROJECT');
      const location = this.configService.get<string>('GOOGLE_CLOUD_LOCATION') || 'us-central1';
      const apiVersion = this.configService.get<string>('GOOGLE_GENAI_API_VERSION') || 'v1';

      if (!project) {
        this.logger.error('GOOGLE_CLOUD_PROJECT is required when using Vertex AI');
        throw new Error('GOOGLE_CLOUD_PROJECT is required when using Vertex AI');
      }

      clientConfig = {
        vertexai: true,
        project,
        location,
        apiVersion,
      };

      this.logger.log(`Google Gemini AI Service initialized with Vertex AI (project: ${project}, location: ${location}, apiVersion: ${apiVersion})`);
    } else {
      const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
      const apiVersion = this.configService.get<string>('GOOGLE_GENAI_API_VERSION') || 'v1alpha';

      if (!apiKey) {
        this.logger.warn('GOOGLE_API_KEY not configured. Service will not be functional.');
      }

      clientConfig = {
        vertexai: false,
        apiKey: apiKey || 'placeholder',
        apiVersion,
      };

      this.logger.log(`Google Gemini AI Service initialized with Developer API (apiVersion: ${apiVersion})`);
    }

    this.client = new GoogleGenAI(clientConfig);
  }

  async chat(
    messages: Array<{ role: string; content: string }>,
    systemPrompt?: string,
    model: string = 'gemini-2.0-flash-exp'
  ): Promise<string> {
    try {
      const contents = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      if (systemPrompt) {
        contents.unshift({
          role: 'user',
          parts: [{ text: `System instructions: ${systemPrompt}` }],
        });
      }

      const response = await this.client.models.generateContent({
        model,
        contents,
        config: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 0.95,
          topK: 40,
        },
      });

      const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('No content in response');
      }

      return text;
    } catch (error) {
      this.logger.error('Error calling Gemini chat API:', error);
      throw error;
    }
  }

  async generateContent(
    prompt: string,
    model: string = 'gemini-2.0-flash-exp'
  ): Promise<string> {
    try {
      const response = await this.client.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('No content generated by Gemini');
      }

      return text;
    } catch (error) {
      this.logger.error('Error generating content from Gemini:', error);
      throw error;
    }
  }

  async *streamContent(
    prompt: string,
    model: string = 'gemini-2.0-flash-exp'
  ): AsyncGenerator<string> {
    try {
      const response = await this.client.models.generateContentStream({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      for await (const chunk of response) {
        const chunkText = chunk.text;
        if (chunkText) {
          yield chunkText;
        }
      }
    } catch (error) {
      this.logger.error('Error streaming content from Gemini:', error);
      throw error;
    }
  }

  async *streamChat(
    messages: Array<{ role: string; content: string }>,
    systemPrompt?: string,
    model: string = 'gemini-2.0-flash-exp'
  ): AsyncGenerator<string> {
    try {
      const contents = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      if (systemPrompt) {
        contents.unshift({
          role: 'user',
          parts: [{ text: `System instructions: ${systemPrompt}` }],
        });
      }

      const response = await this.client.models.generateContentStream({
        model,
        contents,
        config: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 0.95,
          topK: 40,
        },
      });

      for await (const chunk of response) {
        const chunkText = chunk.text;
        if (chunkText) {
          yield chunkText;
        }
      }
    } catch (error) {
      this.logger.error('Error streaming chat response from Gemini:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<{
    status: string;
    configured: boolean;
    provider: string;
    mode: string;
  }> {
    const useVertexAI = this.configService.get<string>('GOOGLE_GENAI_USE_VERTEXAI') === 'true' ||
                       this.configService.get<string>('GOOGLE_GENAI_USE_VERTEXAI') === 'True';

    let configured = false;

    if (useVertexAI) {
      const project = this.configService.get<string>('GOOGLE_CLOUD_PROJECT');
      configured = !!project;
    } else {
      const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
      configured = !!apiKey;
    }

    return {
      status: configured ? 'operational' : 'not_configured',
      configured,
      provider: 'Google Gemini AI',
      mode: useVertexAI ? 'Vertex AI' : 'Direct API',
    };
  }

  // Helper utilities
  private buildSearchContext(query: string): { keywords: string[]; summary: string; nextStep: string } {
    const keywords = this.extractKeywords(query);
    const summary = keywords.length
      ? `Focus on ${keywords.join(', ')} with concise, factual notes.`
      : 'Provide a concise response with clear next steps.';
    const nextStep = keywords.length
      ? `Validate facts for ${keywords[0]} using a trusted source.`
      : 'Clarify the objective to provide more targeted guidance.';

    return { keywords, summary, nextStep };
  }

  private extractKeywords(text: string): string[] {
    return Array.from(
      new Set(
        text
          .toLowerCase()
          .split(/[^a-z0-9]+/i)
          .filter(token => token.length > 3)
      )
    ).slice(0, 8);
  }

  private buildExecutionOutput(logs: string[], result: unknown): string {
    const sections: string[] = [];
    if (logs.length) {
      sections.push(`Console:\n${logs.join('\n')}`);
    }

    if (typeof result !== 'undefined') {
      sections.push(`Result: ${this.stringify(result)}`);
    }

    return sections.join('\n') || 'No output';
  }

  private stringify(value: unknown): string {
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return value.toString();
    if (value === null || value === undefined) return String(value);
    try {
      return JSON.stringify(value);
    } catch {
      return '[unserializable]';
    }
  }

  private trimHistory(history: Array<{ role: 'user' | 'assistant'; content: string }>, memorySize: number) {
    const maxEntries = Math.max(2, memorySize * 2);
    return history.slice(-maxEntries);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private buildPromptSvg(prompt: string, style?: string): string {
    const palette: Record<string, string> = {
      natural: '#88c0d0',
      vivid: '#ff6b6b',
      artistic: '#9b5de5',
      modern: '#4c566a',
      elegant: '#22223b',
      minimalist: '#eceff4',
      vibrant: '#f2a365',
    };
    const background = palette[style || 'modern'] || '#4c566a';
    const sanitized = prompt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return `
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${background}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#111827" stop-opacity="0.95"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#bg)" rx="12" />
  <text x="32" y="80" fill="#e5e7eb" font-family="Inter, sans-serif" font-size="22" font-weight="600">AI Generated Concept</text>
  <text x="32" y="120" fill="#cbd5e1" font-family="Inter, sans-serif" font-size="18">Prompt:</text>
  <foreignObject x="32" y="140" width="576" height="180">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color:#e5e7eb;font-family:Inter, sans-serif;font-size:16px;line-height:1.4;">
      ${sanitized}
    </div>
  </foreignObject>
</svg>`;
  }

  private buildResearchOutline(query: string, keywords: string[]): string[] {
    const steps = [
      `Objective: ${query}`,
      `Key areas: ${keywords.join(', ') || 'general context'}`,
      `Check: statistics, recent developments, and risks.`,
      'Provide concise findings with actionable recommendations.'
    ];
    return steps;
  }

  private buildOfflineSources(keywords: string[]): string[] {
    if (!keywords.length) {
      return ['https://developer.google.com/search/docs', 'https://cloud.google.com/generative-ai'];
    }
    return keywords.slice(0, 3).map(term => `https://www.google.com/search?q=${encodeURIComponent(term)}`);
  }

  private buildFallbackConversationReply(input: string): string {
    return `I noted your message: "${input}". I cannot reach the model right now, so here is a concise reflection:\n- Key intent: ${this.extractKeywords(input).join(', ') || 'general inquiry'}\n- Next step: clarify desired outcome and constraints.`;
  }

  private clampScore(value: number): number {
    if (Number.isNaN(value)) return 0;
    return Math.max(0, Math.min(10, Number(value.toFixed(1))));
  }

  private derivePaletteFromTheme(theme: string): string[] {
    const normalized = theme.toLowerCase();
    if (normalized.includes('nature')) return ['#2E7D32', '#81C784', '#A5D6A7', '#C8E6C9'];
    if (normalized.includes('tech')) return ['#0EA5E9', '#1D4ED8', '#0F172A', '#38BDF8'];
    if (normalized.includes('luxury')) return ['#111827', '#1F2937', '#D97706', '#FCD34D'];
    return ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
  }

  async generateWithGoogleSearch(query: string, model?: string): Promise<string> {
    const trimmed = query.trim();
    if (!trimmed) {
      throw new BadRequestException('Query is required');
    }

    const searchContext = this.buildSearchContext(trimmed);
    const prompt = [
      'You are answering a user query using offline heuristics.',
      'Use the provided key topics to craft a concise, actionable summary with 3 bullet points and one next step.',
      `Query: ${trimmed}`,
      `Key topics: ${searchContext.keywords.join(', ') || 'none'}`,
    ].join('\n');

    try {
      return await this.generateContent(prompt, model);
    } catch (error) {
      this.logger.warn(`Gemini generateWithGoogleSearch fallback used: ${error instanceof Error ? error.message : 'unknown error'}`);
      return [
        `Summary for: "${trimmed}"`,
        searchContext.summary,
        `Next step: ${searchContext.nextStep}`
      ].join('\n');
    }
  }

  async executeCode(code: string, language?: string, _options?: CodeExecutionOptions): Promise<{
    output: string;
    error?: string;
    executionTime?: number;
  }> {
    const lang = (language || 'javascript').toLowerCase();
    if (!['javascript', 'js'].includes(lang)) {
      throw new BadRequestException(`Unsupported language for execution: ${language || 'unspecified'}`);
    }

    const logs: string[] = [];
    const sandbox = {
      console: {
        log: (...args: unknown[]) => logs.push(args.map(this.stringify).join(' ')),
        error: (...args: unknown[]) => logs.push(args.map(this.stringify).join(' ')),
      },
    };

    const context = createContext(sandbox);
    const script = new Script(code, { filename: 'user-code.js' });
    const start = Date.now();

    try {
      const result = script.runInContext(context, { timeout: 1000 });
      const executionTime = Date.now() - start;
      const output = this.buildExecutionOutput(logs, result);

      return { output, executionTime };
    } catch (error) {
      const executionTime = Date.now() - start;
      const message = error instanceof Error ? error.message : 'Unknown execution error';
      this.logger.warn(`Code execution failed: ${message}`);
      return { output: logs.join('\n'), error: message, executionTime };
    }
  }

  async generateImage(prompt: string, options?: ImageGenerationOptions): Promise<{
    imageUrl?: string;
    savePath?: string;
    prompt: string;
    metadata?: Record<string, unknown>;
  }> {
    const svg = this.buildPromptSvg(prompt, options?.style);
    const imageUrl = `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;

    if (options?.savePath) {
      try {
        await writeFile(options.savePath, svg, 'utf8');
      } catch (error) {
        this.logger.warn(`Failed to save generated image to ${options.savePath}: ${error instanceof Error ? error.message : 'unknown error'}`);
      }
    }

    return {
      imageUrl,
      savePath: options?.savePath,
      prompt,
      metadata: {
        style: options?.style || 'natural',
        model: options?.model || 'gemini-2.0-flash-exp',
        type: 'svg-placeholder'
      }
    };
  }

  async performDeepResearch(query: string, _options?: DeepResearchOptions): Promise<{
    query: string;
    results: string;
    sources: string[];
    confidence: number;
  }> {
    const keywords = this.extractKeywords(query);
    const outline = this.buildResearchOutline(query, keywords);
    const sources = this.buildOfflineSources(keywords);

    return {
      query,
      results: outline.join('\n'),
      sources,
      confidence: Math.min(0.95, 0.45 + Math.min(0.4, keywords.length * 0.05))
    };
  }

  async createMultiToolInteraction(input: string, tools: Array<'google_search' | 'code_execution' | ToolDefinition>, options?: MultiToolOptions): Promise<{
    input: string;
    response: string;
    toolsUsed: string[];
    results: unknown[];
  }> {
    const toolsUsed: string[] = [];
    const results: unknown[] = [];

    for (const tool of tools) {
      if (tool === 'google_search') {
        toolsUsed.push('google_search');
        const result = await this.generateWithGoogleSearch(input, options?.model);
        results.push({ tool: 'google_search', result });
        continue;
      }

      if (tool === 'code_execution') {
        toolsUsed.push('code_execution');
        const execution = await this.executeCode(input, 'javascript');
        results.push({ tool: 'code_execution', result: execution });
        continue;
      }

      if (typeof tool === 'object') {
        toolsUsed.push(tool.name);
        results.push({
          tool: tool.name,
          description: tool.description,
          status: 'not_executed',
          reason: 'Custom tool execution is not wired up in this service',
        });
      }
    }

    const response = results
      .map(r => typeof r === 'object' ? JSON.stringify(r) : String(r))
      .join('\n');

    return {
      input,
      response: response || 'No tools executed',
      toolsUsed,
      results
    };
  }

  async createAdvancedConversation(config: AdvancedConversationConfig): Promise<{
    conversationId: string;
    response: string;
    memoryUsed: number;
  }> {
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const model = config.model || 'gemini-2.0-flash-exp';
    const memorySize = config.memorySize ?? 10;

    let response: string;
    try {
      response = await this.chat(
        [{ role: 'user', content: config.initialPrompt }],
        config.systemPrompt,
        model
      );
    } catch (error) {
      this.logger.warn(`Advanced conversation fallback used: ${error instanceof Error ? error.message : 'unknown error'}`);
      response = this.buildFallbackConversationReply(config.initialPrompt);
    }

    this.conversationMemory.set(conversationId, {
      systemPrompt: config.systemPrompt,
      history: [
        { role: 'user', content: config.initialPrompt },
        { role: 'assistant', content: response }
      ],
      memorySize,
      model,
    });

    return {
      conversationId,
      response,
      memoryUsed: Math.min(memorySize, 2)
    };
  }

  async continueAdvancedConversation(conversationId: string, userMessage: string, conversationHistory: Array<{ role: string; content: string }>, options?: ContinueConversationOptions): Promise<{
    conversationId: string;
    response: string;
    memoryUsed: number;
  }> {
    const memory = this.conversationMemory.get(conversationId);
    if (!memory) {
      throw new BadRequestException('Conversation not found or expired');
    }

    const updatedMemory = { ...memory };
    updatedMemory.memorySize = options?.memorySize ?? memory.memorySize;
    updatedMemory.model = options?.model ?? memory.model;
    if (conversationHistory?.length) {
      updatedMemory.history = conversationHistory
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content }));
    }

    updatedMemory.history.push({ role: 'user', content: userMessage });
    updatedMemory.history = this.trimHistory(updatedMemory.history, updatedMemory.memorySize);

    let response: string;
    try {
      response = await this.chat(updatedMemory.history, updatedMemory.systemPrompt, updatedMemory.model);
    } catch (error) {
      this.logger.warn(`Continue conversation fallback used: ${error instanceof Error ? error.message : 'unknown error'}`);
      response = this.buildFallbackConversationReply(userMessage);
    }

    updatedMemory.history.push({ role: 'assistant', content: response });
    updatedMemory.history = this.trimHistory(updatedMemory.history, updatedMemory.memorySize);

    this.conversationMemory.set(conversationId, updatedMemory);

    return {
      conversationId,
      response,
      memoryUsed: updatedMemory.history.length
    };
  }

  async batchGenerateContent(prompts: Array<{
    prompt: string;
    model?: string;
    temperature?: number;
  }>, options?: {
    concurrency?: number;
    delay?: number;
  }): Promise<Array<{
    prompt: string;
    success: boolean;
    result?: string;
    error?: string;
    processingTime?: number;
  }>> {
    const results: Array<{
      prompt: string;
      success: boolean;
      result?: string;
      error?: string;
      processingTime?: number;
    }> = new Array(prompts.length);

    const concurrency = Math.max(1, options?.concurrency ?? 3);
    const delayMs = Math.max(0, options?.delay ?? 0);
    let cursor = 0;

    const worker = async () => {
      while (cursor < prompts.length) {
        const current = cursor++;
        const item = prompts[current];
        const start = Date.now();

        try {
          if (delayMs > 0 && current > 0) {
            await this.delay(delayMs);
          }

          const resultText = await this.generateContent(
            item.prompt,
            item.model || 'gemini-2.0-flash-exp'
          );

          results[current] = {
            prompt: item.prompt,
            success: true,
            result: resultText,
            processingTime: Date.now() - start,
          };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          results[current] = {
            prompt: item.prompt,
            success: false,
            error: message,
            processingTime: Date.now() - start,
          };
        }
      }
    };

    const workers = Array.from({ length: Math.min(concurrency, prompts.length) }, () => worker());
    await Promise.all(workers);

    return results;
  }

  async generateWithCustomConfig(prompt: string, config: CustomModelConfig): Promise<string> {
    const model = config.model || 'gemini-2.0-flash-exp';
    const safetySettings = config.safetySettings?.map(setting => ({
      ...setting,
      category: setting.category as HarmCategory | undefined,
    }));
    
    const response = await this.client.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: config.temperature || 0.7,
        maxOutputTokens: config.maxOutputTokens || 2048,
        topP: config.topP,
        topK: config.topK,
        stopSequences: config.stopSequences,
        candidateCount: config.candidateCount,
        safetySettings,
      },
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('No content generated with custom config');
    }

    return text;
  }

  async analyzeContentQuality(content: string, criteria: ContentQualityCriteria): Promise<{
    overallScore: number;
    grammar: number;
    clarity: number;
    engagement: number;
    originality: number;
    feedback: string[];
    suggestions: string[];
  }> {
    const text = content.trim();
    const wordCount = text ? text.split(/\s+/).length : 0;
    const sentenceCount = text ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const avgWordsPerSentence = sentenceCount ? wordCount / sentenceCount : wordCount;
    const longSentences = text.match(/[,;:—–-]/g)?.length ?? 0;
    const passiveHints = (text.match(/\b(been|being|was|were|is|are|be)\b/gi) || []).length;
    const exclamationCount = text.match(/\!/g)?.length ?? 0;

    const grammar = criteria.checkGrammar === false ? 0 : this.clampScore(9 - longSentences * 0.2 - passiveHints * 0.05);
    const clarity = criteria.checkClarity === false ? 0 : this.clampScore(10 - avgWordsPerSentence * 0.1);
    const engagement = criteria.checkEngagement === false ? 0 : this.clampScore(6 + Math.min(4, exclamationCount * 0.5));
    const originality = criteria.checkOriginality === false ? 0 : this.clampScore(7 + Math.min(3, wordCount * 0.001));

    const feedback: string[] = [];
    const suggestions: string[] = [];

    feedback.push(`Word count: ${wordCount}`);
    feedback.push(`Average words per sentence: ${avgWordsPerSentence.toFixed(1)}`);
    feedback.push(`Passive voice indicators: ${passiveHints}`);

    if (grammar < 7) suggestions.push('Shorten sentences and reduce dependent clauses to tighten grammar.');
    if (clarity < 7) suggestions.push('Split long sentences and introduce headings or bullets for clarity.');
    if (engagement < 7) suggestions.push('Add examples, questions, or anecdotes to increase engagement.');
    if (originality < 7) suggestions.push('Include unique data, opinions, or sources to strengthen originality.');

    const activeCriteriaCount = [
      criteria.checkGrammar !== false,
      criteria.checkClarity !== false,
      criteria.checkEngagement !== false,
      criteria.checkOriginality !== false,
    ].filter(Boolean).length || 4;

    const overallScore = this.clampScore(
      (grammar + clarity + engagement + originality) / activeCriteriaCount
    );

    return {
      overallScore,
      grammar,
      clarity,
      engagement,
      originality,
      feedback,
      suggestions
    };
  }

  async generateMoodboard(config: MoodboardConfig): Promise<{
    theme: string;
    concept: string;
    colors: string[];
    typography: string[];
    imagery: string[];
    layout: string;
    generatedImages?: Array<{
      url: string;
      description: string;
      style: string;
    }>;
    metadata: {
      style: string;
      projectType: string;
      targetAudience: string;
      mood: string[];
    };
  }> {
    const palette = config.colors || this.derivePaletteFromTheme(config.theme);
    const imageCount = config.generateImages ? Math.max(1, config.imageCount || 1) : 0;
    const generatedImages = config.generateImages
      ? Array.from({ length: imageCount }, (_, idx) => {
          const svg = this.buildPromptSvg(`${config.theme} moodboard ${idx + 1}`, config.style);
          return {
            url: `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`,
            description: `Moodboard image ${idx + 1} for ${config.theme}`,
            style: config.style || 'modern'
          };
        })
      : undefined;

    return {
      theme: config.theme,
      concept: `Moodboard concept for "${config.theme}" in a ${config.style || 'modern'} style targeting ${config.targetAudience || 'a broad audience'}.`,
      colors: palette,
      typography: ['Inter', 'Playfair Display', 'Roboto', 'Montserrat'],
      imagery: ['Modern architecture', 'Nature elements', 'Abstract patterns', 'Minimalist design'],
      layout: 'Grid-based layout with balanced spacing',
      generatedImages,
      metadata: {
        style: config.style || 'modern',
        projectType: config.projectType || 'website',
        targetAudience: config.targetAudience || 'general',
        mood: config.mood || ['professional', 'modern']
      }
    };
  }
}
