import { Box } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";

import { Moodboard } from "./components/Moodboard";
import { ProjectDashboard } from "./components/ProjectDashboard";
import { TalentRoster } from "./components/TalentRoster";
import CommandBar from "./components/layout/CommandBar";
import Sidebar from "./components/layout/Sidebar";
import { LoadingSpinner } from "./components/loading/LoadingSpinner";
import {
  DEMO_DATA_ENABLED,
  DEMO_FREELANCERS,
  DEMO_PROJECTS,
  getDemoMoodboardItems,
} from "./data/demoData";
import { FreelancersAPI } from "./services/api/freelancers";
import { MoodboardAPI } from "./services/api/moodboard";
import { ProjectsAPI } from "./services/api/projects";
import { Freelancer, MoodboardItem, Project } from "./services/types";
import { useApiData } from "./hooks/useApiData";
import { getProjectStatusMeta } from "./utils/status";
import DashboardHome from "./views/DashboardHome";
import GuardianRoom from "./views/GuardianRoom";
import ProjectsView from "./views/ProjectsView";
import CreateProjectModal from "./components/projects/CreateProjectModal";
import ProjectSwitcher from "./components/projects/ProjectSwitcher";

// Project Context Header Component
function ProjectContextHeader({ project }: { project: Project }) {
  const navigate = useNavigate();
  const projectTitle = project.title || "Untitled";
  const statusMeta = getProjectStatusMeta(project.status);

  return (
    <div className="sticky top-0 z-10 bg-app/95 backdrop-blur border-b border-border-subtle px-12 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-ink-primary text-white flex items-center justify-center font-bold">
          {projectTitle.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-tertiary uppercase">
              Project Context
            </span>
            <span className={`text-[11px] px-2 py-1 rounded-full font-semibold border ${statusMeta.className}`}>
              {statusMeta.label}
            </span>
          </div>
          <div className="text-lg font-bold text-ink-primary">
            {projectTitle}
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
        <div className="w-16 h-16 bg-state-danger-bg rounded-full flex items-center justify-center mb-4">
          <Box className="w-8 h-8 text-state-danger" />
        </div>
        <h3 className="text-lg font-semibold text-ink-primary mb-2">Error Loading Data</h3>
        <p className="text-ink-secondary mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

function resolveFallbackData<T>(
  data: T[],
  loading: boolean,
  error: string | null,
  fallback: T[],
  enabled = true
) {
  const useFallback = Boolean(
    enabled && DEMO_DATA_ENABLED && !loading && (error || data.length === 0)
  );
  return {
    data: useFallback ? fallback : data,
    error: useFallback ? null : error,
    useFallback,
  };
}

// Individual Project Dashboard Component
function ProjectDashboardRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [projectBrief, setProjectBrief] = useState("");

  const fetchProjects = useCallback(
    () => ProjectsAPI.getProjects().then(resp => resp.data),
    []
  );

  // Fetch project data from API
  const { data: projects, loading, error, refetch } = useApiData<Project>(
    fetchProjects,
    {
      errorMessage: "Failed to load projects",
      toastOnError: !DEMO_DATA_ENABLED,
    }
  );
  const {
    data: resolvedProjects,
    error: resolvedProjectsError,
    useFallback: usingDemoProjects,
  } = resolveFallbackData(projects, loading, error, DEMO_PROJECTS);
  const project = resolvedProjects.find((p) => p.id === id);

  const fetchProjectAssets = useCallback(
    () =>
      project?.id
        ? MoodboardAPI.getMoodboardItems(project.id).then(response => response.data)
        : Promise.resolve([]),
    [project?.id]
  );

  const {
    data: projectAssets,
    loading: assetsLoading,
    error: assetsError,
  } = useApiData<MoodboardItem>(fetchProjectAssets, {
    errorMessage: "Failed to load moodboard items",
    toastOnError: !DEMO_DATA_ENABLED,
  });
  const demoAssets = project ? getDemoMoodboardItems(project.id) : [];
  const { data: resolvedAssets } = resolveFallbackData(
    projectAssets,
    assetsLoading,
    assetsError,
    demoAssets,
    usingDemoProjects && demoAssets.length > 0
  );

  useEffect(() => {
    if (project) {
      setProjectBrief(project.description || "");
    }
  }, [project]);

  const handleBriefSave = useCallback(async (nextBrief: string) => {
    if (!project) return;
    setProjectBrief(nextBrief);
    if (usingDemoProjects) return;
    try {
      await ProjectsAPI.updateProject(project.id, { description: nextBrief });
    } catch (err) {
      console.error("Failed to update project brief:", err);
    }
  }, [project, usingDemoProjects]);

  useEffect(() => {
    if (!loading && !resolvedProjectsError && resolvedProjects.length > 0 && !project) {
      navigate("/projects", { replace: true });
    }
  }, [project, loading, resolvedProjectsError, resolvedProjects, navigate]);

  if (!project) {
    return (
      <DataLoader loading={loading} error={resolvedProjectsError} onRetry={refetch}>
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
        projectTitle={project.title || "Untitled Project"}
        brief={projectBrief}
        status={project.status}
        client={project.clientName || project.client}
        startDate={project.startDate}
        endDate={project.endDate}
        tone={project.tone}
        assets={resolvedAssets}
        onBriefChange={handleBriefSave}
        onNavigateToWritersRoom={() => navigate(`/writers-room?project=${project.id}`)}
        onNavigateToMoodboard={() => navigate(`/moodboard?project=${project.id}`)}
      />
    </>
  );
}

// Writers Room Component with Project Context
function WritersRoomRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectIdParam = params.get("project");
  const prompt = params.get("prompt") || undefined;

  const fetchProjects = useCallback(
    () => ProjectsAPI.getProjects().then(resp => resp.data),
    []
  );

  // Fetch project data for context
  const { data: projects, loading, error } = useApiData<Project>(fetchProjects, {
    errorMessage: "Failed to load projects",
    toastOnError: !DEMO_DATA_ENABLED,
  });
  const {
    data: resolvedProjects,
    error: resolvedProjectsError,
  } = resolveFallbackData(projects, loading, error, DEMO_PROJECTS);
  const fallbackProject = resolvedProjects[0] || null;
  const project = projectIdParam
    ? resolvedProjects.find((p) => p.id === projectIdParam) || fallbackProject
    : fallbackProject;
  const activeProjectId = project?.id;

  const handleProjectChange = (nextProjectId: string) => {
    const nextParams = new URLSearchParams(location.search);
    nextParams.set("project", nextProjectId);
    navigate(`/writers-room?${nextParams.toString()}`, { replace: true });
  };

  return (
    <DataLoader loading={loading} error={resolvedProjectsError}>
      <div className="h-full flex flex-col">
        {resolvedProjects.length > 1 && (
          <div className="px-8 pt-8">
            <ProjectSwitcher
              projects={resolvedProjects}
              value={activeProjectId}
              onChange={handleProjectChange}
              label="Writer's Room context"
            />
          </div>
        )}
        <GuardianRoom
          key={activeProjectId || "writers-room"}
          project={project}
          initialPrompt={prompt}
          onBack={() => {
            if (project) {
              navigate(`/projects/${project.id}`);
            } else {
              navigate("/writers-room");
            }
          }}
        />
      </div>
    </DataLoader>
  );
}

// Moodboard Component with Project Context
function MoodboardRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectIdParam = params.get("project");

  const fetchProjects = useCallback(
    () => ProjectsAPI.getProjects().then(resp => resp.data),
    []
  );

  // Fetch projects for fallback
  const { data: projects, loading: projectsLoading, error: projectsError } = useApiData<Project>(
    fetchProjects,
    {
      errorMessage: "Failed to load projects",
      toastOnError: !DEMO_DATA_ENABLED,
    }
  );
  const {
    data: resolvedProjects,
  } = resolveFallbackData(projects, projectsLoading, projectsError, DEMO_PROJECTS);
  const fallbackProject = resolvedProjects[0] || null;
  const project = projectIdParam
    ? resolvedProjects.find((p) => p.id === projectIdParam) || fallbackProject
    : fallbackProject;
  const effectiveProjectId = project?.id || "";

  const fetchMoodboardItems = useCallback(
    () =>
      effectiveProjectId
        ? MoodboardAPI.getMoodboardItems(effectiveProjectId).then(response => response.data)
        : Promise.resolve([]),
    [effectiveProjectId]
  );

  // Fetch moodboard items from API
  const { data: moodboardItems, loading, error, refetch } = useApiData<MoodboardItem>(
    fetchMoodboardItems,
    {
      errorMessage: "Failed to load moodboard items",
      toastOnError: !DEMO_DATA_ENABLED,
    }
  );
  const demoItems = getDemoMoodboardItems(effectiveProjectId);
  const {
    data: resolvedMoodboardItems,
    error: resolvedMoodboardError,
  } = resolveFallbackData(
    moodboardItems,
    loading,
    error,
    demoItems,
    DEMO_DATA_ENABLED && demoItems.length > 0
  );

  const handleProjectChange = (nextProjectId: string) => {
    const nextParams = new URLSearchParams(location.search);
    nextParams.set("project", nextProjectId);
    navigate(`/moodboard?${nextParams.toString()}`, { replace: true });
  };

  const handleMoodboardDelete = async (itemId: string) => {
    try {
      await MoodboardAPI.deleteMoodboardItem(itemId);
      refetch(); // Refresh the moodboard items
    } catch (error) {
      console.error("Failed to delete moodboard item:", error);
    }
  };

  const handleSemanticSearch = useCallback(
    async (query: string) => {
      if (!effectiveProjectId) return [];
      return MoodboardAPI.searchMoodboardItems(query, effectiveProjectId);
    },
    [effectiveProjectId]
  );

  const handleUnsplashAdd = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <DataLoader loading={loading} error={resolvedMoodboardError} onRetry={refetch}>
      {effectiveProjectId ? (
        <div className="h-full flex flex-col">
          {resolvedProjects.length > 1 && (
            <div className="px-8 pt-8">
              <ProjectSwitcher
                projects={resolvedProjects}
                value={effectiveProjectId}
                onChange={handleProjectChange}
                label="Moodboard context"
              />
            </div>
          )}
          <Moodboard
            projectId={effectiveProjectId}
            items={resolvedMoodboardItems}
            onItemDelete={handleMoodboardDelete}
            onSemanticSearch={handleSemanticSearch}
            onAddUnsplashImage={handleUnsplashAdd}
          />
        </div>
      ) : (
        <div className="p-12">
          <div className="rounded-3xl border border-border-subtle bg-subtle p-10 text-center">
            <h2 className="text-xl font-semibold text-ink-primary mb-2">
              No projects available
            </h2>
            <p className="text-sm text-ink-secondary mb-4">
              Create a project first to start building a moodboard.
            </p>
            <button
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
              onClick={() => navigate("/projects")}
            >
              Go to Projects
            </button>
          </div>
        </div>
      )}
    </DataLoader>
  );
}

