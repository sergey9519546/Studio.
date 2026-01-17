import React from "react";
import { ProjectsAPI } from "../services/api/projects";
import { FreelancersAPI } from "../services/api/freelancers";
import { MoodboardAPI } from "../services/api/moodboard";
import type { Freelancer, MoodboardItem, Project } from "../services/types";
import { getProjectStatusMeta } from "../utils/status";
import { getErrorMessage } from "../utils/errors";
import { useToast } from "./useToast";

export interface DashboardArtifact {
  id: string;
  name: string;
  imageSrc?: string;
}

export interface DashboardActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "project" | "moodboard" | "freelancer";
}

export interface DashboardCounts {
  projects: number;
  freelancers: number;
  moodboardItems: number;
}

interface UseDashboardDataReturn {
  heroProject: Project | null;
  heroImage?: string;
  artifacts: DashboardArtifact[];
  activities: DashboardActivity[];
  counts: DashboardCounts;
  loadingHero: boolean;
  loadingArtifacts: boolean;
  errorHero: string | null;
  errorArtifacts: string | null;
  refetch: () => void;
}

const buildArtifacts = (items: MoodboardItem[]): DashboardArtifact[] => {
  return items.map((item) => ({
    id: item.id,
    name: item.caption || item.title || "Moodboard Item",
    imageSrc: item.url,
  }));
};

const buildActivities = (
  projects: Project[],
  items: MoodboardItem[],
  freelancers: Freelancer[]
): DashboardActivity[] => {
  const projectActivities = projects.map((project) => {
    const status = getProjectStatusMeta(project.status);
    return {
      id: `project-${project.id}`,
      title: project.title || "Untitled project",
      description: `${status.label} project updated`,
      timestamp: project.updatedAt,
      type: "project" as const,
    };
  });

  const moodboardActivities = items.map((item) => ({
    id: `moodboard-${item.id}`,
    title: item.caption || "Moodboard update",
    description: "New asset added to moodboard",
    timestamp: item.createdAt,
    type: "moodboard" as const,
  }));

  const freelancerActivities = freelancers.map((freelancer) => ({
    id: `freelancer-${freelancer.id}`,
    title: freelancer.name,
    description: freelancer.role ? `New ${freelancer.role} added` : "New freelancer added",
    timestamp: freelancer.createdAt,
    type: "freelancer" as const,
  }));

  return [...projectActivities, ...moodboardActivities, ...freelancerActivities]
    .filter((activity) => activity.timestamp)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);
};

export const useDashboardData = (): UseDashboardDataReturn => {
  const [heroProject, setHeroProject] = React.useState<Project | null>(null);
  const [heroImage, setHeroImage] = React.useState<string | undefined>(undefined);
  const [artifacts, setArtifacts] = React.useState<DashboardArtifact[]>([]);
  const [activities, setActivities] = React.useState<DashboardActivity[]>([]);
  const [counts, setCounts] = React.useState<DashboardCounts>({
    projects: 0,
    freelancers: 0,
    moodboardItems: 0,
  });
  const [loadingHero, setLoadingHero] = React.useState(true);
  const [loadingArtifacts, setLoadingArtifacts] = React.useState(true);
  const [errorHero, setErrorHero] = React.useState<string | null>(null);
  const [errorArtifacts, setErrorArtifacts] = React.useState<string | null>(null);
  const { addToast } = useToast();

  const fetchData = React.useCallback(async () => {
    setLoadingHero(true);
    setLoadingArtifacts(true);
    setErrorHero(null);
    setErrorArtifacts(null);

    let projects: Project[] = [];
    let freelancers: Freelancer[] = [];
    let moodboardItems: MoodboardItem[] = [];

    try {
      const projectsResponse = await ProjectsAPI.getProjects(1, 8);
      projects = projectsResponse.data;
      setHeroProject(projects[0] || null);
      setCounts((prev) => ({ ...prev, projects: projectsResponse.pagination.total }));
      setLoadingHero(false);
    } catch (error) {
      const message = getErrorMessage(error, "Failed to load projects");
      setErrorHero(message);
      setLoadingHero(false);
      addToast(message, "info");
    }

    try {
      const freelancersResponse = await FreelancersAPI.getFreelancers(1, 6);
      freelancers = freelancersResponse.data;
      setCounts((prev) => ({ ...prev, freelancers: freelancersResponse.pagination.total }));
    } catch (error) {
      const message = getErrorMessage(error, "Failed to load freelancers");
      addToast(message, "info");
    }

    if (projects[0]) {
      try {
        const moodboardResponse = await MoodboardAPI.getMoodboardItems(projects[0].id, 1, 12);
        moodboardItems = moodboardResponse.data;
        setArtifacts(buildArtifacts(moodboardItems));
        setCounts((prev) => ({ ...prev, moodboardItems: moodboardResponse.pagination.total }));
        setHeroImage(moodboardItems[0]?.url);
      } catch (error) {
        const message = getErrorMessage(error, "Failed to load moodboard items");
        setErrorArtifacts(message);
        addToast(message, "info");
      } finally {
        setLoadingArtifacts(false);
      }
    } else {
      setArtifacts([]);
      setHeroImage(undefined);
      setCounts((prev) => ({ ...prev, moodboardItems: 0 }));
      setLoadingArtifacts(false);
    }

    setActivities(buildActivities(projects, moodboardItems, freelancers));
  }, [addToast]);

  React.useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return {
    heroProject,
    heroImage,
    artifacts,
    activities,
    counts,
    loadingHero,
    loadingArtifacts,
    errorHero,
    errorArtifacts,
    refetch: fetchData,
  };
};
