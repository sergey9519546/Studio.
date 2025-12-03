// AI Tool Type Definitions

export interface ToolParameter {
    type: string;
    description: string;
    enum?: string[];
    items?: {
        type: string;
    };
}

export interface ToolParameters {
    type: 'object';
    properties: Record<string, ToolParameter>;
    required: string[];
}

export interface AITool {
    name: string;
    description: string;
    parameters: ToolParameters;
}

export interface ToolCall {
    name: string;
    arguments: Record<string, unknown>;
}

export interface ToolExecutionResult {
    success: boolean;
    data?: unknown;
    error?: string;
}
