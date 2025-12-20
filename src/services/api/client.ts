import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../types';

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
  public details?: unknown;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiException';
    this.code = error.code;
    this.statusCode = error.statusCode;
    this.details = error.details;
  }
}

/**
 * Extended request config with metadata for timing
 */
interface RequestConfigWithMetadata extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

/**
 * Error response structure from API
 */
interface ApiErrorResponse {
  message?: string;
  code?: string;
  details?: unknown;
}

/**
 * Axios error with typed response
 */
interface TypedAxiosError extends AxiosError {
  response?: AxiosResponse<ApiErrorResponse>;
}

// Error handler for API responses
export const handleApiError = (error: unknown): never => {
  const axiosError = error as TypedAxiosError;
  
  if (axiosError.response) {
    // Server responded with error status
    const apiError: ApiError = {
      message: axiosError.response.data?.message || 'An error occurred',
      code: axiosError.response.data?.code || 'UNKNOWN_ERROR',
      statusCode: axiosError.response.status,
      details: axiosError.response.data?.details,
    };
    throw new ApiException(apiError);
  } else if (axiosError.request) {
    // Network error
    const apiError: ApiError = {
      message: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR',
      statusCode: 0,
      details: axiosError.message,
    };
    throw new ApiException(apiError);
  } else {
    // Something else happened
    const err = error as Error;
    const apiError: ApiError = {
      message: err?.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      statusCode: 0,
      details: error,
    };
    throw new ApiException(apiError);
  }
};

/**
 * Retry configuration for failed requests
 */
interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryCondition: (error: ApiException | TypedAxiosError) => boolean;
}

// Retry configuration for failed requests
export const RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  retryCondition: (error: ApiException | TypedAxiosError) => {
    // Retry on network errors or 5xx server errors
    if (error instanceof ApiException) {
      return error.code === 'NETWORK_ERROR' || error.statusCode >= 500;
    }
    return (
      (error as TypedAxiosError).code === 'NETWORK_ERROR' ||
      ((error as TypedAxiosError).response?.status ?? 0) >= 500
    );
  },
};

// Request interceptor for timing metadata
export const setupRequestInterceptor = (axios: AxiosInstance): void => {
  axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      // Add request timestamp for debugging
      (config as RequestConfigWithMetadata).metadata = { startTime: new Date() };
      
      return config;
    },
    (error: unknown) => {
      return Promise.reject(error);
    }
  );
};

// Response interceptor for handling common responses
export const setupResponseInterceptor = (axios: AxiosInstance): void => {
  axios.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response time
      const endTime = new Date();
      const config = response.config as RequestConfigWithMetadata;
      const startTime = config.metadata?.startTime;
      
      if (startTime) {
        const responseTime = endTime.getTime() - startTime.getTime();
        console.log(`API Response Time: ${responseTime}ms for ${response.config.url}`);
      }
      
      return response;
    },
    (error: TypedAxiosError) => {
      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        console.warn('Access denied:', error.response.data?.message);
      }
      
      return Promise.reject(error);
    }
  );
};

// Validate environment variables
export const validateEnvironment = (): void => {
  const required = ['VITE_API_URL'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
  }
};

// Utility function to make requests
export const makeRequest = async <T>(axios: AxiosInstance, config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await axios(config);
    return response.data as T;
  } catch (error) {
    return handleApiError(error);
  }
};

// Utility function to retry failed requests
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  config: RetryConfig = RETRY_CONFIG
): Promise<T> => {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      const typedError = error as ApiException | TypedAxiosError;
      if (attempt === config.maxRetries || !config.retryCondition(typedError)) {
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, config.retryDelay * attempt));
    }
  }
  
  throw lastError;
};
