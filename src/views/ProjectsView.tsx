import { Plus } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Select } from "../components/design/Select";
import ImportZone from "../components/projects/ImportZone";
import ProjectCard from "../components/projects/ProjectCard";
import type { Project } from "../services/types";
import { getProjectStatusMeta } from "../utils/status";

interface ProjectsViewProps {
  projects: Project[];
  onSelect: (project: Project) => void;
  onCreate?: () => void;
  onImportSuccess?: () => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onSelect,
  onCreate,
  onImportSuccess,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "title">("recent");

  const statuses = useMemo(
    () => Array.from(new Set(projects.map((p) => p.status))).filter(Boolean),
    [projects]
  );
  const statusOptions = useMemo(
    () => [
      { value: "all", label: "All statuses" },
      ...statuses.map((status) => ({
        value: status,
        label: getProjectStatusMeta(status).label,
      })),
    ],
    [statuses]
  );
  const sortOptions = useMemo(
    () => [
      { value: "recent", label: "Sort: Recent" },
      { value: "title", label: "Sort: Title" },
    ],
    []
  );

  const visibleProjects = useMemo(() => {
    let next = [...projects];
    if (statusFilter !== "all") {
      next = next.filter((p) => p.status === statusFilter);
    }
    if (sortBy === "title") {
      next.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      next.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }
    return next;
  }, [projects, sortBy, statusFilter]);

  return (
    <div className="page-shell animate-in fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-ink-primary mb-2">
            Projects
          </h1>
          <p className="text-ink-secondary text-sm">
            Active creative engagements and delivery timelines.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
            size="sm"
            variant="secondary"
            className="min-w-[160px]"
            aria-label="Filter projects by status"
          />
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "recent" | "title")}
            options={sortOptions}
            size="sm"
            variant="secondary"
            className="min-w-[140px]"
            aria-label="Sort projects"
          />
        </div>
      </div>

      <div className="mb-8">
        <ImportZone onImportSuccess={onImportSuccess} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <button
          type="button"
          onClick={onCreate}
          className="group cursor-pointer min-h-[320px] rounded-xl border-2 border-dashed border-border-subtle flex flex-col items-center justify-center hover:border-ink-primary/30 hover:bg-surface/50 transition-all duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-surface shadow-md flex items-center justify-center text-ink-secondary group-hover:text-ink-primary group-hover:scale-110 transition-all mb-6">
            <Plus size={32} />
          </div>
          <span className="font-medium text-ink-secondary group-hover:text-ink-primary">
            Create Project
          </span>
        </button>
        {visibleProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsView;
