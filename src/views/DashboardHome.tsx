import React from "react";
import { useNavigate } from "react-router-dom";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import HeroProjectCard from "../components/dashboard/HeroProjectCard";
import RecentActivityWidget from "../components/dashboard/RecentActivityWidget";
import RecentArtifactsCard, { Artifact } from "../components/dashboard/RecentArtifactsCard";
import ResourceUsageWidget from "../components/dashboard/ResourceUsageWidget";
import VibePaletteCard from "../components/dashboard/VibePaletteCard";
import { useDashboardData } from "../hooks/useDashboardData";
import { useToast } from "../hooks/useToast";
import "./DashboardHome.css";
import LuminaAICard from "@/components/dashboard/LuminaAICard";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import { getProjectStatusMeta } from "../utils/status";
import type { Project } from "../services/types";

interface DashboardHomeProps {
  onNavigateToGallery?: () => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({
  onNavigateToGallery,
}) => {
  const [accentColor, setAccentColor] = React.useState("#0F766E");
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const {
    heroProject,
    heroImage,
    artifacts,
    activities,
    counts,
    loadingHero,
    loadingArtifacts,
    errorHero,
    errorArtifacts,
    refetch,
  } = useDashboardData();

  // Set CSS custom property for accent color
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--dashboard-accent",
      accentColor
    );
    return () => {
      document.documentElement.style.removeProperty("--dashboard-accent");
    };
  }, [accentColor]);

  const handleNewProjectClick = React.useCallback(() => {
    setCreateModalOpen(true);
  }, []);

  const handleSubmitPrompt = React.useCallback(
    (prompt: string) => {
      const trimmed = prompt.trim();
      if (!trimmed) {
        addToast("Please enter a prompt", "info");
        return;
      }

      const params = new URLSearchParams();
      if (heroProject?.id) {
        params.set("project", heroProject.id);
      }
      params.set("prompt", trimmed);
      navigate(`/writers-room?${params.toString()}`);
    },
    [addToast, heroProject?.id, navigate]
  );

  const handleColorSelect = React.useCallback(
    (color: string) => {
      setAccentColor(color);
      addToast(`Accent updated to ${color}`, "info");
    },
    [addToast]
  );

  const handleViewGallery = React.useCallback(() => {
    addToast("Opening gallery...", "info");
    onNavigateToGallery?.();
  }, [addToast, onNavigateToGallery]);

  const handleArtifactClick = React.useCallback(
    (artifact: Artifact) => {
      addToast(`Opening ${artifact.name}`, "info");
    },
    [addToast]
  );

  const handleProjectCreated = React.useCallback(
    (project: Project) => {
      addToast(`Project created: ${project.title}`, "success");
      refetch();
    },
    [addToast, refetch]
  );

  const heroStatus = heroProject ? getProjectStatusMeta(heroProject.status) : null;
  const accentGlow = React.useMemo(() => `${accentColor}1A`, [accentColor]);
  const containerStyle = React.useMemo(
    (): React.CSSProperties & Record<string, string> => ({
      "--dashboard-accent": accentColor,
      backgroundImage: `radial-gradient(120% 120% at 100% 0%, ${accentGlow}, transparent 40%)`,
    }),
    [accentColor, accentGlow]
  );

  return (
    // eslint-disable-next-line react/forbid-component-props -- dynamic accent color requires inline style
    <main
      className="page-shell animate-in fade-in duration-700"
      style={containerStyle}
      role="main"
      aria-label="Dashboard home page"
    >
      <DashboardHeader
        onNewProjectClick={handleNewProjectClick}
        projectCount={counts.projects}
        freelancerCount={counts.freelancers}
        moodboardCount={counts.moodboardItems}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-min">
        {/* 1. Hero Focus (Large) */}
        {loadingHero ? (
          <div
            className="lg:col-span-6 w-full h-full"
            aria-label="Loading hero project"
          >
            <div className="h-[360px] lg:h-full rounded-2xl bg-subtle border border-border-subtle animate-pulse" />
          </div>
        ) : errorHero ? (
          <div className="lg:col-span-6 w-full h-full flex items-center justify-center">
            <div className="text-center p-8 rounded-2xl bg-state-danger-bg border border-state-danger/30">
              <p className="text-state-danger font-medium mb-2">
                Failed to load project
              </p>
              <p className="text-sm text-state-danger/70">{errorHero}</p>
            </div>
          </div>
        ) : heroProject ? (
          <HeroProjectCard
            imageSrc={heroImage ?? ""}
            priorityLabel={heroStatus?.label}
            title={heroProject.title}
            description={heroProject.description || "No brief yet. Add one to align the team."}
            className="lg:col-span-6 w-full h-full"
            status={heroStatus?.label}
            client={heroProject.clientName || heroProject.client}
          />
        ) : (
          <div className="lg:col-span-6 w-full h-full flex items-center justify-center">
            <div className="text-center p-8 rounded-2xl bg-subtle border border-border-subtle">
              <p className="text-ink-primary font-medium mb-2">
                No projects yet
              </p>
              <p className="text-sm text-ink-secondary mb-4">
                Create your first project to start the studio flow.
              </p>
              <button
                onClick={handleNewProjectClick}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
              >
                Create project
              </button>
            </div>
          </div>
        )}

        {/* Right Column Grid */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 content-start">
          {/* 2. Lumina AI (Ideation) */}
          <LuminaAICard
            onSubmitPrompt={handleSubmitPrompt}
            className="sm:col-span-2 lg:col-span-1 min-h-[220px]"
          />

          {/* 3. Vibe / Palette */}
          <VibePaletteCard
            onColorSelect={handleColorSelect}
            className="sm:col-span-2 lg:col-span-1"
            selectedColor={accentColor}
          />

          {/* 4. Artifacts (Visual History) */}
          <RecentArtifactsCard
            artifacts={artifacts}
            loading={loadingArtifacts}
            onViewGallery={handleViewGallery}
            onArtifactClick={handleArtifactClick}
            className="sm:col-span-2"
          />

          {/* 5. New Widgets (Visual Polish) */}
          <RecentActivityWidget
            className="sm:col-span-1 min-h-[220px]"
            activities={activities}
            loading={loadingHero}
          />
          <ResourceUsageWidget
            className="sm:col-span-1 min-h-[220px]"
            counts={counts}
            isError={!!errorArtifacts}
          />
        </div>
      </div>

      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={handleProjectCreated}
      />
    </main>
  );
};

export default DashboardHome;
