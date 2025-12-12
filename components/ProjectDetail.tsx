import { AlertTriangle, ArrowRight, ChevronDown, Clock, Database, FileText, Grid, Layers, LayoutDashboard, ScrollText, Sparkles, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { ActivityLog, Assignment, Freelancer, KnowledgeSource, Project, ProjectContextItem, Script } from '../types';
import ContextHub from './ContextHub';
import MoodboardTab from './Moodboard/MoodboardTab';
import ReferenceGallery from './ReferenceGallery';
import ToneMoodBoard from './ToneMoodBoard';
import AIChat from './AIChat';

interface ProjectDetailProps {
    freelancers: Freelancer[];
    projects: Project[];
    assignments: Assignment[];
    logs?: ActivityLog[];
    onAssign: (assignment: Assignment) => void;
    checkConflict?: (freelancerId: string, start: string, end: string, ignoreAssignmentId?: string) => Assignment | undefined;
    onUpdateProject: (project: Project) => void;
    onDelete?: (id: string) => Promise<void>;
    onLog?: (action: string, details: string) => void;
}

const DateBadge = ({ dueDate }: { dueDate?: string }) => {
    if (!dueDate) return (
        <span className="text-ink-tertiary text-xs font-medium tracking-wide flex items-center gap-1.5 px-3 py-1 rounded-full border border-border-subtle bg-subtle/50">
            <Clock size={12} aria-hidden="true" />
            No Date
        </span>
    );

    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let bgClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
    let icon = <Clock size={12} />;
    let text = `${diffDays} days left`;
    let ariaLabel = `Due in ${diffDays} days`;

    if (diffDays < 0) {
        bgClass = "bg-rose-50 text-rose-700 border-rose-100";
        icon = <AlertTriangle size={12} />;
        text = `Overdue (${Math.abs(diffDays)}d)`;
        ariaLabel = `Overdue by ${Math.abs(diffDays)} days`;
    } else if (diffDays < 3) {
        bgClass = "bg-amber-50 text-amber-700 border-amber-100";
        text = `Due in ${diffDays} days`;
        ariaLabel = `Due in ${diffDays} days`;
    }

    return (
        <div 
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${bgClass}`}
            role="status"
            aria-label={ariaLabel}
        >
            {icon} {text}
        </div>
    );
};

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projects, freelancers, assignments, onUpdateProject }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const project = projects.find(p => p.id === id);
    const [activeTab, setActiveTab] = useState<'overview' | 'moodboard' | 'ai-assistant'>('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scripts, setScripts] = useState<Script[]>([]);
    const [sources, setSources] = useState<KnowledgeSource[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [editMessage, setEditMessage] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({
        name: "",
        clientName: "",
        description: "",
        dueDate: "",
        status: "",
    });

    const projectId = project?.id;

    useEffect(() => {
        if (project) {
            setEditForm({
                name: project.name || "",
                clientName: project.clientName || "",
                description: project.description || "",
                dueDate: project.dueDate || "",
                status: (project as any).status || "",
            });
        }
    }, [project]);

    useEffect(() => {
        let didCancel = false;

        const loadProjectData = async () => {
            if (!projectId) {
                setError("Project ID not found");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const scriptsData = await api.scripts.findByProject(projectId);
                if (!didCancel) {
                    setScripts(scriptsData.data || []);
                }
            } catch (error) {
                console.error("Failed to load scripts:", error);
                if (!didCancel) {
                    setError("Failed to load project scripts");
                }
            } finally {
                if (!didCancel) {
                    setIsLoading(false);
                }
            }
        };

        loadProjectData();
        return () => { didCancel = true; };
    }, [projectId]);

    const handleAddSource = async (newSource: KnowledgeSource) => {
        if (!project) return;

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

    const handleEditProject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!project) return;
        setIsEditing(true);
        setEditMessage(null);

        const updates: Partial<Project> = {
            name: editForm.name.trim() || project.name,
            clientName: editForm.clientName.trim() || project.clientName,
            description: editForm.description,
            dueDate: editForm.dueDate,
            status: (editForm as any).status || (project as any).status,
        };

        try {
            onUpdateProject({ ...project, ...updates });
            setEditMessage("Project details saved.");
        } catch (err) {
            setEditMessage("Unable to save changes. Please retry.");
        } finally {
            setIsEditing(false);
        }
    };

    if (!project) return (
        <div className="p-12 text-center text-ink-secondary text-sm font-medium" role="alert">
            <AlertTriangle size={24} className="mx-auto mb-4 text-state-danger" aria-hidden="true" />
            <p>Project not found</p>
            <button 
                onClick={() => navigate('/projects')} 
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Return to projects list"
            >
                Back to Projects
            </button>
        </div>
    );

    const assignedFreelancers = assignments
        .filter(a => a.projectId === project.id)
        .map(a => freelancers.find(f => f.id === a.freelancerId))
        .filter(Boolean) as Freelancer[];

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-canvas" role="status" aria-live="polite">
                <div className="flex items-center gap-3 text-ink-secondary">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                    <span className="font-medium">Loading project details...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center bg-canvas" role="alert">
                <div className="bg-state-danger/10 border border-state-danger/30 rounded-2xl p-8 max-w-md text-center">
                    <AlertTriangle size={32} className="mx-auto mb-4 text-state-danger" aria-hidden="true" />
                    <h3 className="font-bold text-state-danger mb-2">Error Loading Project</h3>
                    <p className="text-sm text-ink-secondary mb-4">{error}</p>
                    <div className="flex gap-3 justify-center">
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-4 py-2 bg-state-danger text-white rounded-lg hover:bg-state-danger/90 transition-colors focus:outline-none focus:ring-2 focus:ring-state-danger focus:ring-offset-2"
                        >
                            Retry
                        </button>
                        <button 
                            onClick={() => navigate('/projects')} 
                            className="px-4 py-2 border border-border-subtle rounded-lg hover:bg-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            Back to Projects
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full min-h-screen flex flex-col bg-canvas font-sans text-ink-primary">
            {/* Skip to content link for accessibility */}
            <a
                href="#project-main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
                role="link"
                aria-label="Skip to main project content"
            >
                Skip to main content
            </a>

            {/* Header */}
            <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-border-subtle px-8 py-6 flex flex-col gap-4" role="banner">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => navigate('/projects')} 
                            className="p-2 -ml-2 hover:bg-subtle/50 rounded-xl text-ink-secondary transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            aria-label="Navigate back to projects list"
                        >
                            <ChevronDown size={20} className="rotate-90" strokeWidth={2} aria-hidden="true" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-ink-secondary">{project.category || 'Campaign'}</span>
                                <span className="text-ink-tertiary text-xs" aria-hidden="true">/</span>
                                <span className="text-xs font-medium text-ink-secondary">{project.clientName}</span>
                            </div>
                            <h1 className="text-3xl font-semibold text-ink-primary leading-none tracking-tight">{project.name}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <DateBadge dueDate={project.dueDate} />
                        <button 
                            onClick={() => { setIsEditPanelOpen(prev => !prev); setEditMessage(null); }}
                            disabled={isEditing}
                            className="bg-ink-primary text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-ink-primary/90 hover:shadow-lg hover:-translate-y-[1px] transition-all duration-200 shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={isEditing ? "Editing project, please wait" : "Edit project details"}
                        >
                            {isEditing ? 'Editing...' : isEditPanelOpen ? 'Close Editor' : 'Edit Project'}
                        </button>
                    </div>
                </div>

                <nav aria-label="Project sections" role="navigation">
                    <div className="flex gap-8 border-t border-border-subtle/50 pt-3">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`pb-3 text-sm font-semibold border-b-3 transition-all duration-200 flex items-center gap-2 px-4 -mx-4 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                                activeTab === 'overview' 
                                    ? 'border-ink-primary text-ink-primary bg-subtle/20' 
                                    : 'border-transparent text-ink-secondary hover:text-ink-primary'
                            }`}
                            aria-pressed={activeTab === 'overview'}
                            aria-describedby="overview-desc"
                        >
                            <LayoutDashboard size={16} aria-hidden="true" /> Brief & Specs
                        </button>
                        <button
                            onClick={() => setActiveTab('moodboard')}
                            className={`pb-3 text-sm font-semibold border-b-3 transition-all duration-200 flex items-center gap-2 px-4 -mx-4 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                                activeTab === 'moodboard' 
                                    ? 'border-primary text-primary bg-primary/10' 
                                    : 'border-transparent text-ink-secondary hover:text-primary'
                            }`}
                            aria-pressed={activeTab === 'moodboard'}
                            aria-describedby="moodboard-desc"
                        >
                            <Grid size={16} aria-hidden="true" /> Visual Moodboard
                        </button>
                        <button
                            onClick={() => setActiveTab('ai-assistant')}
                            className={`pb-3 text-sm font-semibold border-b-3 transition-all duration-200 flex items-center gap-2 px-4 -mx-4 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                                activeTab === 'ai-assistant' 
                                    ? 'border-purple-600 text-purple-600 bg-purple-50/30' 
                                    : 'border-transparent text-ink-secondary hover:text-purple-600'
                            }`}
                            aria-pressed={activeTab === 'ai-assistant'}
                            aria-describedby="ai-desc"
                        >
                            <Sparkles size={16} aria-hidden="true" /> Studio AI
                        </button>
                    </div>
                    <div className="sr-only">
                        <div id="overview-desc">View project brief, specifications, and details</div>
                        <div id="moodboard-desc">Access visual moodboard and creative assets</div>
                        <div id="ai-desc">Interact with AI assistant for project guidance</div>
                    </div>
                </nav>
            </header>

            {activeTab === 'moodboard' ? (
                <div className="flex-1">
                    <MoodboardTab projectId={project.id} />
                </div>
            ) : activeTab === 'ai-assistant' ? (
                <div className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto h-full">
                        <AIChat
                            freelancers={freelancers}
                            projects={projects}
                            assignments={assignments}
                            customTitle={`Project AI Assistant - ${project.name}`}
                            customSystemInstruction={`You are a creative AI assistant specifically for the project "${project.name}". ${project.description ? `Project Description: ${project.description}` : ''} Provide creative direction, suggest improvements, and help with project-related tasks. Be concise and focused on the project's goals.`}
                            contextData={JSON.stringify({
                                projectName: project.name,
                                projectDescription: project.description,
                                clientName: project.clientName,
                                category: project.category,
                                dueDate: project.dueDate,
                                budget: project.budget,
                                format: project.format,
                                length: project.length,
                                knowledgeBase: project.knowledgeBase || [],
                                references: project.references || []
                            })}
                        />
                    </div>
                </div>
            ) : (
                <div 
                    id="project-main-content"
                    className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1800px] mx-auto w-full p-8 gap-10 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    role="main"
                >
                    {isEditPanelOpen && (
                        <section className="w-full bg-surface border border-border-subtle rounded-2xl shadow-card p-6 lg:p-8 space-y-4" aria-label="Edit project form">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.25em] text-ink-tertiary font-bold">Project Metadata</p>
                                    <h2 className="text-lg font-semibold text-ink-primary">Quick edit</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setIsEditPanelOpen(false); }}
                                    className="text-sm text-ink-secondary hover:text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-3 py-2"
                                >
                                    Close
                                </button>
                            </div>
                            <form onSubmit={handleEditProject} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <label className="flex flex-col gap-1 text-sm font-semibold text-ink-primary">
                                    Project Name
                                    <input
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full border border-border-subtle rounded-lg px-3 py-2 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                        aria-label="Project name"
                                        required
                                    />
                                </label>
                                <label className="flex flex-col gap-1 text-sm font-semibold text-ink-primary">
                                    Client
                                    <input
                                        value={editForm.clientName}
                                        onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                                        className="w-full border border-border-subtle rounded-lg px-3 py-2 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                        aria-label="Client name"
                                    />
                                </label>
                                <label className="flex flex-col gap-1 text-sm font-semibold text-ink-primary">
                                    Due Date
                                    <input
                                        type="date"
                                        value={editForm.dueDate ? editForm.dueDate.substring(0, 10) : ""}
                                        onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                                        className="w-full border border-border-subtle rounded-lg px-3 py-2 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                        aria-label="Due date"
                                    />
                                </label>
                                <label className="flex flex-col gap-1 text-sm font-semibold text-ink-primary">
                                    Status
                                    <select
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                        className="w-full border border-border-subtle rounded-lg px-3 py-2 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-white"
                                        aria-label="Project status"
                                    >
                                        <option value="">Select status</option>
                                        <option value="PLANNED">Planned</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                </label>
                                <label className="flex flex-col gap-1 text-sm font-semibold text-ink-primary lg:col-span-2">
                                    Description
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full border border-border-subtle rounded-lg px-3 py-3 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[100px]"
                                        aria-label="Project description"
                                    />
                                </label>
                                <div className="flex gap-3 lg:col-span-2">
                                    <button
                                        type="submit"
                                        disabled={isEditing}
                                        className="px-5 py-2.5 bg-ink-primary text-white rounded-lg text-sm font-semibold hover:bg-ink-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label={isEditing ? "Saving project changes" : "Save project changes"}
                                    >
                                        {isEditing ? "Saving..." : "Save changes"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setEditForm({
                                            name: project.name || "",
                                            clientName: project.clientName || "",
                                            description: project.description || "",
                                            dueDate: project.dueDate || "",
                                            status: (project as any).status || "",
                                        }); setEditMessage(null); }}
                                        className="px-5 py-2.5 border border-border-subtle rounded-lg text-sm font-semibold text-ink-secondary hover:text-ink-primary hover:border-ink-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                    >
                                        Reset
                                    </button>
                                    {editMessage && (
                                        <span className="text-sm text-ink-secondary px-2 py-1" role="status" aria-live="polite">
                                            {editMessage}
                                        </span>
                                    )}
                                </div>
                            </form>
                        </section>
                    )}

                    {/* Main Content */}
                    <main className="flex-1 flex flex-col gap-12 overflow-y-auto custom-scrollbar pr-2 pb-24" role="main">
                        {/* 1. Brief */}
                        <section aria-labelledby="brief-heading">
                            <h2 id="brief-heading" className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest mb-4 flex items-center gap-2">
                                <FileText size={14} className="opacity-70" aria-hidden="true" /> Brief & Constraints
                            </h2>
                            <div className="bg-surface border border-border-subtle rounded-2xl p-10 shadow-card hover:shadow-lg hover:border-primary/20 transition-all duration-200">
                                <div className="prose prose-sm max-w-none text-ink-primary leading-loose font-sans font-medium text-base/7">
                                    {project.description || <span className="text-ink-secondary italic font-normal">No brief provided.</span>}
                                </div>
                                {project.notes && (
                                    <div className="mt-10 pt-8 border-t border-border-subtle/60">
                                        <h3 className="text-[10px] font-bold text-ink-tertiary uppercase tracking-widest mb-4 opacity-70">Technical Notes</h3>
                                        <div
