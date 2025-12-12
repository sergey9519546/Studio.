import { AlertTriangle, BrainCircuit, FileText, Loader2, Plus, Sparkles, Tag, Trash2, User, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import { FocusTrap } from '@/components/Accessibility';
import { Priority, Project, ProjectStatus, RoleRequirement } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Partial<Project>) => void;
  initialData?: Project;
}

interface AIGeneratedProjectData {
  narrative_brief: string;
  production_constraints: string;
  stylistic_tags: string[];
  suggested_roles: { role: string; count: number; skills: string[] }[];
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    clientName: '',
    category: '',
    description: '',
    status: ProjectStatus.PLANNED,
    priority: Priority.NORMAL,
    roleRequirements: [],
    budget: '',
    startDate: '',
    dueDate: '',
    tags: [],
    notes: ''
  });

  const [rawContext, setRawContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData });
        setTagInput(initialData.tags?.join(', ') || '');
        setRawContext('');
      } else {
        setFormData({
          name: '',
          clientName: '',
          category: 'Social Media',
          description: '',
          status: ProjectStatus.PLANNED,
          priority: Priority.NORMAL,
          roleRequirements: [],
          budget: '',
          startDate: new Date().toISOString().split('T')[0],
          dueDate: '',
          tags: [],
          notes: ''
        });
        setTagInput('');
        setRawContext('');
      }
    }
  }, [isOpen, initialData]);

  const handleGenerateAI = async () => {
    if (!formData.name && !rawContext) {
      alert("Please enter a Project Name or provide Source Material.");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `
        Role: Creative Producer AI.
        Task: Analyze the context and structure a project.
        
        CONTEXT: "${rawContext || formData.name}"
        CLIENT: ${formData.clientName}

        Return JSON schema:
        {
          "narrative_brief": "String",
          "production_constraints": "String",
          "stylistic_tags": ["String"],
          "suggested_roles": [{ "role": "String", "count": Integer, "skills": ["String"] }]
        }
      `;

      // Use the backend AI endpoint instead of direct SDK calls
      const response = await api.ai.extract({
        prompt,
        schema: {
          narrative_brief: "string",
          production_constraints: "string",
          stylistic_tags: "array",
          suggested_roles: "array"
        }
      });

      const result = response.data as AIGeneratedProjectData;

      const newRoles: RoleRequirement[] = (result.suggested_roles || []).map((r: { role: string; count: number; skills: string[] }, idx: number) => ({
        id: `role-${Date.now()}-${idx}`,
        role: r.role,
        count: r.count || 1,
        filled: 0,
        skillsRequired: r.skills || []
      }));

      setFormData(prev => ({
        ...prev,
        description: result.narrative_brief,
        notes: result.production_constraints,
        roleRequirements: newRoles.length > 0 ? newRoles : prev.roleRequirements,
        tags: result.stylistic_tags || []
      }));

      setTagInput((result.stylistic_tags || []).join(', '));

    } catch (e) {
      console.error("AI Generation failed", e);
      alert("AI generation failed. Please try again or fill in manually.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const processedTags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
    onSave({ ...formData, tags: processedTags });
    onClose();
  };

  // Handle escape key to close modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 font-sans animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      {/* Backdrop for click-to-close */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <FocusTrap isActive={isOpen}>
        <div className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-border-subtle animate-scale-in">

          <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center bg-surface">
            <div>
              <h2 id="project-modal-title" className="text-base font-semibold text-ink-primary">
                {initialData ? 'Edit Project' : 'New Project'}
              </h2>
              <p className="text-xs text-ink-secondary">Configure campaign parameters.</p>
            </div>
            <button 
              onClick={onClose} 
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-ink-tertiary hover:text-ink-primary transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Close modal"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

          {/* AI Sidebar */}
          <div className="w-full lg:w-80 bg-subtle/50 border-r border-border-subtle p-6 flex flex-col gap-6 overflow-y-auto">
            <div className="flex-1 flex flex-col">
              <label className="text-[10px] font-bold text-indigo-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                <BrainCircuit size={12} className="text-indigo-600" /> Auto-Config
              </label>
              <textarea
                className="flex-1 w-full p-3 bg-surface border border-border-subtle rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs resize-none shadow-sm placeholder-ink-tertiary text-ink-primary leading-relaxed font-mono"
                placeholder="Paste messy notes, emails, or briefs here. AI will structure the project."
                value={rawContext}
                onChange={(e) => setRawContext(e.target.value)}
              />
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGenerating || (!rawContext && !formData.name)}
                className="mt-3 bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-hover shadow-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2 uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
              >
                {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                {isGenerating ? 'Processing...' : 'Analyze & Fill'}
              </button>
            </div>

            <div className="pt-6 border-t border-border-subtle space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-ink-secondary uppercase tracking-wide">Name</label>
                <input
                  required
                  className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-sm font-medium text-ink-primary"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-ink-secondary uppercase tracking-wide">Client</label>
                <input
                  className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-lg focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-sm text-ink-primary"
                  value={formData.clientName}
                  onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            <form id="project-form" onSubmit={handleSave} className="space-y-8 max-w-3xl mx-auto">

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-ink-primary flex items-center gap-2">
                    <FileText size={14} className="text-ink-tertiary" /> Narrative Brief
                  </label>
                  <textarea
                    className="w-full p-4 bg-surface border border-border-subtle rounded-lg focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-sm leading-relaxed min-h-[120px] shadow-sm font-sans text-ink-primary"
                    placeholder="Core story..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-ink-primary flex items-center gap-2">
                    <AlertTriangle size={14} className="text-ink-tertiary" /> Constraints
                  </label>
                  <textarea
                    className="w-full p-4 bg-subtle border border-border-subtle rounded-lg focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-xs font-mono min-h-[80px] text-ink-secondary"
                    placeholder="Tech specs..."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl border border-border-subtle bg-surface shadow-sm">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ink-secondary uppercase tracking-wide">Status</label>
                  <select
                    className="w-full px-2 py-1.5 bg-subtle border border-border-subtle rounded text-xs font-medium outline-none focus:border-primary"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                  >
                    {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ink-secondary uppercase tracking-wide">Start</label>
                  <input type="date" className="w-full px-2 py-1.5 bg-subtle border border-border-subtle rounded text-xs font-medium outline-none focus:border-primary"
                    value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-ink-secondary uppercase tracking-wide">Due</label>
                  <input type="date" className="w-full px-2 py-1.5 bg-subtle border border-border-subtle rounded text-xs font-medium outline-none focus:border-primary"
                    value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <div className="col-span-2 md:col-span-4 mt-2">
                  <label className="text-[10px] font-bold text-ink-secondary uppercase tracking-wide flex items-center gap-1 mb-1"><Tag size={12} /> Tags</label>
                  <input
                    className="w-full px-3 py-2 bg-subtle border border-border-subtle rounded text-xs font-medium outline-none focus:border-primary"
                    placeholder="Comma separated tags..."
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-bold text-ink-secondary uppercase tracking-wide">Staffing Plan</label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData(p => ({
                        ...p,
                        roleRequirements: [
                          ...(p.roleRequirements || []),
                          { id: `role-${Date.now()}`, role: 'New', count: 1, filled: 0, skillsRequired: [] },
                        ],
                      }))
                    }
                    className="text-primary hover:text-primary-hover text-[10px] font-bold flex items-center gap-1 uppercase"
                  >
                    <Plus size={12} /> Add Role
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.roleRequirements?.map((req) => (
                    <div key={req.id} className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border-subtle shadow-sm">
                      <User size={14} className="text-ink-tertiary" />
                      <input
                        className="w-32 bg-transparent text-xs font-bold text-ink-primary border-none focus:ring-0 p-0"
                        value={req.role}
                        onChange={e => {
                          const newRoles = formData.roleRequirements?.map(r => r.id === req.id ? { ...r, role: e.target.value } : r);
                          setFormData({ ...formData, roleRequirements: newRoles });
                        }}
                      />
                      <div className="h-4 w-px bg-border-subtle"></div>
                      <input
                        type="number"
                        className="w-12 bg-transparent text-xs text-ink-secondary border-none focus:ring-0 p-0 text-center"
                        value={req.count}
                        onChange={e => {
                          const newRoles = formData.roleRequirements?.map(r => r.id === req.id ? { ...r, count: parseInt(e.target.value) } : r);
                          setFormData({ ...formData, roleRequirements: newRoles });
                        }}
                      />
                      <div className="h-4 w-px bg-border-subtle"></div>
                      <input
                        className="flex-1 bg-transparent text-xs text-ink-secondary border-none focus:ring-0 p-0"
                        placeholder="Required Skills..."
                        value={req.skillsRequired.join(', ')}
                        onChange={e => {
                          const newRoles = formData.roleRequirements?.map(r => r.id === req.id ? { ...r, skillsRequired: e.target.value.split(',') } : r);
                          setFormData({ ...formData, roleRequirements: newRoles });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, roleRequirements: p.roleRequirements?.filter(r => r.id !== req.id) }))}
                        className="text-ink-tertiary hover:text-state-danger transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border-subtle bg-surface flex justify-end gap-3 z-10">
          <button 
            onClick={onClose} 
            className="min-h-[44px] px-4 py-2 text-ink-secondary font-medium hover:bg-subtle rounded-md text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="min-h-[44px] px-5 py-2 bg-primary text-white font-medium rounded-md text-xs hover:bg-primary-hover shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {initialData ? 'Update Project' : 'Create Project'}
          </button>
        </div>

        </div>
      </FocusTrap>
    </div>
  );
};

export default ProjectModal;
