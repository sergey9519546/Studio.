import axios from 'axios';
import { API_CONFIG, setupRequestInterceptor, setupResponseInterceptor } from './client';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

// Setup interceptors
setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient);

// Export configured axios instance
export default apiClient;

// Export configuration
export { API_CONFIG } from './client';
