import { useCallback } from "react";
import { ProjectsAPI } from "../services/api/projects";
import { Project } from "../services/types";
import { useApiData } from "./useApiData";
import { DEMO_DATA_ENABLED, DEMO_PROJECTS } from "../data/demoData";

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

export function useProjects() {
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
    useFallback: usingDemoProjects,
  } = resolveFallbackData(projects, loading, error, DEMO_PROJECTS);

  return {
    projects: resolvedProjects,
    loading,
    error: resolvedProjectsError,
    refetch,
    usingDemoProjects,
  };
}
