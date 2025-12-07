import { Box } from "lucide-react";
import { useState } from "react";

import CommandBar from "./src/components/layout/CommandBar";
import Sidebar from "./src/components/layout/Sidebar";
import DashboardHome from "./src/views/DashboardHome";
import GuardianRoom from "./src/views/GuardianRoom";
import ProjectsView from "./src/views/ProjectsView";

type Project = {
  id: string;
  title: string;
  client?: string;
  status: string;
  description: string;
  tone?: string[];
};

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [writerMode, setWriterMode] = useState(false);
  const [projects] = useState<Project[]>([
    {
      id: "1",
      title: "Nebula Phase II",
      client: "AeroSpace",
      status: "In Progress",
      description:
        "Rebrand focusing on kinetic typography and zero-gravity aesthetics.",
      tone: ["Ethereal", "Technical"],
    },
  ]);

  const handleProjectSelect = (p: Project) => {
    setActiveProject(p);
    setWriterMode(true); // Direct to writers room for demo flow
  };

  const renderContent = () => {
    if (activeProject) {
      if (writerMode) {
        return (
          <GuardianRoom
            project={activeProject}
            onBack={() => setActiveProject(null)}
          />
        );
      }
      return <div className="p-12">Project Space Placeholder</div>;
    }
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome />;
      case "projects":
        return (
          <ProjectsView projects={projects} onSelect={handleProjectSelect} />
        );
      case "writers-room":
        return (
          <GuardianRoom
            project={null}
            onBack={() => setActiveTab("dashboard")}
          />
        );
      default:
        return (
          <div className="h-full flex flex-col items-center justify-center text-ink-secondary">
            <div className="w-20 h-20 bg-subtle rounded-xl flex items-center justify-center mb-6">
              <Box size={32} />
            </div>
            <h3 className="text-lg font-bold text-ink-primary mb-1">
              Module Locked
            </h3>
            <p className="text-sm">
              This sector is currently under construction.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-screen bg-app flex relative overflow-hidden text-ink-primary">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(t) => {
          setActiveTab(t);
          setActiveProject(null);
        }}
      />
      <main className="flex-1 ml-72 h-full overflow-y-auto relative z-0">
        {renderContent()}
      </main>
      <CommandBar />
    </div>
  );
}
