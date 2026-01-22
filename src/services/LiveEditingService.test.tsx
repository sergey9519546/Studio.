import { describe, expect, it } from 'vitest';

import { resolveSocketBaseUrl } from './LiveEditingService';

describe('resolveSocketBaseUrl', () => {
  it('strips REST paths so sockets do not use /api/v1', () => {
    const baseUrl = resolveSocketBaseUrl(
      undefined,
      'http://localhost:3001/api/v1',
      undefined,
    );

    expect(`${baseUrl}/collaboration`).toBe('http://localhost:3001/collaboration');
    expect(`${baseUrl}/collaboration`).not.toContain('/api/v1/');
  });

  it('prefers explicit socket URL and removes REST paths', () => {
    const baseUrl = resolveSocketBaseUrl(
      'http://localhost:3001/api/v1',
      'http://localhost:3001/api/v1',
      'http://localhost:5173',
    );

    expect(baseUrl).toBe('http://localhost:3001');
  });
});
