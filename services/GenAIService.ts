export class GenAIService {
    private static instance: GenAIService;
    private static readonly API_BASE = '/api/v1';

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
            const token = localStorage.getItem('studio_roster_v1_auth_token');
            const response = await fetch(`${GenAIService.API_BASE}/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
