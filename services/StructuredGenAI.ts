/**
 * MODULE: Structured Output Layer
 * 
 * DESCRIPTION:
 * Enforces deterministic data structures from probabilistic LLM outputs.
 * Combines strict Zod schema validation with auto-retry logic to guarantee 
 * that the application receives valid JSON, or throws a descriptive error.
 * 
 * REFERENCES:
 * - Structured Outputs [11]
 * - Zod Schema Validation [12]
 */

import { z } from 'zod';
import { GenAIService } from './GenAIService';
import { withResilience } from './ResilienceLayer';

export class StructuredGenAI {

  /**
   * Generates content and validates it against a Zod schema.
   * 
   * @param aiService - Instance of the GenAIService
   * @param prompt - The user prompt
   * @param schema - The Zod schema object defining the expected shape
   * @returns The typed data object conforming to Schema T
   */
  public static async generateStructured<T>(
    _aiService: GenAIService,
    prompt: string,
    schema: z.ZodType<T>
  ): Promise<T> {
    return await withResilience(async () => {
      try {
        const response = await fetch('/api/ai/extract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            schema,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch response');
        }

        const data = await response.json();
        return schema.parse(data);
      } catch (error) {
        throw new Error(`Structured Generation Failed: Validation Error. ${error instanceof Error ? error.message : ''}`);
      }
    });
  }
}