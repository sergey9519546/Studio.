import { Box } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";

import { Moodboard } from "./src/components/Moodboard";
import { ProjectDashboard } from "./src/components/ProjectDashboard";
import { TalentRoster } from "./src/components/TalentRoster";
import CommandBar from "./src/components/layout/CommandBar";
import Sidebar from "./src/components/layout/Sidebar";
import ConfluenceView from "./src/views/ConfluenceView";
import DashboardHome from "./src/views/DashboardHome";
import GuardianRoom from "./src/views/GuardianRoom";
import ProjectsView from "./src/views/ProjectsView";
import TranscriptsView from "./src/views/TranscriptsView";

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

// Mock data - in a real app, this would come from API/context
const mockProjects: Project[] = [
  {
    id: "1",
    title: "Nebula Phase II",
    client: "AeroSpace",
    status: "In Progress",
    description: "Rebrand focusing on kinetic typography and zero-gravity aesthetics.",
    tone: ["Ethereal", "Technical"],
  },
];

const mockMoodboardItems: MoodboardItem[] = [
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
];

const mockFreelancers: Freelancer[] = [
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
];

// Project Context Header Component
const ProjectContextHeader = ({ project }: { project: Project }) => {
  const navigate = useNavigate();
  const status = project.status || "Active";
  const statusColor =
    status === "In Progress"
      ? "bg-blue-100 text-blue-700"
      : status === "Blocked"
        ? "bg-amber-100 text-amber-700"
        : "bg-emerald-100 text-emerald-700";

  return (
    <div className="sticky top-0 z-10 bg-app/95 backdrop-blur border-b border-border-subtle px-10 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-ink-primary text-white flex items-center justify-center font-bold">
          {project.title.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-tertiary uppercase">
              Project Context
            </span>
            <span className={`text-[11px] px-2 py-1 rounded-full font-semibold ${statusColor}`}>
              {status}
            </span>
          </div>
          <div className="text-lg font-bold text-ink-primary">
            {project.title}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-2 text-sm rounded-xl border border-border-subtle hover:border-ink-primary transition-colors"
          onClick={() => navigate(`/writers-room?project=${project.id}`)}
        >
          Open Writer's Room
        </button>
        <button
          className="px-3 py-2 text-sm rounded-xl border border-border-subtle hover:border-ink-primary transition-colors"
          onClick={() => navigate(`/moodboard?project=${project.id}`)}
        >
          View Moodboard
        </button>
      </div>
    </div>
  );
};

// Individual Project Dashboard Component
const ProjectDashboardRoute = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [projectBrief, setProjectBrief] = useState(
    "Creative direction for a kinetic, zero-gravity inspired brand world."
  );

  const project = mockProjects.find(p => p.id === id);

  useEffect(() => {
    if (!project) {
      navigate("/projects", { replace: true });
    }
  }, [project, navigate]);

  if (!project) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-ink-secondary">
        <div className="w-20 h-20 bg-subtle rounded-xl flex items-center justify-center mb-6">
          <Box size={32} />
        </div>
        <h3 className="text-lg font-bold text-ink-primary mb-1">
          Project Not Found
        </h3>
        <p className="text-sm mb-4">
          The project you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/projects")}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const handleMoodboardDelete = (itemId: string) => {
    // In a real app, this would update the state/context
    console.log("Delete moodboard item:", itemId);
  };

  return (
    <>
      <ProjectContextHeader project={project} />
      <ProjectDashboard
        projectId={project.id}
        projectTitle={project.title}
        brief={projectBrief}
        onBriefChange={setProjectBrief}
        onNavigateToWritersRoom={() => navigate(`/writers-room?project=${project.id}`)}
        onNavigateToMoodboard={() => navigate(`/moodboard?project=${project.id}`)}
      />
    </>
  );
};

// Writers Room Component with Project Context
const WritersRoomRoute = () => {
  const navigate = useNavigate();
  const { search } = window.location;
  const params = new URLSearchParams(search);
  const projectId = params.get("project");
  
  const project = projectId ? mockProjects.find(p => p.id === projectId) : null;

  return (
    <GuardianRoom
      project={project}
      onBack={() => {
        if (project) {
          navigate(`/projects/${project.id}`);
        } else {
          navigate("/writers-room");
        }
      }}
    />
  );
};

// Moodboard Component with Project Context
const MoodboardRoute = () => {
  const navigate = useNavigate();
  const { search } = window.location;
  const params = new URLSearchParams(search);
  const projectId = params.get("project");
  
  const project = projectId ? mockProjects.find(p => p.id === projectId) : null;

  const handleMoodboardDelete = (itemId: string) => {
    // In a real app, this would update the state/context
    console.log("Delete moodboard item:", itemId);
  };

  return (
    <Moodboard
      projectId={projectId || mockProjects[0].id}
      items={mockMoodboardItems}
      onItemDelete={handleMoodboardDelete}
    />
  );
};

// Layout Component with Sidebar
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen bg-app flex relative overflow-hidden text-ink-primary">
      <Sidebar />
      <main className="flex-1 ml-72 h-full overflow-y-auto relative z-0">
        {children}
      </main>
      <CommandBar />
    </div>
  );
};

// Main App Component with Router
export default function App() {
  return (
    <Layout>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<DashboardHome />} />
        
        {/* Projects */}
        <Route 
          path="/projects" 
          element={
            <ProjectsView 
              projects={mockProjects} 
              onSelect={(project) => `/projects/${project.id}`} 
            />
          } 
        />
        <Route path="/projects/:id" element={<ProjectDashboardRoute />} />
        
        {/* Moodboard */}
        <Route path="/moodboard" element={<MoodboardRoute />} />
        
        {/* Talent Roster */}
        <Route 
          path="/talent" 
          element={
            <TalentRoster
              freelancers={mockFreelancers}
              onSelect={() => navigate("/writers-room")}
            />
          } 
        />
        
        {/* Writers Room */}
        <Route path="/writers-room" element={<WritersRoomRoute />} />
        
        {/* Knowledge Base */}
        <Route path="/knowledge-base" element={<ConfluenceView />} />
        
        {/* Transcripts */}
        <Route path="/transcripts" element={<TranscriptsView />} />
        
        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
