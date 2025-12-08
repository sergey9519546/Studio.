
import React, { useState, useEffect } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForceOption, setShowForceOption] = useState(false);
  const [error, setError] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    // Cleaner effect logic: Only set timer if loading
    if (!loading) {
      return;
    }

    // Use window.setTimeout to enforce Browser return type (number) explicitly
    const timer = window.setTimeout(() => {
      setShowForceOption(true);
    }, 5000); // Show manual override if stuck for 5s

    return () => window.clearTimeout(timer);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent, isForce = false) => {
    e.preventDefault();
    setLoading(true);
    setShowForceOption(false);
    setError('');

    try {
      // If forced, use the magic bypass string to skip network checks
      if (isForce) {
        await onLogin('FORCE_OFFLINE', 'bypass');
      } else {
        await onLogin(email, password);
      }
    } catch (e) {
      // If onLogin throws, stop loading
      setLoading(false);
      setError(e instanceof Error ? e.message : 'Authentication failed');
      // Re-show force option immediately if it failed
      setTimeout(() => setShowForceOption(true), 200);
    }
  };

  const handleEnterClick = () => {
    setIsFormVisible(true);
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center relative overflow-hidden font-sans selection:bg-ink selection:text-white">
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

        <main>
          {!isFormVisible ? (
            <button
              onClick={handleEnterClick}
              className="group relative w-full px-12 py-4 bg-ink text-white rounded-xl text-xs font-bold uppercase tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-[2px] transition-all duration-200"
            >
              <span className="flex items-center justify-center gap-3">
                Enter
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 -ml-2 group-hover:ml-0" />
              </span>
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 animate-enter">
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wide text-ink/60 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@studio.com"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white border border-ink/10 rounded-xl text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/30 transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wide text-ink/60 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white border border-ink/10 rounded-xl text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/30 transition-all disabled:opacity-50"
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full px-12 py-4 bg-ink text-white rounded-xl text-xs font-bold uppercase tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-[2px] transition-all duration-200 disabled:opacity-70 disabled:translate-y-0 disabled:shadow-none active:scale-[0.98]"
              >
                <span className="flex items-center justify-center gap-3">
                  {loading ? (
                    <span className="animate-pulse">Authenticating...</span>
                  ) : (
                    <>Sign In <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 -ml-2 group-hover:ml-0" /></>
                  )}
                </span>
              </button>

              {/* Emergency Bypass for "Stuck" State */}
              {showForceOption && (
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  className="w-full flex items-center justify-center gap-2 text-xs text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-lg transition-colors font-medium animate-in fade-in slide-in-from-top-2"
                >
                  <AlertCircle size={14} /> Force Offline Entry
                </button>
              )}
            </form>
          )}
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
