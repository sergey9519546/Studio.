import { Box } from "lucide-react";
import { useState } from "react";

import { PageEditor } from "./components/pages/PageEditor";
import { Moodboard } from "./src/components/Moodboard";
import { ProjectDashboard } from "./src/components/ProjectDashboard";
import { TalentRoster } from "./src/components/TalentRoster";
import CommandBar from "./src/components/layout/CommandBar";
import Sidebar from "./src/components/layout/Sidebar";
import ConfluenceView from "./src/views/ConfluenceView";
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

type MoodboardItem = {
  id: string;
  url: string;
  tags: string[];
  moods: string[];
  colors: string[];
  shotType?: string;
  uploadedAt: string;
};

type Freelancer = {
  id: string;
  name: string;
  role: string;
  availability: string;
  rate: number;
  skills: string[];
  location: string;
  rating: number;
  bio: string;
  portfolio?: string;
};

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [writerMode, setWriterMode] = useState(false);
  const [projectBrief, setProjectBrief] = useState(
    "Creative direction for a kinetic, zero-gravity inspired brand world."
  );
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
  const [moodboardItems, setMoodboardItems] = useState<MoodboardItem[]>([
    {
      id: "mb-1",
      url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800",
      tags: ["futuristic", "neon"],
      moods: ["bold", "cinematic"],
      colors: ["#2463E6", "#18C9AE"],
      shotType: "wide",
      uploadedAt: new Date().toISOString(),
    },
    {
      id: "mb-2",
      url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=800",
      tags: ["kinetic", "typography"],
      moods: ["technical", "refined"],
      colors: ["#101118", "#FFFFFF"],
      shotType: "macro",
      uploadedAt: new Date().toISOString(),
    },
  ]);
  const [freelancers] = useState<Freelancer[]>([
    {
      id: "f-1",
      name: "Maya Chen",
      role: "Art Director",
      availability: "Available",
      rate: 120,
      skills: ["Art Direction", "Motion", "Typography"],
      location: "Los Angeles",
      rating: 4.9,
      bio: "Led immersive brand campaigns across tech and media.",
      portfolio: "https://portfolio.example.com/maya",
    },
    {
      id: "f-2",
      name: "Leo Martinez",
      role: "Creative Technologist",
      availability: "Limited",
      rate: 140,
      skills: ["WebGL", "Three.js", "Prototyping"],
      location: "New York",
      rating: 4.8,
      bio: "Builds interactive brand experiences with realtime graphics.",
    },
  ]);

  const handleProjectSelect = (p: Project) => {
    setActiveProject(p);
    setWriterMode(true); // Direct to writers room for demo flow
  };

  const handleMoodboardDelete = (id: string) => {
    setMoodboardItems((items) => items.filter((item) => item.id !== id));
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
      return (
        <ProjectDashboard
          projectId={activeProject.id}
          projectTitle={activeProject.title}
          brief={projectBrief}
          onBriefChange={setProjectBrief}
          onNavigateToWritersRoom={() => {
            setWriterMode(true);
            setActiveTab("writers-room");
          }}
          onNavigateToMoodboard={() => setActiveTab("moodboard")}
        />
      );
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
      case "studio":
        return (
          <ProjectDashboard
            projectId={projects[0].id}
            projectTitle={projects[0].title}
            brief={projectBrief}
            onBriefChange={setProjectBrief}
            onNavigateToWritersRoom={() => setActiveTab("writers-room")}
            onNavigateToMoodboard={() => setActiveTab("moodboard")}
          />
        );
      case "moodboard":
        return (
          <Moodboard
            projectId={projects[0].id}
            projectTitle={projects[0].title}
            items={moodboardItems}
            onItemDelete={handleMoodboardDelete}
          />
        );
      case "roster":
        return (
          <TalentRoster
            freelancers={freelancers}
            onSelect={() => setActiveTab("writers-room")}
          />
        );
      case "knowledge-base":
        return <ConfluenceView />;
      case "pages":
        return <PageEditor initialTitle="Creative OS Page" status="draft" />;
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
