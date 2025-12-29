import type { Content } from "firebase/ai";
import { model } from "../firebase";

type HistoryMessage = {
  role: "user" | "system" | "assistant" | "model";
  text: string;
};

type GenerateOptions = {
  systemInstruction?: string;
  context?: string;
  history?: HistoryMessage[];
};

export class GenAIService {
  private static instance: GenAIService | null = null;
  private isAiAvailable = true;

  static getInstance(): GenAIService {
    if (!GenAIService.instance) {
      GenAIService.instance = new GenAIService();
    }
    return GenAIService.instance;
  }

  async generateEnhancedContent(
    prompt: string,
    context?: string,
    systemInstruction?: string,
    history?: HistoryMessage[]
  ): Promise<string> {
    return this.generateContent(prompt, { context, systemInstruction, history });
  }

  async generateContent(prompt: string, options: GenerateOptions = {}): Promise<string> {
    if (!this.isAiAvailable) {
      throw new Error("AI service unavailable");
    }

    try {
      const fullPrompt = [options.context, prompt].filter(Boolean).join("\n\n");
      const contents = this.buildContents(options.history, fullPrompt);

      const request = {
        contents,
        systemInstruction: options.systemInstruction,
      };

      const result = await model.generateContent(request);
      return this.extractText(result);
    } catch (error) {
      console.warn('Firebase AI service unavailable:', error);
      this.isAiAvailable = false;
      throw error;
    }
  }

  private buildContents(history: HistoryMessage[] | undefined, prompt: string): Content[] {
    const contents: Content[] = [];
    const trimmedHistory = history ? history.slice(-12) : [];

    for (const message of trimmedHistory) {
      if (!message.text) continue;
      contents.push({
        role: this.normalizeRole(message.role),
        parts: [{ text: message.text }],
      });
    }

    if (prompt) {
      contents.push({
        role: "user",
        parts: [{ text: prompt }],
      });
    }

    return contents;
  }

  private normalizeRole(role: HistoryMessage["role"]): "user" | "model" {
    return role === "user" ? "user" : "model";
  }

  private extractText(result: unknown): string {
    const response = (result as { response?: { text?: () => string } })?.response;
    if (response?.text) {
      return response.text();
    }

    const candidates = (result as { response?: { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> } })
      ?.response?.candidates;
    const parts = candidates?.[0]?.content?.parts || [];
    return parts.map((part) => part.text || "").join("").trim();
  }
}
