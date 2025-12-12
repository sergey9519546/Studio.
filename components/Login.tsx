
import { ArrowRight } from 'lucide-react';
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleEnterClick = async () => {
    setLoading(true);
    try {
      // Direct entry - bypass authentication
      await onLogin('DIRECT_ENTRY', 'bypass');
    } catch (e) {
      // If entry fails, still allow continue
      console.warn('Entry failed:', e);
    }
  };

  return (
    <div className="min-h-screen bg-app flex flex-col justify-center items-center relative overflow-hidden font-sans selection:bg-ink selection:text-white">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>

      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center animate-enter">
        <header className="flex items-center gap-3 mb-12">
          <h1 className="text-6xl font-semibold tracking-tighter text-ink">Studio.</h1>
          <div className="w-20 h-20 bg-ink text-white rounded-3xl flex items-center justify-center shadow-elevation transition-transform duration-500 hover:scale-105 cursor-default">
            <div className="w-5 h-5 bg-white rounded-full shadow-sm"></div>
          </div>
        </header>
        <main role="main" aria-label="Login">
          <button
            onClick={handleEnterClick}
            disabled={loading}
            aria-busy={loading}
            aria-label={loading ? "Entering application" : "Enter application"}
            className="group relative w-full min-h-[44px] px-12 py-4 bg-ink text-white rounded-xl text-xs font-bold uppercase tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-[2px] transition-all duration-200 disabled:opacity-70 disabled:translate-y-0 disabled:shadow-none active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <span className="flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <span className="animate-pulse">Entering...</span>
                  <span className="sr-only">Loading, please wait</span>
                </>
              ) : (
                <>Enter
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 -ml-2 group-hover:ml-0" aria-hidden="true" />
                </>
              )}
            </span>
          </button>
        </main>
      </div>

      <footer className="absolute bottom-12 flex flex-col items-center gap-2 opacity-30">
        <div className="h-8 w-px bg-ink"></div>
        <span className="text-[9px] font-bold text-ink uppercase tracking-widest">System Ready</span>
      </footer>
    </div>
  );
};

export default Login;
