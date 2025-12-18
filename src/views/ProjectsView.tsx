import { ArrowRight, MoreHorizontal, Plus } from "lucide-react";
import React, { useMemo, useState } from "react";
import Card from "../components/ui/Card";

// Define the Project type based on its usage in the component
interface Project {
  id: string;
  status: string;
  title: string;
  description: string;
}

interface ProjectsViewProps {
  projects: Project[];
  onSelect: (project: Project) => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onSelect }) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "title">("recent");

  const statuses = useMemo(
    () => Array.from(new Set(projects.map((p) => p.status))).filter(Boolean),
    [projects]
  );

  const visibleProjects = useMemo(() => {
    let next = [...projects];
    if (statusFilter !== "all") {
      next = next.filter((p) => p.status === statusFilter);
    }
    if (sortBy === "title") {
      next.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      next.sort((a, b) => b.id.localeCompare(a.id));
    }
    return next;
  }, [projects, sortBy, statusFilter]);

  return (
    <div className="pt-12 px-12 max-w-[1600px] mx-auto animate-in fade-in pb-32">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-ink-primary mb-2">
            Projects
          </h1>
          <p className="text-ink-secondary text-sm">
            Active creative engagements.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-surface border border-border-subtle rounded-xl text-xs font-bold hover:border-ink-primary transition-colors"
          >
            <option value="all">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "recent" | "title")}
            className="px-3 py-2 bg-surface border border-border-subtle rounded-xl text-xs font-bold hover:border-ink-primary transition-colors"
          >
            <option value="recent">Sort: Recent</option>
            <option value="title">Sort: Title</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="group cursor-pointer min-h-[320px] rounded-xl border-2 border-dashed border-border-subtle flex flex-col items-center justify-center hover:border-ink-primary/30 hover:bg-surface/50 transition-all duration-300">
          <div className="w-16 h-16 rounded-full bg-surface shadow-md flex items-center justify-center text-ink-secondary group-hover:text-ink-primary group-hover:scale-110 transition-all mb-6">
            <Plus size={32} />
          </div>
          <span className="font-medium text-ink-secondary group-hover:text-ink-primary">
            Create Project
          </span>
        </div>
        {visibleProjects.map((p) => (
          <Card
            key={p.id}
            onClick={() => onSelect(p)}
            className="min-h-[320px] flex flex-col justify-between group cursor-pointer hover:border-ink-primary/10"
          >
            <div>
              <div className="flex justify-between items-start mb-8">
                <span className="px-3 py-1 bg-subtle border border-border-subtle rounded-lg text-[10px] uppercase font-bold tracking-wider text-ink-secondary flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />{" "}
                  {p.status}
                </span>
                <button
                  className="text-ink-tertiary hover:text-ink-primary transition-colors"
                  aria-label="More options"
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>
              <h3 className="text-3xl font-bold text-ink-primary mb-3 group-hover:translate-x-1 transition-transform kinetic-text">
                {p.title}
              </h3>
              <p className="text-ink-secondary text-sm line-clamp-2 leading-relaxed">
                {p.description}
              </p>
            </div>
            <div className="pt-8 border-t border-border-subtle flex justify-between items-end">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-subtle border-2 border-surface" />
                <div className="w-10 h-10 rounded-full bg-border-subtle border-2 border-surface" />
              </div>
              <div className="w-12 h-12 rounded-full bg-ink-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                <ArrowRight size={20} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectsView;
