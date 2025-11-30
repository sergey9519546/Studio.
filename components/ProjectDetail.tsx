
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, ChevronDown, User, Sparkles, Database, FileText, ScrollText, Layers, AlertTriangle, ArrowRight, LayoutDashboard, Grid } from 'lucide-react';
import { Project, Freelancer, Assignment, Script, ProjectContextItem, KnowledgeSource } from '../types';
import { api } from '../services/api';
import ReferenceGallery from './ReferenceGallery';
import ContextHub from './ContextHub';
import ToneMoodBoard from './ToneMoodBoard';
import MoodboardTab from './Moodboard/MoodboardTab';

interface ProjectDetailProps {
    freelancers: Freelancer[];
    projects: Project[];
    assignments: Assignment[];
    logs?: any[]; 
    onAssign: (assignment: Assignment) => void;
    checkConflict?: (freelancerId: string, start: string, end: string, ignoreAssignmentId?: string) => Assignment | undefined;
    onUpdateProject: (project: Project) => void;
    onDelete?: (id: string) => Promise<void>;
    onLog?: (action: string, details: string) => void;
}

const DateBadge = ({ dueDate, idealPostDate }: { dueDate?: string, idealPostDate?: string }) => {
    if (!dueDate) return <span className="text-pencil text-xs font-medium tracking-wide">No Date</span>;

    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let bgClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
    let icon = <Clock size={12} />;
    let text = `${diffDays} days left`;

    if (diffDays < 0) {
        bgClass = "bg-rose-50 text-rose-700 border-rose-100";
        icon = <AlertTriangle size={12} />;
        text = `Overdue (${Math.abs(diffDays)}d)`;
    } else if (diffDays < 3) {
        bgClass = "bg-amber-50 text-amber-700 border-amber-100";
        text = `Due in ${diffDays} days`;
    }

    return (
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${bgClass}`}>
            {icon} {text}
        </div>
    );
};

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projects, freelancers, assignments, onUpdateProject }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const project = projects.find(p => p.id === id);
    const [activeTab, setActiveTab] = useState<'overview' | 'moodboard'>('overview');
    
    const [scripts, setScripts] = useState<Script[]>([]);
    const [sources, setSources] = useState<KnowledgeSource[]>([]);

    useEffect(() => {
        if (project) {
            api.scripts.findByProject(project.id).then(res => setScripts(res.data)).catch(console.error);

            // Map existing ProjectContextItems to KnowledgeSources for the ContextHub
            const projectSources: KnowledgeSource[] = [];
            project.knowledgeBase?.forEach(kb => {
                const typeMap: Record<string, 'text' | 'file' | 'url' | 'youtube' | 'wiki'> = { 'General': 'url', 'Research': 'wiki', 'Technical': 'file', 'Brand': 'text' };
                projectSources.push({
                    id: kb.id,
                    type: typeMap[kb.category] || 'text',
                    title: kb.title,
                    originalContent: kb.content,
                    summary: `Project Context (${kb.category})`,
                    status: 'indexed',
                    chunks: [], 
                    createdAt: kb.updatedAt
                });
            });
            setSources(projectSources);
        }
    }, [project?.id, project?.knowledgeBase]);

    const handleAddSource = async (newSource: KnowledgeSource) => {
        if (!project) return;
        
        // Optimistic UI update
        setSources(prev => [...prev, newSource]);

        // Smart Category Mapping
        let category: ProjectContextItem['category'] = 'General';
        if (newSource.type === 'file') category = 'Technical';
        else if (newSource.type === 'wiki' || newSource.type === 'youtube') category = 'Research';
        else if (newSource.type === 'text') category = 'Brand';

        const newItem: ProjectContextItem = {
            id: newSource.id,
            title: newSource.title,
            content: newSource.originalContent || newSource.summary || '',
            category, 
            updatedAt: new Date().toISOString()
        };

        const updatedKB = [...(project.knowledgeBase || []), newItem];
        onUpdateProject({ ...project, knowledgeBase: updatedKB });
    };

    const handleRemoveSource = async (id: string) => {
        if (!project) return;
        setSources(prev => prev.filter(s => s.id !== id));
        const updatedKB = (project.knowledgeBase || []).filter(kb => kb.id !== id);
        onUpdateProject({ ...project, knowledgeBase: updatedKB });
    };
    
    const handleProjectUpdate = (updates: Partial<Project>) => {
        if (!project) return;
        onUpdateProject({ ...project, ...updates });
    };

    if (!project) return <div className="p-12 text-center text-pencil text-sm font-medium">Project not found</div>;

    const assignedFreelancers = assignments
        .filter(a => a.projectId === project.id)
        .map(a => freelancers.find(f => f.id === a.freelancerId))
        .filter(Boolean) as Freelancer[];

    return (
        <div className="h-full min-h-screen flex flex-col bg-canvas font-sans text-ink">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-mist px-8 py-4 flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/projects')} className="p-2 -ml-2 hover:bg-mist/50 rounded-full text-pencil transition-colors">
                            <ChevronDown size={20} className="rotate-90" strokeWidth={2} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1.5 opacity-80">
                                <span className="text-[10px] font-bold tracking-widest text-pencil uppercase">{project.category || 'Campaign'}</span>
                                <span className="text-mist text-[10px]">/</span>
                                <span className="text-[10px] font-bold tracking-widest text-pencil uppercase">{project.clientName}</span>
                            </div>
                            <h1 className="text-2xl font-semibold text-ink leading-none tracking-tight">{project.name}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <DateBadge dueDate={project.dueDate} idealPostDate={project.idealPostDate} />
                        <button className="bg-ink text-white px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-sm">
                            Edit Project
                        </button>
                    </div>
                 </div>

                 <div className="flex gap-6 border-t border-mist/50 pt-2">
                     <button 
                        onClick={() => setActiveTab('overview')} 
                        className={`pb-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'border-ink text-ink' : 'border-transparent text-pencil hover:text-ink'}`}
                     >
                        <LayoutDashboard size={14}/> Brief & Specs
                     </button>
                     <button 
                        onClick={() => setActiveTab('moodboard')} 
                        className={`pb-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'moodboard' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-pencil hover:text-indigo-600'}`}
                     >
                        <Grid size={14}/> Visual Moodboard
                     </button>
                 </div>
            </header>

            {activeTab === 'moodboard' ? (
                <div className="flex-1">
                    <MoodboardTab projectId={project.id} />
                </div>
            ) : (
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1800px] mx-auto w-full p-8 gap-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    
                    {/* Main Content */}
                    <main className="flex-1 flex flex-col gap-12 overflow-y-auto custom-scrollbar pr-2 pb-24">
                        
                        {/* 1. Brief */}
                        <section>
                            <h2 className="text-[10px] font-bold text-pencil uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <FileText size={14} className="opacity-70"/> Brief & Constraints
                            </h2>
                            <div className="bg-white rounded-2xl border border-mist p-10 shadow-sm hover:shadow-soft transition-shadow duration-500">
                                <div className="prose prose-sm max-w-none text-ink leading-loose font-sans font-medium text-base/7">
                                    {project.description || <span className="text-pencil italic font-normal">No brief provided.</span>}
                                </div>
                                {project.notes && (
                                    <div className="mt-10 pt-8 border-t border-mist/60">
                                        <h3 className="text-[10px] font-bold text-pencil uppercase tracking-widest mb-4 opacity-70">Technical Notes</h3>
                                        <div className="bg-canvas/50 p-6 rounded-xl border border-mist/60">
                                            <p className="text-xs text-ink font-mono leading-relaxed">{project.notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 2. Visual Assets */}
                        <section>
                            <h2 className="text-[10px] font-bold text-pencil uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Layers size={14} className="opacity-70"/> Quick References
                            </h2>
                            <ReferenceGallery 
                                items={project.references || []} 
                                onAdd={async (content) => {
                                    const updatedRefs = [...(project.references || []), content];
                                    onUpdateProject({ ...project, references: updatedRefs });
                                }} 
                                onRemove={(url) => {
                                    const updatedRefs = (project.references || []).filter(r => r !== url);
                                    onUpdateProject({ ...project, references: updatedRefs });
                                }}
                            />
                        </section>

                        {/* 3. Creative Direction */}
                        <section>
                            <h2 className="text-[10px] font-bold text-pencil uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Sparkles size={14} className="opacity-70"/> Creative Direction
                            </h2>
                            <ToneMoodBoard project={project} onUpdate={handleProjectUpdate} />
                        </section>

                        {/* 4. Project Intelligence */}
                        <section>
                            <h2 className="text-[10px] font-bold text-pencil uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Database size={14} className="opacity-70"/> Project Intelligence
                            </h2>
                            <div className="bg-white rounded-2xl border border-mist overflow-hidden h-[460px] shadow-sm hover:shadow-soft transition-shadow duration-500">
                                <ContextHub sources={sources} onAddSource={handleAddSource} onRemoveSource={handleRemoveSource} />
                            </div>
                        </section>

                    </main>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-96 flex flex-col gap-8 flex-shrink-0">
                        
                        {/* Team */}
                        <div className="bg-white rounded-2xl border border-mist p-8 shadow-sm">
                            <h3 className="text-[10px] font-bold text-pencil uppercase tracking-widest mb-6 flex items-center gap-2"><User size={14}/> Team Assignment</h3>
                            <div className="space-y-5">
                                {assignedFreelancers.length === 0 ? (
                                    <div className="text-center py-8 border border-dashed border-mist rounded-xl bg-canvas/30">
                                        <span className="text-xs text-pencil font-medium">No active assignments</span>
                                    </div>
                                ) : (
                                    assignedFreelancers.map(f => (
                                        <div key={f.id} className="flex items-center gap-4 group cursor-default">
                                            <img src={f.avatar} className="w-10 h-10 rounded-full bg-mist object-cover border border-mist group-hover:border-ink transition-colors"/>
                                            <div className="min-w-0">
                                                <div className="text-sm font-semibold text-ink truncate tracking-tight">{f.name}</div>
                                                <div className="text-[10px] text-pencil font-medium truncate uppercase tracking-wide mt-0.5">{f.role}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <button className="w-full mt-4 py-3 text-[10px] font-bold text-ink bg-white hover:bg-canvas rounded-xl border border-mist transition-colors uppercase tracking-widest shadow-sm">
                                    Manage Roster
                                </button>
                            </div>
                        </div>

                        {/* Specs */}
                        <div className="bg-white rounded-2xl border border-mist p-8 shadow-sm">
                            <h3 className="text-[10px] font-bold text-pencil uppercase tracking-widest mb-6">Specifications</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2.5 border-b border-mist/50">
                                    <span className="text-xs text-pencil font-medium">Format</span>
                                    <span className="text-xs font-mono font-bold text-ink bg-canvas px-2 py-1 rounded">{project.format || '—'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2.5 border-b border-mist/50">
                                    <span className="text-xs text-pencil font-medium">Duration</span>
                                    <span className="text-xs font-mono font-bold text-ink bg-canvas px-2 py-1 rounded">{project.length || '—'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2.5 border-b border-mist/50">
                                    <span className="text-xs text-pencil font-medium">Budget</span>
                                    <span className="text-xs font-mono font-bold text-ink bg-canvas px-2 py-1 rounded">{project.budget || '—'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Scripts (Positioned below Specs) */}
                        <div className="bg-white rounded-2xl border border-mist p-8 shadow-sm flex flex-col h-96">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[10px] font-bold text-pencil uppercase tracking-widest flex items-center gap-2">
                                    <ScrollText size={14}/> Scripts
                                </h3>
                                <Link to={`/studio?project=${project.id}`} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors uppercase tracking-wide">
                                    Open Studio <ArrowRight size={12}/>
                                </Link>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                                {scripts.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-canvas/30 rounded-xl border border-dashed border-mist">
                                        <span className="text-xs text-pencil font-medium mb-3">No drafts initialized.</span>
                                        <Link to={`/studio?project=${project.id}`} className="px-4 py-2 bg-white border border-mist rounded-lg text-[10px] font-bold text-ink uppercase tracking-wide shadow-sm hover:border-ink transition-colors">Start Writing</Link>
                                    </div>
                                ) : (
                                    scripts.map(script => (
                                        <Link key={script.id} to={`/studio?project=${project.id}&script=${script.id}`} className="block p-4 hover:bg-canvas rounded-xl border border-mist hover:border-indigo-200 transition-all group shadow-sm hover:shadow-md">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-semibold text-xs text-ink group-hover:text-indigo-600 transition-colors truncate">{script.title}</span>
                                                <span className="text-[9px] font-mono font-bold text-pencil bg-canvas px-1.5 py-0.5 rounded border border-mist/50 group-hover:border-indigo-100 group-hover:text-indigo-500 transition-colors">v{script.version}</span>
                                            </div>
                                            <div className="text-[10px] text-pencil line-clamp-2 leading-relaxed font-medium">{script.content.substring(0, 80)}...</div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;
