import { ApiError } from './types';

// Environment configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create a custom error class for API errors
export class ApiException extends Error {
  public code: string;
  public statusCode: number;
  public details?: any;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiException';
    this.code = error.code;
    this.statusCode = error.statusCode;
    this.details = error.details;
  }
}

// Error handler for API responses
export const handleApiError = (error: any): never => {
  if (error.response) {
    // Server responded with error status
    const apiError: ApiError = {
      message: error.response.data?.message || 'An error occurred',
      code: error.response.data?.code || 'UNKNOWN_ERROR',
      statusCode: error.response.status,
      details: error.response.data?.details,
    };
    throw new ApiException(apiError);
  } else if (error.request) {
    // Network error
    const apiError: ApiError = {
      message: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR',
      statusCode: 0,
      details: error.message,
    };
    throw new ApiException(apiError);
  } else {
    // Something else happened
    const apiError: ApiError = {
      message: error.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      statusCode: 0,
      details: error,
    };
    throw new ApiException(apiError);
  }
};

// Retry configuration for failed requests
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  retryCondition: (error: any) => {
    // Retry on network errors or 5xx server errors
    return (
      error.code === 'NETWORK_ERROR' ||
      (error.response && error.response.status >= 500)
    );
  },
};

// Request interceptor for adding auth tokens
export const setupRequestInterceptor = (axios: any) => {
  axios.interceptors.request.use(
    (config: any) => {
      // Add auth token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add request timestamp for debugging
      config.metadata = { startTime: new Date() };
      
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );
};

// Response interceptor for handling common responses
export const setupResponseInterceptor = (axios: any) => {
  axios.interceptors.response.use(
    (response: any) => {
      // Log response time
      const endTime = new Date();
      const responseTime = endTime.getTime() - response.config.metadata?.startTime.getTime();
      console.log(`API Response Time: ${responseTime}ms for ${response.config.url}`);
      
      return response;
    },
    (error: any) => {
      // Handle 401 Unauthorized - redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
      
      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        console.warn('Access denied:', error.response.data?.message);
      }
      
      return Promise.reject(error);
    }
  );
};

// Validate environment variables
export const validateEnvironment = () => {
  const required = ['VITE_API_URL'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
  }
};

// Utility function to make authenticated requests
export const makeRequest = async (axios: any, config: any) => {
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Utility function to retry failed requests
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  config = RETRY_CONFIG
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      if (attempt === config.maxRetries || !config.retryCondition(error)) {
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, config.retryDelay * attempt));
    }
  }
  
  throw lastError;
};
