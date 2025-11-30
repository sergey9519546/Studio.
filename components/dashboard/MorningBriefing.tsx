import React from 'react';
import { Sun, ArrowUpRight } from 'lucide-react';

interface MorningBriefingProps {
    projectCount: number;
    urgentCount: number;
    assignments: number;
}

const MorningBriefing: React.FC<MorningBriefingProps> = ({ urgentCount, assignments }) => {
    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-white border border-mist p-8 shadow-card hover:shadow-lg hover:-translate-y-[2px] transition-all duration-200 group">
            {/* Glassmorphic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-100/50 text-amber-600 rounded-xl">
                            <Sun size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-pencil">Daily Briefing</span>
                    </div>
                    <h2 className="text-3xl font-semibold text-ink mb-3 tracking-tight">{greeting()}, Sergey.</h2>
                    <p className="text-ink-secondary font-medium max-w-md leading-relaxed text-sm">
                        You have <span className="text-ink font-semibold">{urgentCount} urgent</span> projects requiring attention today.
                        Team utilization is at <span className="text-ink font-semibold">85%</span> across {assignments} active assignments.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-ink text-white rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-black hover:shadow-lg hover:-translate-y-[1px] transition-all duration-200 shadow-sm active:scale-[0.98]">
                    View Schedule <ArrowUpRight size={14} />
                </button>
            </div>
        </div>
    );
};

export default MorningBriefing;
