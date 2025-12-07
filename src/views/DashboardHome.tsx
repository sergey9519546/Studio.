import React from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import HeroProjectCard from "../components/dashboard/HeroProjectCard";
import SparkAICard from "../components/dashboard/SparkAICard";
import VibePaletteCard from "../components/dashboard/VibePaletteCard";
import RecentArtifactsCard, { Artifact } from "../components/dashboard/RecentArtifactsCard";
import "./DashboardHome.css";

// Constants for better maintainability
const HERO_PROJECT_IMAGE =
  "https://images.unsplash.com/photo-1492551557933-34265f7af79e?q=80&w=2670&auto=format&fit=crop";
const HERO_PROJECT_TITLE = "Nebula Phase II";
const HERO_PROJECT_DESCRIPTION =
  "Comprehensive rebrand focusing on kinetic typography and zero-gravity aesthetics. Client review in 4 hours.";

const DashboardHome: React.FC = () => {
  const handleNotificationsClick = () => {
    console.log('Notifications clicked');
    // TODO: Open notifications panel
  };

  const handleNewProjectClick = () => {
    console.log('New project clicked');
    // TODO: Open new project modal
  };

  const handleSubmitPrompt = (prompt: string) => {
    console.log('AI prompt submitted:', prompt);
    // TODO: Process AI prompt
  };

  const handleColorSelect = (color: string) => {
    console.log('Color selected:', color);
    // TODO: Apply color to palette or design
  };

  const handleViewGallery = () => {
    console.log('View gallery clicked');
    // TODO: Navigate to gallery
  };

  const handleArtifactClick = (artifact: any) => {
    console.log('Artifact clicked:', artifact);
    // TODO: Open artifact details
  };

  return (
    <div className="animate-in fade-in duration-700 pb-32 pt-12 px-12 max-w-[1600px] mx-auto">
      <DashboardHeader
        onNotificationsClick={handleNotificationsClick}
        onNewProjectClick={handleNewProjectClick}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[640px]">
        {/* 1. Hero Focus (Large) */}
        <HeroProjectCard
          imageSrc={HERO_PROJECT_IMAGE}
          title={HERO_PROJECT_TITLE}
          description={HERO_PROJECT_DESCRIPTION}
        />

        {/* Right Column Grid */}
        <div className="col-span-1 md:col-span-12 lg:col-span-6 grid grid-cols-2 gap-6 h-full">
          {/* 2. Spark AI (Ideation) */}
          <SparkAICard onSubmitPrompt={handleSubmitPrompt} />

          {/* 3. Vibe / Palette */}
          <VibePaletteCard onColorSelect={handleColorSelect} />

          {/* 4. Artifacts (Visual History) */}
          <RecentArtifactsCard
            onViewGallery={handleViewGallery}
            onArtifactClick={handleArtifactClick}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
