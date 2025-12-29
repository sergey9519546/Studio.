import React from "react";
import "./DashboardHeader.css";
import StatusBadge from "./StatusBadge";

interface DashboardHeaderProps {
  projectCount: number;
  freelancerCount: number;
  moodboardCount: number;
  onNewProjectClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  projectCount,
  freelancerCount,
  moodboardCount,
  onNewProjectClick,
}) => {
  return (
    <header className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <StatusBadge text="Studio Online" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-ink-primary mb-3 kinetic-text">
          Welcome back.
        </h1>
        <p className="text-ink-secondary text-lg font-light tracking-tight">
          Keep the studio moving. Monitor project momentum, talent, and creative assets.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em] text-ink-tertiary">
          <div className="flex items-center gap-2">
            <span className="text-ink-primary font-semibold">{projectCount}</span>
            Projects
          </div>
          <div className="flex items-center gap-2">
            <span className="text-ink-primary font-semibold">{freelancerCount}</span>
            Freelancers
          </div>
          <div className="flex items-center gap-2">
            <span className="text-ink-primary font-semibold">{moodboardCount}</span>
            Moodboard assets
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          className="h-10 px-5 rounded-full text-white text-xs font-bold tracking-wider transition-shadow new-project-button"
          onClick={onNewProjectClick}
          aria-label="Create a new project"
        >
          Create Project
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
