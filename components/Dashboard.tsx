import React from 'react';
import { LayoutGrid, Activity, CalendarDays, CheckCircle2, Command, Database } from 'lucide-react';
import { Project, Freelancer, Assignment, Priority, ProjectStatus } from '../types';
import { Link } from 'react-router-dom';
import AIChat from './AIChat';
import DriveFileBrowser from './DriveFileBrowser';
import DataHUD from './dashboard/DataHUD';
import MorningBriefing from './dashboard/MorningBriefing';
import PriorityStack from './dashboard/PriorityStack';
import Skeleton from './ui/Skeleton';

interface DashboardProps {
    projects: Project[];
    freelancers: Freelancer[];
    assignments: Assignment[];
    onCallAction: (action: string, params: unknown) => Promise<unknown>;
    isLoading?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, freelancers, assignments, onCallAction, isLoading = false }) => {
    const activeProjects = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length;
    const urgentProjects = projects.filter(p => p.priority === Priority.URGENT).length;
    const activeAssignments = assignments.filter(a => a.status === 'Confirmed').length;
    const utilization = Math.round((activeAssignments / (freelancers.length || 1)) * 100);

    return (
        <div className="h-full flex flex-col bg-canvas font-sans text-ink overflow-hidden">
            {/* Header */}
            <header className="flex-shrink-0 px-8 py-8 flex justify-between items-end bg-gradient-to-b from-white to-white/50 backdrop-blur-sm sticky top-0 z-20">
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight text-ink flex items-center gap-3">
                        <LayoutGrid size={28} className="text-indigo-600" /> Command Center
                    </h1>
                    <p className="text-sm text-pencil font-medium mt-2 tracking-wide">
                        Today's Overview
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}></div>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-ink">{isLoading ? 'Syncing...' : 'Live'}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Scrollable Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-[1600px] mx-auto space-y-8">

                    {/* Top Row: Briefing & Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Morning Briefing (Spans 2 cols) */}
                        <div className="lg:col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {isLoading ? (
                                <div className="h-full p-6 bg-white rounded-2xl shadow-sm flex flex-col gap-4">
                                    <Skeleton width="40%" height={32} />
                                    <Skeleton width="60%" height={20} />
                                    <div className="flex gap-4 mt-4">
                                        <Skeleton width={100} height={80} />
                                        <Skeleton width={100} height={80} />
                                        <Skeleton width={100} height={80} />
                                    </div>
                                </div>
                            ) : (
                                <MorningBriefing
                                    projectCount={activeProjects}
                                    urgentCount={urgentProjects}
                                    assignments={activeAssignments}
                                />
                            )}
                        </div>

                        {/* Priority Stack (Spans 1 col) */}
                        <div className="lg:col-span-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            {isLoading ? (
                                <div className="h-full p-6 bg-white rounded-2xl shadow-sm flex flex-col gap-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <Skeleton width={120} height={20} />
                                        <Skeleton width={24} height={24} variant="circular" />
                                    </div>
                                    <Skeleton height={60} />
                                    <Skeleton height={60} />
                                    <Skeleton height={60} />
                                </div>
                            ) : (
                                <PriorityStack projects={projects} />
                            )}
                        </div>
                    </div>

                    {/* Middle Row: Data HUD */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        {isLoading ? (
                            <>
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <Skeleton width={80} height={16} />
                                            <Skeleton width={20} height={20} variant="circular" />
                                        </div>
                                        <Skeleton width="60%" height={32} />
                                        <Skeleton width="40%" height={16} className="mt-2" />
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                <div className="bg-white p-6 rounded-2xl shadow-card hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                                    <DataHUD
                                        label="Active Projects"
                                        value={activeProjects}
                                        trend="+12%"
                                        icon={Activity}
                                        active={true}
                                        delay={0}
                                    />
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-card hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                                    <DataHUD
                                        label="Team Utilization"
                                        value={`${utilization}%`}
                                        trend="+5%"
                                        icon={CalendarDays}
                                        delay={100}
                                    />
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-card hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                                    <DataHUD
                                        label="Tasks Completed"
                                        value={142}
                                        trend="+18%"
                                        icon={CheckCircle2}
                                        delay={200}
                                    />
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-card hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                                    <DataHUD
                                        label="AI Operations"
                                        value="2.4k"
                                        trend="+32%"
                                        icon={Command}
                                        delay={300}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Bottom Row: AI & Files */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                        {/* AI Chat Interface */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-mist bg-canvas/30 flex justify-between items-center">
                                <h3 className="text-[10px] font-bold text-pencil uppercase tracking-widest flex items-center gap-2">
                                    <Command size={14} /> AI Assistant
                                </h3>
                            </div>
                            <div className="flex-1 overflow-hidden relative">
                                <AIChat
                                    freelancers={freelancers}
                                    projects={projects}
                                    assignments={assignments}
                                    onCallAction={onCallAction}
                                    agentMode={true}
                                    customTitle=" "
                                />
                            </div>
                        </div>

                        {/* File Browser */}
                        <div className="lg:col-span-1 bg-white rounded-2xl border border-mist shadow-sm overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-mist bg-canvas/30 flex justify-between items-center">
                                <h3 className="text-[10px] font-bold text-pencil uppercase tracking-widest flex items-center gap-2">
                                    <Database size={14} /> Knowledge Base
                                </h3>
                                <Link to="/files" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wide">View All</Link>
                            </div>
                            <div className="flex-1 overflow-hidden p-4">
                                <DriveFileBrowser onSelect={() => { }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
