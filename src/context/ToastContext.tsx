import React from "react";

export type ToastKind = "info" | "success" | "warning" | "error";

export interface Toast {
  id: string;
  message: string;
  type: ToastKind;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastKind, options?: { duration?: number }) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

const TOAST_DURATION = 2800;

const toastStyles: Record<ToastKind, { border: string; indicator: string }> = {
  success: {
    border: "border-state-success/40",
    indicator: "bg-state-success",
  },
  error: {
    border: "border-state-danger/40",
    indicator: "bg-state-danger",
  },
  warning: {
    border: "border-state-warning/40",
    indicator: "bg-state-warning",
  },
  info: {
    border: "border-border-subtle",
    indicator: "bg-primary",
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const toastTimeouts = React.useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timeout = toastTimeouts.current[id];
    if (timeout) {
      clearTimeout(timeout);
      delete toastTimeouts.current[id];
    }
  }, []);

  const addToast = React.useCallback(
    (message: string, type: ToastKind = "info", options?: { duration?: number }) => {
      const id = Math.random().toString(36).slice(2, 9);
      const duration = options?.duration ?? TOAST_DURATION;
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      toastTimeouts.current[id] = setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  React.useEffect(() => {
    const currentToastTimeouts = toastTimeouts.current;
    return () => {
      Object.values(currentToastTimeouts).forEach(clearTimeout);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed top-6 right-6 z-50 space-y-3">
        {toasts.map((toast) => {
          const styles = toastStyles[toast.type];
          return (
            <div
              key={toast.id}
              className={`bg-surface border ${styles.border} rounded-2xl shadow-ambient px-4 py-3 text-sm text-ink-primary w-72 flex items-start gap-2`}
              role="status"
              aria-live="polite"
            >
              <span className={`mt-1 block w-2 h-2 rounded-full ${styles.indicator}`} />
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-ink-tertiary hover:text-ink-primary transition-colors"
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
