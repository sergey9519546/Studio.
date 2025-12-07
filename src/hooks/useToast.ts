import React from "react";

export type ToastKind = "info" | "success";

export interface Toast {
  id: number;
  message: string;
  type: ToastKind;
}

interface UseToastReturn {
  toasts: Toast[];
  addToast: (message: string, type?: ToastKind) => void;
}

const TOAST_DURATION = 2800;

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const toastTimeouts = React.useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const addToast = React.useCallback((message: string, type: ToastKind = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    const timeout = setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      delete toastTimeouts.current[id];
    }, TOAST_DURATION);
    toastTimeouts.current[id] = timeout;
  }, []);

  React.useEffect(() => {
    const currentToastTimeouts = toastTimeouts.current;
    return () => {
      Object.values(currentToastTimeouts).forEach(clearTimeout);
    };
  }, []);

  return {
    toasts,
    addToast,
  };
};
