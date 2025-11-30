
import React, { useState, useMemo } from 'react';
import { Search, Plus, Upload, CheckSquare, Square, ArrowRight, Filter } from 'lucide-react';
import { Project, ProjectStatus, Priority } from '../types';
import { Link } from 'react-router-dom';
import ProjectModal from './ProjectModal';
import { Badge } from '../src/components/design/Badge';
import { Button } from '../src/components/design/Button';

interface ProjectListProps {
  projects: Project[];
  onCreate?: (project: Partial<Project>) => void;
  onUpdate?: (project: Project) => void;
  onDelete?: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onCreate, onUpdate, onDelete, onBulkDelete }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'dueDate', direction: 'asc' });

  const filteredProjects = useMemo(() => {
    return projects
        .filter(p => {
            const matchesText = (p.name.toLowerCase().includes(searchText.toLowerCase()) || (p.clientName || '').toLowerCase().includes(searchText.toLowerCase()));
            const matchesStatus = filters.status ? p.status === filters.status : true;
            return matchesText && matchesStatus;
        })
        .sort((a, b) => {
            return sortConfig.direction === 'asc' ? 1 : -1;
        });
  }, [projects, searchText, filters, sortConfig]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProjects.length && filteredProjects.length > 0) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredProjects.map(p => p.id)));
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const getStatusVariant = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.DELIVERED: return 'success';
      case ProjectStatus.REVIEW: return 'warning';
      case ProjectStatus.IN_PROGRESS: return 'ai';
      default: return 'neutral';
    }
  };

  const getPriorityVariant = (priority?: Priority) => {
    switch (priority) {
      case Priority.URGENT: return 'danger';
      case Priority.HIGH: return 'warning';
      case Priority.NORMAL: return 'ai';
      default: return 'neutral';
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 font-sans text-ink-primary animate-enter">
      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => { if(editingProject && onUpdate) onUpdate({...editingProject, ...data} as Project); else if(onCreate) onCreate(data); }}
        initialData={editingProject}
      />
    
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-tight text-ink-primary">Projects</h1>
          <p className="text-ink-secondary mt-1 text-sm font-medium">Manage active campaigns and production schedules.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/imports">
            <Button variant="secondary" size="sm" leftIcon={<Upload size={14} />}>
              Import
            </Button>
          </Link>
          <Button 
            variant="primary" 
            size="sm" 
            leftIcon={<Plus size={14} />} 
            onClick={() => { setEditingProject(undefined); setIsModalOpen(true); }}
          >
            New Project
          </Button>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border-subtle shadow-card overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="p-5 border-b border-border-subtle flex items-center justify-between gap-4 bg-white">
               <div className="relative flex-1 max-w-md group">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary group-focus-within:text-primary transition-colors" size={14}/>
                   <input 
                        className="w-full pl-10 pr-4 py-2.5 bg-app/50 border border-border-subtle rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all placeholder-ink-tertiary font-medium text-ink-primary"
                        placeholder="Filter projects..."
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                   />
               </div>
               <div className="flex items-center gap-3">
                   <div className="h-6 w-px bg-border-subtle"></div>
                   <div className="relative flex items-center">
                       <Filter size={14} className="absolute left-2 text-ink-tertiary pointer-events-none"/>
                       <select 
                            className="bg-transparent pl-7 pr-8 py-1.5 text-xs font-bold uppercase tracking-widest text-ink-secondary focus:outline-none cursor-pointer hover:text-ink-primary transition-colors appearance-none"
                            value={filters.status}
                            onChange={e => setFilters({...filters, status: e.target.value})}
                       >
                           <option value="">All Status</option>
                           {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                   </div>
               </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-subtle/30 border-b border-border-subtle">
                    <tr>
                        <th className="px-6 py-4 w-12 text-center">
                            <button onClick={toggleSelectAll} className="text-ink-tertiary hover:text-primary transition-colors">
                                {selectedIds.size > 0 ? <CheckSquare size={16}/> : <Square size={16}/>}
                            </button>
                        </th>
                        <th className="px-6 py-4 text-[10px] font-bold text-ink-tertiary uppercase tracking-widest">Project Name</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-ink-tertiary uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-ink-tertiary uppercase tracking-widest">Owner</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-ink-tertiary uppercase tracking-widest">Timeline</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-ink-tertiary uppercase tracking-widest">Priority</th>
                        <th className="px-6 py-4 text-right"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle bg-surface">
                    {filteredProjects.map(project => {
                        const assigneeName = project.assignedToId ? `User ${project.assignedToId.slice(0,4)}` : null;
                        const isSelected = selectedIds.has(project.id);
                        return (
                            <tr key={project.id} className={`group hover:bg-subtle/30 transition-colors ${isSelected ? 'bg-primary-tint/30' : ''}`}>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => toggleSelectOne(project.id)} className={`transition-colors ${isSelected ? 'text-primary' : 'text-border-hover hover:text-ink-secondary'}`}>
                                        {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <Link to={`/projects/${project.id}`} className="block">
                                        <div className="font-semibold text-sm text-ink-primary group-hover:text-primary transition-colors tracking-tight">{project.name}</div>
                                        <div className="text-[10px] text-ink-secondary font-medium uppercase tracking-wide mt-1">{project.clientName}</div>
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                                </td>
                                <td className="px-6 py-4">
                                    {assigneeName ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-subtle flex items-center justify-center text-[9px] font-bold text-ink-secondary border border-border-subtle">{assigneeName[0]}</div>
                                            <span className="text-xs text-ink-primary font-medium">Owner</span>
                                        </div>
                                    ) : <span className="text-ink-tertiary text-xs">—</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs font-mono font-medium text-ink-primary">{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : '—'}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={getPriorityVariant(project.priority)}>{project.priority}</Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => { setEditingProject(project); setIsModalOpen(true); }}
                                            className="h-8 px-2 text-[10px] uppercase font-bold"
                                        >
                                            Edit
                                        </Button>
                                        <Link to={`/projects/${project.id}`}>
                                            <div className="p-2 text-ink-tertiary hover:text-primary hover:bg-subtle rounded-md transition-colors">
                                                <ArrowRight size={16} />
                                            </div>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default ProjectList;
