import { describe, it, expect } from 'vitest';
import { getErrorMessage } from './errors';

describe('getErrorMessage', () => {
  it('should return the message from an Error object', () => {
    const error = new Error('test message');
    expect(getErrorMessage(error, 'default')).toBe('test message');
  });

  it('should return the default message for a non-Error object', () => {
    const error = { some: 'object' };
    expect(getErrorMessage(error, 'default')).toBe('default');
  });

  it('should return the default message for a string', () => {
    const error = 'a string error';
    expect(getErrorMessage(error, 'default')).toBe('default');
  });

  it('should return the default message for null', () => {
    const error = null;
    expect(getErrorMessage(error, 'default')).toBe('default');
  });

  it('should return the default message for undefined', () => {
    const error = undefined;
    expect(getErrorMessage(error, 'default')).toBe('default');
  });
});
