import axios from 'axios';
import { Asset } from '../types';

export const ScriptAPI = {
  scriptAssist: async (projectId: string, scriptText: string): Promise<Asset[]> => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1';
    const response = await axios.post(`${apiUrl}/projects/${projectId}/script-assist`, { scriptText });
    return response.data;
  }
};
