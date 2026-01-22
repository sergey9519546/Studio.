import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ToastProvider, useToast } from './ToastContext';

describe('ToastContext', () => {
  it('should add and remove a toast', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addToast('Test Toast');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Test Toast');

    act(() => {
      result.current.removeToast(result.current.toasts[0].id);
    });

    expect(result.current.toasts).toHaveLength(0);
  });
});
