import { Bell } from "lucide-react";
import React from "react";
import "./DashboardHeader.css";
import StatusBadge from "./StatusBadge";

interface DashboardHeaderProps {
  onNotificationsClick?: () => void;
  onNewProjectClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onNotificationsClick,
  onNewProjectClick,
}) => {
  return (
    <header className="mb-12 flex justify-between items-end">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <StatusBadge text="Studio Online" />
        </div>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-ink-primary mb-3 kinetic-text">
          Good Morning.
        </h1>
        <p className="text-ink-secondary text-xl font-light tracking-tight">
          The studio focus is nominal.{" "}
          <span className="text-ink-primary font-medium border-b border-border-subtle pb-0.5">
            2 deadlines approaching.
          </span>
        </p>
      </div>
      <div className="flex gap-3">
        <button
          className="h-10 w-10 rounded-full bg-surface border border-border-subtle flex items-center justify-center text-ink-secondary hover:text-ink-primary hover:border-ink-primary transition-colors"
          onClick={onNotificationsClick}
          aria-label="View notifications"
        >
          <Bell size={18} />
        </button>
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
