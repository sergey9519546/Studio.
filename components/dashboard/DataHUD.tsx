import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface DataHUDProps {
    label: string;
    value: string | number;
    trend?: string;
    icon: LucideIcon;
    active?: boolean;
    delay?: number;
}

const DataHUD: React.FC<DataHUDProps> = ({ label, value, trend, icon: Icon, active = false, delay = 0 }) => {
    return (
        <div
            className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 ${active
                    ? 'bg-ink text-white border-ink shadow-lg scale-[1.02]'
                    : 'bg-white text-ink border-mist'
                }`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Background Mesh (Subtle) */}
            {active && (
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 blur-[60px] rounded-full mix-blend-overlay animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500 blur-[50px] rounded-full mix-blend-overlay"></div>
                </div>
            )}

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl ${active ? 'bg-white/10 text-white' : 'bg-canvas text-pencil'} transition-colors duration-200`}>
                        <Icon size={20} strokeWidth={2} />
                    </div>
                    {trend && (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${trend.startsWith('+')
                                ? (active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-50 text-emerald-600')
                                : (active ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-50 text-rose-600')
                            }`}>
                            {trend}
                        </span>
                    )}
                </div>

                <div>
                    <h3 className={`text-3xl font-bold tracking-tight mb-1 ${active ? 'text-white' : 'text-ink'}`}>
                        {value}
                    </h3>
                    <p className={`text-xs font-semibold uppercase tracking-wide ${active ? 'text-white/70' : 'text-pencil'}`}>
                        {label}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DataHUD;
