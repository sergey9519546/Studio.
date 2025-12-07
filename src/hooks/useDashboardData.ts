import React from "react";
import { useToast } from "./useToast";
import { DASHBOARD_CONSTANTS } from "../views/dashboardConfig";

interface HeroProject {
  id: string;
  imageSrc: string;
  priorityLabel?: string;
  title: string;
  description: string;
}

interface Artifact {
  id: string;
  name: string;
  imageSrc: string;
}

interface UseDashboardDataReturn {
  heroProject: HeroProject | null;
  artifacts: Artifact[];
  loadingHero: boolean;
  loadingArtifacts: boolean;
  errorHero: string | null;
  errorArtifacts: string | null;
  refetch: () => void;
  addArtifact: (artifact: Artifact) => void;
}

// Mock data - in real app, this would come from API
const getMockHeroProject = (): HeroProject => ({
  id: "hero-1",
  imageSrc: DASHBOARD_CONSTANTS.HERO_PROJECT.IMAGE,
  priorityLabel: "Priority One",
  title: DASHBOARD_CONSTANTS.HERO_PROJECT.TITLE,
  description: DASHBOARD_CONSTANTS.HERO_PROJECT.DESCRIPTION,
});

const getMockArtifacts = (): Artifact[] => [
  {
    id: "art-1",
    name: "Nebula_Launch.png",
    imageSrc: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop",
  },
  {
    id: "art-2",
    name: "Typography_Grid.png",
    imageSrc: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1?w=800&auto=format&fit=crop",
  },
  {
    id: "art-3",
    name: "ZeroG_Mock.png",
    imageSrc: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop",
  },
  {
    id: "art-4",
    name: "Palette_V04.png",
    imageSrc: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&auto=format&fit=crop",
  },
];

export const useDashboardData = (): UseDashboardDataReturn => {
  const [heroProject, setHeroProject] = React.useState<HeroProject | null>(null);
  const [artifacts, setArtifacts] = React.useState<Artifact[]>([]);
  const [loadingHero, setLoadingHero] = React.useState(true);
  const [loadingArtifacts, setLoadingArtifacts] = React.useState(true);
  const [errorHero, setErrorHero] = React.useState<string | null>(null);
  const [errorArtifacts, setErrorArtifacts] = React.useState<string | null>(null);
  const { addToast } = useToast();

  const fetchData = React.useCallback(() => {
    setLoadingHero(true);
    setLoadingArtifacts(true);
    setErrorHero(null);
    setErrorArtifacts(null);

    const timer = setTimeout(() => {
      try {
        // Simulate API call for hero project
        const heroData = getMockHeroProject();
        setHeroProject(heroData);
        setLoadingHero(false);

        // Simulate API call for artifacts
        const artifactsData = getMockArtifacts();
        setArtifacts(artifactsData);
        setLoadingArtifacts(false);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setErrorHero("Failed to load hero project");
        setErrorArtifacts("Failed to load artifacts");
        setLoadingHero(false);
        setLoadingArtifacts(false);
        addToast("Failed to load dashboard data", "info");
      }
    }, DASHBOARD_CONSTANTS.LOADING_DELAY);

    return () => clearTimeout(timer);
  }, [addToast]);

  const addArtifact = React.useCallback((newArtifact: Artifact) => {
    setArtifacts((prev) => [newArtifact, ...prev].slice(0, 8));
  }, []);

  const refetch = React.useCallback(() => {
    fetchData();
  }, [fetchData]);

  React.useEffect(() => {
    const cleanup = fetchData();
    return cleanup;
  }, [fetchData]);

  return {
    heroProject,
    artifacts,
    loadingHero,
    loadingArtifacts,
    errorHero,
    errorArtifacts,
    refetch,
    addArtifact,
  };
};
