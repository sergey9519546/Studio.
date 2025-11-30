import { Injectable, Logger, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { GoogleGenAI, Type, Part } from '@google/genai';
import { DeepReaderService } from '../intelligence/deep-reader.service';
import 'multer';

export class AIProcessingException extends HttpException {
  constructor(message: string, details?: unknown) {
    super({ message, error: 'AI_PROCESSING_ERROR', details }, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

const AI_TEAMMATE_SYSTEM_INSTRUCTION = `You are an AI engineering and product copilot for a creative agency's internal web app.

ROLE
- You are a world-class senior full-stack engineer, software architect, and product-minded tech lead.
- You specialize in AI-first apps: Gemini integration, RAG, multi-step agents, and production-grade APIs.
- You must respect and preserve the existing UX: do NOT break layouts, branding, or core flows unless explicitly asked.

CORE BEHAVIOR
1. Before proposing any change:
   - Scan and understand the existing codebase and config.
   - Identify the current frontend stack, backend stack, API patterns, and Gemini usage.
   - Summarize your understanding in clear bullet points.

2. When improving AI features, always:
   - Keep all existing features working.
   - Prefer additive, incremental improvements over rewrites.
   - Explain what you are changing and why, in terms of UX, reliability, and maintainability.

AI WORKFLOW ARCHITECTURE
- Prefer a full-stack structure with clear API routes / route handlers to:
  - Call Gemini.
  - Add auth and role-based logic (Owner vs Guest).
  - Inject project context (current user, current project, relevant files).
  - Log and persist conversations and events.

- Design the backend so it can evolve into:
  - Tool/function calling (e.g., scanRepo, runTests, summarizeErrors).
  - Retrieval-Augmented Generation (RAG) with vector search over project data.
  - Multi-step agents and workflows.

WHEN HANDLING REQUESTS, ALWAYS:
1. Context & RAG
   - Try to read and use project context: codebase, docs, specs, configurations.
   - Propose or use a vector store + embeddings to index:
     - Source code.
     - Project briefs and specs.
     - Uploaded files.
   - For each user request, identify and feed the most relevant snippets into Gemini.

2. Conversation & Memory
   - Maintain and use conversation history per user and per project.
   - Make responses history-aware (remember previous questions, decisions, and constraints).
   - Persist logs of important decisions and architectural changes.

3. Tools & Function Calling
   - When tools are available (scanRepo, runTests, summarizeErrors, fetchProjectContext, storeConversation):
     - Call tools instead of guessing.
     - Prefer reading real data over hallucinating.
   - After using tools, clearly separate:
     - Tool results.
     - Your reasoning.
     - Your final recommendations.

4. Reliability & Performance
   - Design server-side Gemini calls via backend routes to:
     - Avoid CORS issues from the browser.
     - Control streaming, retries, and timeouts.
     - Support structured logging and analytics.
   - Optimize for low latency and smooth UX.

CONSTRAINTS
- Do NOT introduce breaking changes without a migration path.
- Do NOT remove existing features unless explicitly instructed.
- Do NOT expose sensitive keys, secrets, or internal implementation details in the UI.

OUTPUT STYLE
- Think in steps: Plan → Explain → Implement.
- Use clear headings, bullet points, and code blocks.
- When writing code, assume a modern TypeScript + Node/React environment unless told otherwise.`;

@Injectable()
export class GeminiAnalystService {
  private readonly logger = new Logger(GeminiAnalystService.name);
  private readonly ai: GoogleGenAI | null = null;

  constructor(private readonly deepReader: DeepReaderService) {
    try {
      if (process.env.API_KEY) {
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      } else {
        this.logger.warn('API_KEY not set. AI features will be disabled.');
      }
    } catch (e) {
      this.logger.error('Failed to initialize GoogleGenAI client', e);
    }
  }

  async analyzeContext(
    contextData: string,
    userQuery: string,
    files?: Array<Express.Multer.File>
  ): Promise<any> {
    if (!this.ai) {
      throw new InternalServerErrorException("AI Service is not configured (Missing API_KEY).");
    }

    // Use gemini-2.0-flash-exp - newest available model with extended context window
    const model = 'gemini-2.0-flash-exp';

    // Output Schema Definition
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING, description: "A concise summary of the analysis." },
        key_insights: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3-5 key takeaways from the data."
        },
        data_points: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              row_index: { type: Type.INTEGER, description: "The Excel row number (1-based) if applicable, or 0." },
              column: { type: Type.STRING, description: "The column name or data label." },
              value: { type: Type.STRING, description: "The specific value found." },
              observation: { type: Type.STRING, description: "Why this point is relevant." }
            }
          },
          description: "Specific evidence used to support the insights."
        },
        confidence_score: { type: Type.NUMBER, description: "Confidence level between 0 and 1." }
      },
      required: ["summary", "key_insights", "data_points", "confidence_score"]
    };

    let promptText = `
    You are a Senior Data Analyst. 
    Analyze the following data context and answer the user's query.
    
    STRICT FORMATTING RULES:
    1. You must return valid JSON matching the provided schema.
    2. Do not include markdown formatting like \`\`\`json.
    3. If the data is insufficient to answer the query, state that in the summary and set confidence_score to low.

    USER QUERY: "${userQuery}"

    --- DATA CONTEXT START ---
    ${contextData}
    --- DATA CONTEXT END ---
    `;

    const contents: Part[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        // Check if file is supported natively by Gemini (PDF, Image, Audio, Video)
        const isNative = file.mimetype.startsWith('image/') ||
          file.mimetype === 'application/pdf' ||
          file.mimetype.startsWith('audio/') ||
          file.mimetype.startsWith('video/');

        if (isNative) {
          contents.push({
            inlineData: {
              mimeType: file.mimetype,
              data: file.buffer.toString('base64')
            }
          });
        } else {
          // Use DeepReader for other formats (Docx, Text, etc.)
          try {
            this.logger.debug(`Extracting text from ${file.originalname} (${file.mimetype})`);
            const extractedText = await this.deepReader.extractText(file.buffer, file.mimetype);
            promptText += `\n\n--- FILE CONTENT (${file.originalname}) ---\n${extractedText}\n--- END FILE CONTENT ---\n`;
          } catch (e) {
            this.logger.warn(`Failed to extract text from ${file.originalname}: ${e.message}`);
            promptText += `\n\n[WARNING: Could not read file ${file.originalname}]\n`;
          }
        }
      }
    }

    // Add the prompt text as the first part (or appended with extracted text)
    contents.unshift({ text: promptText });

    // Retry logic with exponential backoff
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.log(`Analyzing context with ${model} (attempt ${attempt}/${maxRetries}). Query: ${userQuery}. Files: ${files?.length || 0}`);

        const response = await this.ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: contents }],
          config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
            temperature: 0.2, // Low temperature for analytical rigor
            systemInstruction: AI_TEAMMATE_SYSTEM_INSTRUCTION,
          }
        });

        const text = response.text;

        if (!text || typeof text !== 'string') {
          throw new Error("Empty or invalid response from AI");
        }

        try {
          return JSON.parse(text);
        } catch (_parseError) {
          this.logger.error("Malformed JSON from AI", text);
          // Simple repair attempt: remove markdown fences if they slipped through
          const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
          try {
            return JSON.parse(cleaned);
          } catch (_) {
            throw new AIProcessingException("Failed to parse AI response. The model returned malformed JSON.", { raw_response: text });
          }
        }

      } catch (error: unknown) {
        lastError = error as Error;

        if (error instanceof AIProcessingException) {
          throw error; // Don't retry on parsing errors
        }

        this.logger.warn(`Attempt ${attempt} failed: ${lastError instanceof Error ? lastError.message : 'Unknown error'}`);

        // Don't retry on the last attempt
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
          this.logger.debug(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // All retries exhausted
    this.logger.error(`All ${maxRetries} attempts failed. Last error: ${lastError?.message}`);
    throw new InternalServerErrorException(`AI Analysis failed after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
  }
}