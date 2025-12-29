import React from "react";
import { Select } from "../design/Select";
import type { Project } from "../../services/types";

interface ProjectSwitcherProps {
  projects: Project[];
  value?: string;
  onChange: (projectId: string) => void;
  label?: string;
}

export const ProjectSwitcher: React.FC<ProjectSwitcherProps> = ({
  projects,
  value,
  onChange,
  label = "Project context",
}) => {
  if (projects.length === 0) {
    return null;
  }

  const options = projects.map((project) => ({
    value: project.id,
    label: project.title || "Untitled project",
  }));

  return (
    <div className="mb-6 max-w-sm">
      <Select
        label={label}
        value={value || projects[0].id}
        onChange={(event) => onChange(event.target.value)}
        options={options}
      />
    </div>
  );
};

export default ProjectSwitcher;
