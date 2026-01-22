import { describe, it, expect, vi } from 'vitest';
import { setupRequestInterceptor, setupResponseInterceptor } from './client';

describe('API Client', () => {
  it('should set up the request interceptor', () => {
    const apiClient = {
      interceptors: {
        request: {
          use: vi.fn(),
        },
      },
    };
    setupRequestInterceptor(apiClient as any);
    expect(apiClient.interceptors.request.use).toHaveBeenCalled();
  });

  it('should set up the response interceptor', () => {
    const apiClient = {
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
    };
    setupResponseInterceptor(apiClient as any);
    expect(apiClient.interceptors.response.use).toHaveBeenCalled();
  });
});
