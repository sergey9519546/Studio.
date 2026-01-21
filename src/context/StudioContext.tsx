import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Project, Asset } from "../services/types";
import { ProjectsAPI } from "../services/api/projects";

interface CreativeSession {
  mood: string;
  recentAssets: Asset[];
  aiContext: string;
}

interface StudioContextType {
  // State
  activeProject: Project | null;
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  session: CreativeSession;

  // Actions
  setActiveProject: (projectId: string | null) => void;
  refreshProjects: () => Promise<void>;
  updateSessionMood: (mood: string) => void;
  addRecentAsset: (asset: Asset) => void;
  updateAiContext: (context: string) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [session, setSession] = useState<CreativeSession>({
    mood: "",
    recentAssets: [],
    aiContext: ""
  });

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await ProjectsAPI.getProjects();
      setProjects(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to load studio projects:", err);
      setError("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  const activeProject = activeProjectId
    ? projects.find(p => p.id === activeProjectId) || null
    : null;

  const handleSetActiveProject = useCallback((id: string | null) => {
    setActiveProjectId(id);
    // Optionally persist to localStorage here
    if (id) {
        localStorage.setItem("studio_active_project", id);
    } else {
        localStorage.removeItem("studio_active_project");
    }
  }, []);

  // Restore session
  useEffect(() => {
      const savedId = localStorage.getItem("studio_active_project");
      if (savedId && projects.length > 0) {
          // Verify it exists
          if (projects.find(p => p.id === savedId)) {
              setActiveProjectId(savedId);
          }
      }
  }, [projects]);

  const updateSessionMood = useCallback((mood: string) => {
    setSession(prev => ({ ...prev, mood }));
  }, []);

  const addRecentAsset = useCallback((asset: Asset) => {
    setSession(prev => ({
      ...prev,
      recentAssets: [asset, ...prev.recentAssets].slice(0, 10) // Keep last 10
    }));
  }, []);

  const updateAiContext = useCallback((context: string) => {
    setSession(prev => ({ ...prev, aiContext: context }));
  }, []);

  const value: StudioContextType = {
    activeProject,
    projects,
    isLoading,
    error,
    session,
    setActiveProject: handleSetActiveProject,
    refreshProjects: fetchProjects,
    updateSessionMood,
    addRecentAsset,
    updateAiContext
  };

  return (
    <StudioContext.Provider value={value}>
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (context === undefined) {
    throw new Error("useStudio must be used within a StudioProvider");
  }
  return context;
};
