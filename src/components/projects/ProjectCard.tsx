import { ArrowRight, MoreHorizontal } from "lucide-react";
import React from "react";
import type { Project } from "../../services/types";
import { getProjectStatusMeta } from "../../utils/status";
import Card from "../ui/Card";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

const ProjectCardComponent: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
}) => {
  const statusMeta = getProjectStatusMeta(project.status);

  // Using useCallback to memoize the click handler, preventing it from being
  // recreated on every render. This is a performance optimization that works
  // in conjunction with React.memo to prevent unnecessary re-renders of this
  // component.
  const handleSelect = React.useCallback(() => {
    onSelect(project);
  }, [onSelect, project]);

  return (
    <Card
      onClick={handleSelect}
      className="min-h-[320px] flex flex-col justify-between group cursor-pointer hover:border-ink-primary/10"
      hoverable
    >
      <div>
        <div className="flex justify-between items-start mb-8">
          <span
            className={`px-3 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider flex items-center gap-2 border ${statusMeta.className}`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-current" />
            {statusMeta.label}
          </span>
          <button
            className="text-ink-tertiary hover:text-ink-primary transition-colors"
            aria-label="More options"
            type="button"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
        <h3 className="text-3xl font-bold text-ink-primary mb-3 group-hover:translate-x-1 transition-transform kinetic-text">
          {project.title}
        </h3>
        <p className="text-ink-secondary text-sm line-clamp-2 leading-relaxed">
          {project.description || "No brief yet."}
        </p>
        {(project.clientName || project.client) && (
          <p className="text-xs text-ink-tertiary mt-3">
            Client: {project.clientName || project.client}
          </p>
        )}
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
  );
};

export const ProjectCard = React.memo(ProjectCardComponent);

export default ProjectCard;
