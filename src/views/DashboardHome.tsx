import React from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import HeroProjectCard from "../components/dashboard/HeroProjectCard";
import SparkAICard from "../components/dashboard/SparkAICard";
import VibePaletteCard from "../components/dashboard/VibePaletteCard";
import RecentArtifactsCard, { Artifact } from "../components/dashboard/RecentArtifactsCard";
import "./DashboardHome.css";

interface HeroProject {
  id: string;
  imageSrc: string;
  priorityLabel?: string;
  title: string;
  description: string;
}

type ToastKind = "info" | "success";

interface Toast {
  id: number;
  message: string;
  type: ToastKind;
}

// Constants for better maintainability
const HERO_PROJECT_IMAGE =
  "https://images.unsplash.com/photo-1492551557933-34265f7af79e?q=80&w=2670&auto=format&fit=crop";
const HERO_PROJECT_TITLE = "Nebula Phase II";
const HERO_PROJECT_DESCRIPTION =
  "Comprehensive rebrand focusing on kinetic typography and zero-gravity aesthetics. Client review in 4 hours.";

interface DashboardHomeProps {
  onNavigateToGallery?: () => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ onNavigateToGallery }) => {
  const [accentColor, setAccentColor] = React.useState("#2463E6");
  const [heroProject, setHeroProject] = React.useState<HeroProject | null>(null);
  const [artifacts, setArtifacts] = React.useState<Artifact[]>([]);
  const [loadingHero, setLoadingHero] = React.useState(true);
  const [loadingArtifacts, setLoadingArtifacts] = React.useState(true);
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const toastTimeouts = React.useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  React.useEffect(() => {
    document.documentElement.style.setProperty("--dashboard-accent", accentColor);
    return () => {
      document.documentElement.style.removeProperty("--dashboard-accent");
    };
  }, [accentColor]);

  React.useEffect(() => {
    setLoadingHero(true);
    setLoadingArtifacts(true);
    const timer = setTimeout(() => {
      setHeroProject({
        id: "hero-1",
        imageSrc: HERO_PROJECT_IMAGE,
        priorityLabel: "Priority One",
        title: HERO_PROJECT_TITLE,
        description: HERO_PROJECT_DESCRIPTION,
      });
      setLoadingHero(false);

      setArtifacts([
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
      ]);
      setLoadingArtifacts(false);
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  const addToast = React.useCallback((message: string, type: ToastKind = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    const timeout = setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      delete toastTimeouts.current[id];
    }, 2800);
    toastTimeouts.current[id] = timeout;
  }, []);

  React.useEffect(() => {
    return () => {
      Object.values(toastTimeouts.current).forEach(clearTimeout);
    };
  }, []);

  const handleNotificationsClick = () => {
    addToast("Notifications panel is coming soon.", "info");
  };

  const handleNewProjectClick = () => {
    addToast("New Project modal will open here.", "success");
  };

  const handleSubmitPrompt = (prompt: string) => {
    addToast(`Prompt sent: "${prompt}"`, "success");
    const trimmed = prompt.trim();
    const suffix = trimmed ? trimmed.slice(0, 12) : "Concept";
    const newArtifact: Artifact = {
      id: `gen-${Date.now()}`,
      name: `${suffix.replace(/\s+/g, "_")}.png`,
    };
    setArtifacts((prev) => [newArtifact, ...prev].slice(0, 8));
  };

  const handleColorSelect = (color: string) => {
    setAccentColor(color);
    addToast(`Accent updated to ${color}`, "info");
  };

  const handleViewGallery = () => {
    addToast("Opening gallery...", "info");
    onNavigateToGallery?.();
  };

  const handleArtifactClick = (artifact: Artifact) => {
    addToast(`Opening ${artifact.name}`, "info");
  };

  const accentGlow = `${accentColor}1A`;
  const containerStyle: React.CSSProperties = {
    ["--dashboard-accent"]: accentColor,
    backgroundImage: `radial-gradient(120% 120% at 100% 0%, ${accentGlow}, transparent 40%)`,
  };

  return (
    <div
      className="animate-in fade-in duration-700 pb-32 pt-12 px-12 max-w-[1600px] mx-auto"
      style={containerStyle}
    >
      <div className="fixed top-6 right-6 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-surface border border-border-subtle rounded-xl shadow-lg px-4 py-3 text-sm text-ink-primary w-72 flex items-start gap-2"
            style={{
              borderColor: toast.type === "success" ? accentColor : undefined,
              boxShadow:
                toast.type === "success"
                  ? "0 10px 30px rgba(36, 99, 230, 0.15)"
                  : undefined,
            }}
            role="status"
            aria-live="polite"
          >
            <span className="mt-1 block w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            <span className="flex-1">{toast.message}</span>
          </div>
        ))}
      </div>

      <DashboardHeader
        onNotificationsClick={handleNotificationsClick}
        onNewProjectClick={handleNewProjectClick}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-min">
        {/* 1. Hero Focus (Large) */}
        {loadingHero ? (
          <div className="lg:col-span-6 w-full h-full">
            <div className="h-[360px] lg:h-full rounded-2xl bg-subtle border border-border-subtle animate-pulse" />
          </div>
        ) : (
          <HeroProjectCard
            imageSrc={heroProject?.imageSrc || HERO_PROJECT_IMAGE}
            priorityLabel={heroProject?.priorityLabel}
            title={heroProject?.title || HERO_PROJECT_TITLE}
            description={heroProject?.description || HERO_PROJECT_DESCRIPTION}
            className="lg:col-span-6 w-full h-full"
          />
        )}

        {/* Right Column Grid */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 content-start">
          {/* 2. Spark AI (Ideation) */}
          <SparkAICard onSubmitPrompt={handleSubmitPrompt} className="sm:col-span-2 lg:col-span-1 min-h-[220px]" />

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
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
