import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Toast, useToast } from '../../context/ToastContext';

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
    const { removeToast } = useToast();
    const [isExiting, setIsExiting] = useState(false);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => removeToast(toast.id), 300); // Wait for exit animation
    };

    useEffect(() => {
        if (toast.duration && toast.duration > 0) {
            const timer = setTimeout(() => {
                setIsExiting(true);
            }, toast.duration - 300); // Start exit animation slightly before removal
            return () => clearTimeout(timer);
        }
    }, [toast.duration]);

    const icons = {
        success: <CheckCircle size={18} className="text-emerald-500" />,
        error: <AlertCircle size={18} className="text-rose-500" />,
        info: <Info size={18} className="text-indigo-500" />,
        warning: <AlertTriangle size={18} className="text-amber-500" />
    };

    const styles = {
        success: 'bg-emerald-50 border-emerald-100 text-emerald-900',
        error: 'bg-rose-50 border-rose-100 text-rose-900',
        info: 'bg-indigo-50 border-indigo-100 text-indigo-900',
        warning: 'bg-amber-50 border-amber-100 text-amber-900'
    };

    return (
        <div
            className={`
                flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform
                ${styles[toast.type]}
                ${isExiting ? 'opacity-0 translate-x-full scale-95' : 'opacity-100 translate-x-0 scale-100'}
                animate-in slide-in-from-right-full fade-in
            `}
            role="alert"
        >
            <div className="mt-0.5 flex-shrink-0">{icons[toast.type]}</div>
            <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
            <button
                onClick={handleDismiss}
                className="p-1 -mr-1 -mt-1 rounded-lg hover:bg-black/5 transition-colors opacity-60 hover:opacity-100"
            >
                <X size={14} />
            </button>
        </div>
    );
};

export const ToastContainer: React.FC = () => {
    const { toasts } = useToast();

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
            <div className="pointer-events-auto flex flex-col gap-3">
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} />
                ))}
            </div>
        </div>
    );
};
