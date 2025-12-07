export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description: string }>;
    required: string[];
  };
  function: (args: Record<string, unknown>) => unknown | Promise<unknown>;
}
