import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-canvas flex items-center justify-center p-8">
                    <div className="max-w-md w-full bg-white rounded-xl shadow-elevation p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-ink">Something went wrong</h2>
                        </div>

                        <p className="text-sm text-ink/60 mb-4">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>

                        {this.state.error && (
                            <details className="mb-4">
                                <summary className="text-xs font-mono text-ink/40 cursor-pointer hover:text-ink/60">
                                    Error details
                                </summary>
                                <pre className="text-xs font-mono text-rose-600 mt-2 p-3 bg-rose-50 rounded overflow-auto max-h-40">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full px-4 py-3 bg-ink text-white rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-ink/90 transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