// Freelancers Component with API data
function FreelancersRoute() {
  const navigate = useNavigate();

  const fetchFreelancers = useCallback(
    () => FreelancersAPI.getFreelancers().then(resp => resp.data),
    []
  );

  // Fetch freelancers from API
  const { data: freelancers, loading, error, refetch } = useApiData<Freelancer>(
    fetchFreelancers,
    {
      errorMessage: "Failed to load freelancers",
      toastOnError: !DEMO_DATA_ENABLED,
    }
  );
  const {
    data: resolvedFreelancers,
    error: resolvedFreelancersError,
  } = resolveFallbackData(freelancers, loading, error, DEMO_FREELANCERS);

  return (
    <DataLoader loading={loading} error={resolvedFreelancersError} onRetry={refetch}>
      <TalentRoster
        freelancers={resolvedFreelancers}
        onSelect={() => navigate("/writers-room")}
        onTalentMatch={(brief) => {
          const params = new URLSearchParams();
          if (brief) {
            params.set("prompt", `Recommend freelancers for: ${brief}`);
          }
          navigate(`/writers-room?${params.toString()}`);
        }}
      />
    </DataLoader>
  );
}

// Layout Component
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">{children}</div>
      <CommandBar />
    </div>
  );
}

// Wrapper component for ProjectsView to handle API data
function ProjectsViewWrapper() {
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const fetchProjects = useCallback(
    () => ProjectsAPI.getProjects().then(resp => resp.data),
    []
  );
  const { data: projects, loading, error, refetch } = useApiData<Project>(
    fetchProjects,
    {
      errorMessage: "Failed to load projects",
      toastOnError: !DEMO_DATA_ENABLED,
    }
  );
  const {
    data: resolvedProjects,
    error: resolvedProjectsError,
  } = resolveFallbackData(projects, loading, error, DEMO_PROJECTS);

  return (
    <DataLoader loading={loading} error={resolvedProjectsError} onRetry={refetch}>
      <>
        <ProjectsView
          projects={resolvedProjects}
          onSelect={(project) => navigate(`/projects/${project.id}`)}
          onCreate={() => setCreateModalOpen(true)}
        />
        <CreateProjectModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreated={() => refetch()}
        />
      </>
    </DataLoader>
  );
}

// Main App Component with Router
export default function App() {
  return (
    <Layout>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<DashboardHome />} />

        {/* Projects */}
        <Route path="/projects" element={<ProjectsViewWrapper />} />
        <Route path="/projects/:id" element={<ProjectDashboardRoute />} />

        {/* Moodboard */}
        <Route path="/moodboard" element={<MoodboardRoute />} />

        {/* Freelancers */}
        <Route path="/freelancers" element={<FreelancersRoute />} />

        {/* Writers Room */}
        <Route path="/writers-room" element={<WritersRoomRoute />} />

        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
