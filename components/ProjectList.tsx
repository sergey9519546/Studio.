import { ArrowRight, CheckSquare, Filter, Plus, Search, Square, Upload } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Link, useInRouterContext } from 'react-router-dom';
import { api } from '../services/api';
import { Badge } from '../src/components/design/Badge';
import { Button } from '../src/components/design/Button';
import { Priority, Project, ProjectStatus, QueryParams } from '../types';
import ProjectModal from './ProjectModal';
import Skeleton from './ui/Skeleton';

interface ProjectListProps {
  projects?: Project[];
  onCreate?: (project: Partial<Project>) => void;
  onUpdate?: (project: Project) => void;
  onDelete?: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  isLoading?: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects: _projects = [], onCreate, onUpdate, isLoading = false }) => {
  const inRouter = useInRouterContext();

  const [searchText, setSearchText] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [sortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'dueDate', direction: 'asc' });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedProjects, setPaginatedProjects] = useState<Project[]>(_projects);
  const [isLoadingData, setIsLoadingData] = useState(_projects.length === 0);
  const [loadError, setLoadError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchProjects = async () => {
      if (_projects.length > 0 && !searchText && !filters.status && !filters.priority) {
        setPaginatedProjects(_projects);
        setTotalPages(Math.max(1, Math.ceil(_projects.length / 10) || 1));
        setIsLoadingData(false);
        setLoadError(null);
        return;
      }

      setIsLoadingData(true);
      try {
        if (!api?.projects?.list) {
          setPaginatedProjects(_projects);
          setTotalPages(Math.max(1, Math.ceil((_projects.length || 0) / 10) || 1));
          setLoadError(null);
          return;
        }

        const params: QueryParams = { page, limit: 10 };
        if (searchText) params.search = searchText;
        if (filters.status || filters.priority) {
          const filterPayload: Record<string, string> = {};
          if (filters.status) filterPayload.status = filters.status;
          if (filters.priority) filterPayload.priority = filters.priority;
          params.filters = filterPayload;
        }
        const res = await (api as any).projects.list(params);

        const rawData = (res as any)?.data?.data ?? (res as any)?.data ?? _projects;
        const normalized = Array.isArray(rawData)
          ? rawData
          : Array.isArray((res as any)?.data?.data)
            ? (res as any)?.data?.data
            : [];
        setPaginatedProjects(normalized);

        const totalFromRes = (res as any)?.data?.total ?? (res as any)?.meta?.total ?? (res as any)?.total;
        const limitFromRes = (res as any)?.data?.limit ?? 10;
        const derivedTotalPages = totalFromRes
          ? Math.max(1, Math.ceil(totalFromRes / limitFromRes))
          : Math.max(1, Math.ceil((normalized.length || _projects.length || 0) / 10) || 1);
        setTotalPages(derivedTotalPages);
        setLoadError(null);
      } catch (e) {
        console.error('Failed to fetch projects', e);
        setPaginatedProjects(_projects);
        setTotalPages(Math.max(1, Math.ceil(_projects.length / 10) || 1));
        setLoadError('Error');
      } finally {
        setIsLoadingData(false);
      }
    };

    const timeout = setTimeout(fetchProjects, 50);
    return () => clearTimeout(timeout);
  }, [page, searchText, filters, _projects]);

  const filteredProjects = useMemo(() => {
    const list = Array.isArray(paginatedProjects) && paginatedProjects.length > 0 ? paginatedProjects : _projects;
    return [...list].sort((a, b) => {
      const dateA = new Date((a as any)?.dueDate || 0).getTime();
      const dateB = new Date((b as any)?.dueDate || 0).getTime();
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [paginatedProjects, sortConfig, _projects]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProjects.length && filteredProjects.length > 0) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredProjects.map(p => String(p.id))));
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
        onSave={(data) => { if (editingProject && onUpdate) onUpdate({ ...editingProject, ...data } as Project); else if (onCreate) onCreate(data); }}
        initialData={editingProject}
      />

      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-display font-semibold tracking-tight text-ink-primary">Projects</h1>
          <p className="text-ink-secondary mt-2 text-sm font-medium">Active campaigns and schedules.</p>
        </div>
        {loadError && <div className="text-state-danger text-sm">Error</div>}
        <div className="flex gap-3">
          {inRouter ? (
            <Link to="/imports">
              <Button variant="secondary" size="sm" leftIcon={<Upload size={14} />}>
                Import
              </Button>
            </Link>
          ) : (
            <a href="/imports">
              <Button variant="secondary" size="sm" leftIcon={<Upload size={14} />}>
                Import
              </Button>
            </a>
          )}
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => { setEditingProject(undefined); setIsModalOpen(true); }}
          >
            Create Project
          </Button>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border-subtle shadow-card overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border-subtle flex items-center justify-between gap-4 bg-white">
          <div className="relative flex-1 max-w-md group">
            <label htmlFor="project-search" className="sr-only">Search projects</label>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-tertiary group-focus-within:text-primary transition-colors" size={16} aria-hidden="true" />
            <input
              id="project-search"
              type="search"
              className="w-full pl-11 pr-10 py-3 bg-app/50 border border-border-subtle rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all placeholder-ink-tertiary font-medium text-ink-primary"
              placeholder="Filter projects... (Cmd+K)"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              aria-describedby="search-hint"
            />
            <span id="search-hint" className="sr-only">Type to filter projects by name or client</span>
            {searchText && (
              <button 
                onClick={() => setSearchText('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-tertiary hover:text-ink-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-full"
                aria-label="Clear search"
              >
                <div className="bg-subtle rounded-full p-1 hover:bg-border-subtle transition-colors">
                  <Plus size={12} className="rotate-45" aria-hidden="true" />
                </div>
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-px bg-border-subtle"></div>
            <div className="relative flex items-center group">
              <Filter size={14} className="absolute left-3 text-ink-tertiary pointer-events-none group-hover:text-primary transition-colors" />
              <select
                className="bg-app/50 border border-border-subtle rounded-lg pl-9 pr-8 py-2 text-xs font-bold uppercase tracking-wide text-ink-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white cursor-pointer hover:text-ink-primary transition-all appearance-none"
                value={filters.status}
                onChange={e => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-tertiary">
                <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-current opacity-60"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto" role="region" aria-label="Projects table">
          <table className="w-full text-left border-collapse" aria-describedby="projects-table-desc">
            <caption id="projects-table-desc" className="sr-only">
              List of projects with their status, owner, timeline, and priority. Use arrow keys to navigate rows.
            </caption>
            <thead className="bg-subtle/30 border-b border-border-subtle">
              <tr>
                <th scope="col" className="px-6 py-5 w-12 text-center">
                  <button 
                    onClick={toggleSelectAll} 
                    className="text-ink-tertiary hover:text-primary transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
                    aria-label={selectedIds.size > 0 ? `Deselect all ${filteredProjects.length} projects` : `Select all ${filteredProjects.length} projects`}
                  >
                    {selectedIds.size > 0 ? <CheckSquare size={18} aria-hidden="true" /> : <Square size={18} aria-hidden="true" />}
                  </button>
                </th>
                <th scope="col" className="px-6 py-5 text-xs font-semibold uppercase text-ink-tertiary tracking-wide">Project Name</th>
                <th scope="col" className="px-6 py-5 text-xs font-semibold uppercase text-ink-tertiary tracking-wide">Status</th>
                <th scope="col" className="px-6 py-5 text-xs font-semibold uppercase text-ink-tertiary tracking-wide">Owner</th>
                <th scope="col" className="px-6 py-5 text-xs font-semibold uppercase text-ink-tertiary tracking-wide">Timeline</th>
                <th scope="col" className="px-6 py-5 text-xs font-semibold uppercase text-ink-tertiary tracking-wide">Priority</th>
                <th scope="col" className="px-6 py-5 text-right"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-surface">
              {isLoadingData ? (
                <>
                  <tr>
                    <td colSpan={7} className="px-6 py-3 text-ink-tertiary text-sm">Loading...</td>
                  </tr>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-5 text-center"><Skeleton width={16} height={16} variant="rectangular" /></td>
                      <td className="px-6 py-5">
                        <Skeleton width={180} height={20} className="mb-2" />
                        <Skeleton width={100} height={12} />
                      </td>
                      <td className="px-6 py-5"><Skeleton width={80} height={24} variant="rounded" /></td>
                      <td className="px-6 py-5"><Skeleton width={60} height={20} /></td>
                      <td className="px-6 py-5"><Skeleton width={100} height={20} /></td>
                      <td className="px-6 py-5"><Skeleton width={80} height={24} variant="rounded" /></td>
                      <td className="px-6 py-5"></td>
                    </tr>
                  ))}
                </>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-ink-tertiary text-sm">
                    No projects
                  </td>
                </tr>
              ) : (
                filteredProjects.map(project => {
                  const assigneeName = (project as any).assignedToId ? `User ${(project as any).assignedToId.slice(0, 4)}` : null;
                  const isSelected = selectedIds.has(String(project.id));
                  return (
                    <tr key={project.id} className={`group hover:bg-ink-primary/[0.02] transition-all duration-200 relative ${isSelected ? 'bg-blue-50/50' : ''}`}>
                      <td className="px-6 py-6 text-center">
                        <button onClick={() => toggleSelectOne(String(project.id))} className={`transition-colors p-1 ${isSelected ? 'text-primary' : 'text-border-hover hover:text-ink-secondary'}`}>
                          {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                        </button>
                      </td>
                      <td className="px-6 py-6">
                        {inRouter ? (
                          <Link to={`/projects/${project.id}`} className="block">
                            <div className="font-semibold text-sm text-ink-primary group-hover:text-primary transition-colors tracking-tight">{project.name}</div>
                            <div className="text-xs text-ink-secondary font-medium mt-1">{(project as any).clientName}</div>
                          </Link>
                        ) : (
                          <a href={`/projects/${project.id}`} className="block">
                            <div className="font-semibold text-sm text-ink-primary group-hover:text-primary transition-colors tracking-tight">{project.name}</div>
                            <div className="text-xs text-ink-secondary font-medium mt-1">{(project as any).clientName}</div>
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex justify-start">
                          <Badge variant={getStatusVariant((project as any).status)}>{(project as any).status}</Badge>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        {assigneeName ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-subtle flex items-center justify-center text-[9px] font-bold text-ink-secondary border border-border-subtle">{assigneeName[0]}</div>
                            <span className="text-xs text-ink-primary font-medium">Owner</span>
                          </div>
                        ) : <span className="text-ink-tertiary text-xs">--</span>}
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-sm font-medium text-ink-primary">{(project as any)?.dueDate ? new Date((project as any).dueDate).toLocaleDateString() : '--'}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex justify-start">
                          <Badge variant={getPriorityVariant((project as any).priority)}>{(project as any).priority}</Badge>
                        </div>
                      </td>
                      {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setEditingProject(project); setIsModalOpen(true); }}
                            className="h-8 px-2 text-[10px] uppercase font-bold"
                          >
                            Edit
                          </Button>
                          {inRouter ? (
                            <Link to={`/projects/${project.id}`}>
                              <div className="p-2 text-ink-tertiary hover:text-primary hover:bg-subtle rounded-md transition-colors">
                                <ArrowRight size={16} />
                              </div>
                            </Link>
                          ) : (
                            <a href={`/projects/${project.id}`}>
                              <div className="p-2 text-ink-tertiary hover:text-primary hover:bg-subtle rounded-md transition-colors">
                                <ArrowRight size={16} />
                              </div>
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border-subtle flex items-center justify-between bg-white">
          <div className="text-xs text-ink-tertiary font-medium">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
