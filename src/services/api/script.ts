import { apiClient } from "./index";

export interface Script {
  id: string;
  projectId: string;
  title: string;
  content: string;
  type?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScriptDto {
  projectId: string;
  title: string;
  content: string;
  type?: string;
}

export interface UpdateScriptDto {
  title?: string;
  content?: string;
  type?: string;
}

export const ScriptAPI = {
  /**
   * Get all scripts for a project
   */
  async getScripts(projectId: string): Promise<{ data: Script[] }> {
    const response = await apiClient.get<Script[]>(`/scripts?projectId=${projectId}`);
    return { data: response.data };
  },

  /**
   * Get a single script by ID
   */
  async getScript(id: string): Promise<{ data: Script }> {
    const response = await apiClient.get<Script>(`/scripts/${id}`);
    return { data: response.data };
  },

  /**
   * Create a new script
   */
  async createScript(data: CreateScriptDto): Promise<{ data: Script }> {
    const response = await apiClient.post<Script>("/scripts", data);
    return { data: response.data };
  },

  /**
   * Update an existing script
   */
  async updateScript(id: string, data: UpdateScriptDto): Promise<{ data: Script }> {
    const response = await apiClient.patch<Script>(`/scripts/${id}`, data);
    return { data: response.data };
  },

  /**
   * Delete a script
   */
  async deleteScript(id: string): Promise<void> {
    await apiClient.delete(`/scripts/${id}`);
  },

  /**
   * Generate script content using AI
   */
  async generateScript(
    projectId: string,
    prompt: string,
    context?: Record<string, unknown>
  ): Promise<{ data: { content: string } }> {
    const response = await apiClient.post<{ content: string }>("/scripts/generate", {
      projectId,
      prompt,
      context,
    });
    return { data: response.data };
  },
};
