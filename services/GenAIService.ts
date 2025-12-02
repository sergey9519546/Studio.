export class GenAIService {
    private static instance: GenAIService;

    private constructor() { }

    public static getInstance(): GenAIService {
        if (!GenAIService.instance) {
            GenAIService.instance = new GenAIService();
        }
        return GenAIService.instance;
    }

    public async generateEnhancedContent(
        prompt: string,
        _modelId?: string,
        systemInstruction?: string
    ): Promise<string> {
        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: prompt,
                    context: JSON.stringify({ systemInstruction }),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch response');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Generation failed:', error);
            throw error;
        }
    }
}