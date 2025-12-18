import { Box } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";

import { Moodboard } from "./components/Moodboard";
import { ProjectDashboard } from "./components/ProjectDashboard";
import { TalentRoster } from "./components/TalentRoster";
import CommandBar from "./components/layout/CommandBar";
import Sidebar from "./components/layout/Sidebar";
import { ErrorBoundary } from "./components/loading/ErrorBoundary";
import { LoadingSpinner } from "./components/loading/LoadingSpinner";
import PluginManagerPage from "./pages/PluginManagerPage";
import { FreelancersAPI } from "./services/api/freelancers";
import { MoodboardAPI } from "./services/api/moodboard";
import { ProjectsAPI } from "./services/api/projects";
import { Freelancer, MoodboardItem, Project } from "./services/types";
import { webSocketService } from "./services/websocket";
import AnalysisView from "./views/AnalysisView";
import ConfluenceView from "./views/ConfluenceView";
import DashboardHome from "./views/DashboardHome";
import GuardianRoom from "./views/GuardianRoom";
import ProjectsView from "./views/ProjectsView";
import TranscriptsView from "./views/TranscriptsView";

// State interfaces for data management
interface DataState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Custom hook for API data fetching
function useApiData<T>(fetchFunction: () => Promise<T[]>): DataState<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('API fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Project Context Header Component
function ProjectContextHeader({ project }: { project: Project }) {
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
}

// Data loading component
function DataLoader({ loading, error, children, onRetry }: {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
  onRetry?: () => void;
}) {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Box className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

// Individual Project Dashboard Component
function ProjectDashboardRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [projectBrief, setProjectBrief] = useState(
    "Creative direction for a kinetic, zero-gravity inspired brand world."
  );

  const fetchProjects = useCallback(
    () => ProjectsAPI.getProjects().then(resp => resp.data),
    []
  );

  // Fetch project data from API
  const { data: projects, loading, error, refetch } = useApiData<Project>(fetchProjects);

  const project = projects.find(p => p.id === id);

  useEffect(() => {
    if (!loading && !error && projects.length > 0 && !project) {
      navigate("/projects", { replace: true });
    }
  }, [project, loading, error, projects, navigate]);

  if (!project) {
    return (
      <DataLoader loading={loading} error={error} onRetry={refetch}>
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
      </DataLoader>
    );
  }

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
}

// Writers Room Component with Project Context
function WritersRoomRoute() {
  const navigate = useNavigate();
  const { search } = window.location;
  const params = new URLSearchParams(search);
  const projectId = params.get("project");

  const fetchProjects = useCallback(
    () => ProjectsAPI.getProjects().then(resp => resp.data),
    []
  );

  // Fetch project data for context
  const { data: projects, loading, error } = useApiData<Project>(fetchProjects);

  const project = projectId ? projects.find(p => p.id === projectId) : null;

  return (
    <DataLoader loading={loading} error={error}>
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
    </DataLoader>
  );
}

// Moodboard Component with Project Context
function MoodboardRoute() {
  const { search } = window.location;
  const params = new URLSearchParams(search);
  const projectId = params.get("project");

  const fetchMoodboardItems = useCallback(
    () =>
      projectId
        ? MoodboardAPI.getMoodboardItems(projectId).then(response => response.data)
        : Promise.resolve([]),
    [projectId]
  );

  const fetchProjects = useCallback(
    () => ProjectsAPI.getProjects().then(resp => resp.data),
    []
  );

  // Fetch moodboard items from API
  const { data: moodboardItems, loading, error, refetch } = useApiData<MoodboardItem>(fetchMoodboardItems);

  // Fetch projects for fallback
  const { data: projects } = useApiData<Project>(fetchProjects);

  const project = projectId ? projects.find(p => p.id === projectId) : projects[0];
  const effectiveProjectId = projectId || project?.id || '';

  const handleMoodboardDelete = async (itemId: string) => {
    try {
      await MoodboardAPI.deleteMoodboardItem(itemId);
      refetch(); // Refresh the moodboard items
      console.log("Moodboard item deleted:", itemId);
    } catch (error) {
      console.error("Failed to delete moodboard item:", error);
    }
  };

  return (
    <DataLoader loading={loading} error={error} onRetry={refetch}>
      <Moodboard
        projectId={effectiveProjectId}
        items={moodboardItems}
        onItemDelete={handleMoodboardDelete}
      />
    </DataLoader>
  );
}

// Talent Roster Component with API data
function TalentRosterRoute() {
  const navigate = useNavigate();

  const fetchFreelancers = useCallback(
    () => FreelancersAPI.getFreelancers().then(resp => resp.data),
    []
  );

  // Fetch freelancers from API
  const { data: freelancers, loading, error, refetch } = useApiData<Freelancer>(fetchFreelancers);

  return (
    <DataLoader loading={loading} error={error} onRetry={refetch}>
      <TalentRoster
        freelancers={freelancers}
        onSelect={() => navigate("/writers-room")}
      />
    </DataLoader>
  );
}

// Layout Component with WebSocket integration
function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize WebSocket connection
    const initializeWebSocket = async () => {
      try {
        await webSocketService.connect();
        console.log('WebSocket connected successfully');
      } catch (error) {
        console.warn('WebSocket connection failed:', error);
      }
    };

    initializeWebSocket();

    // Cleanup on unmount
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="w-full h-screen bg-app flex relative overflow-hidden text-ink-primary">
        <Sidebar />
        <main className="flex-1 ml-72 h-full overflow-y-auto relative z-0">
          {children}
        </main>
        <CommandBar />
      </div>
    </ErrorBoundary>
  );
}

// Wrapper component for ProjectsView to handle API data
function ProjectsViewWrapper() {
  const fetchProjects = useCallback(
    () => ProjectsAPI.getProjects().then(resp => resp.data),
    []
  );
  const { data: projects, loading, error, refetch } = useApiData<Project>(fetchProjects);

  return (
    <DataLoader loading={loading} error={error} onRetry={refetch}>
      <ProjectsView 
        projects={projects} 
        onSelect={(project) => `/projects/${project.id}`} 
      />
    </DataLoader>
  );
}

// Main App Component with Router
export default function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<DashboardHome />} />

          {/* Analysis */}
          <Route path="/analysis" element={<AnalysisView />} />

          {/* Projects */}
          <Route path="/projects" element={<ProjectsViewWrapper />} />
          <Route path="/projects/:id" element={<ProjectDashboardRoute />} />

          {/* Moodboard */}
          <Route path="/moodboard" element={<MoodboardRoute />} />

          {/* Talent Roster */}
          <Route path="/talent" element={<TalentRosterRoute />} />

          {/* Plugins */}
          <Route path="/plugins" element={<PluginManagerPage />} />

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
    </ErrorBoundary>
  );
}
