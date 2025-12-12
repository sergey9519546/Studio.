import { Edit2, FileText, Image, Zap } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./design/Button";
import { Input } from "./design/Input";
import { LiquidGlassContainer } from "./design/LiquidGlassContainer";
import { Textarea } from "./design/Textarea";

interface ProjectDashboardProps {
  projectId: string;
  projectTitle?: string;
  brief?: string;
  onBriefChange?: (brief: string) => void;
  onNavigateToWritersRoom?: () => void;
  onNavigateToMoodboard?: () => void;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  projectId: _projectId,
  projectTitle = "Untitled Project",
  brief = "",
  onBriefChange,
  onNavigateToWritersRoom,
  onNavigateToMoodboard,
}) => {
  const [editingBrief, setEditingBrief] = useState(false);
  const [localBrief, setLocalBrief] = useState(brief);

  const handleSaveBrief = () => {
    onBriefChange?.(localBrief);
    setEditingBrief(false);
  };

  return (
    <div className="w-full h-full bg-app">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary uppercase font-bold tracking-widest mb-2">
            <span>Dashboard</span>
            <span>/</span>
            <span>Projects</span>
            <span>/</span>
            <span className="text-ink-primary">{projectTitle}</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-ink-primary mb-1">
                {projectTitle}
              </h1>
              <div className="flex flex-wrap gap-2 text-sm text-ink-secondary">
                <span className="px-3 py-1 rounded-full bg-subtle border border-border-subtle font-semibold text-ink-primary">
                  Status: Active
                </span>
                <span className="px-3 py-1 rounded-full bg-subtle border border-border-subtle text-ink-primary">
                  Due: TBD
                </span>
                <span className="px-3 py-1 rounded-full bg-subtle border border-border-subtle text-ink-primary">
                  Owner: Creative
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={onNavigateToMoodboard}>
                View Moodboard
              </Button>
              <Button size="sm" variant="primary" onClick={onNavigateToWritersRoom}>
                Open Writer&apos;s Room
              </Button>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Brief + Vibe */}
          <div className="lg:col-span-1 space-y-6">
            {/* The Brief */}
            <LiquidGlassContainer level="lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-ink-primary">
                  Creative Brief
                </h2>
                {!editingBrief && (
                  <button
                    onClick={() => setEditingBrief(true)}
                    className="p-2 hover:bg-white/10 rounded-[16px] transition-colors text-ink-tertiary"
                    aria-label="Edit brief"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
              </div>

              {editingBrief ? (
                <div className="space-y-3">
                  <Textarea
                    value={localBrief}
                    onChange={(e) => setLocalBrief(e.target.value)}
                    placeholder="Enter your creative brief..."
                    rows={6}
                    variant="secondary"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleSaveBrief}
                    >
                      Save Brief
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setLocalBrief(brief);
                        setEditingBrief(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="prose-like text-sm text-ink-secondary leading-relaxed">
                  {localBrief || (
                    <p className="text-ink-tertiary italic">
                      No brief yet. Click edit to add one.
                    </p>
                  )}
                </div>
              )}
            </LiquidGlassContainer>

            {/* The Vibe */}
            <LiquidGlassContainer level="lg">
              <h2 className="text-lg font-bold text-ink-primary mb-4">
                Mood & Tone
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-ink-secondary uppercase tracking-wide block mb-2">
                    Mood Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Cinematic", "Minimalist", "Bold", "Elegant"].map(
                      (tag) => (
                        <button
                          key={tag}
                          className="px-3 py-1.5 rounded-[24px] bg-primary-tint text-primary text-xs font-medium hover:bg-primary hover:text-white transition-colors"
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink-secondary uppercase tracking-wide block mb-2">
                    Do's & Don'ts
                  </label>
                  <Textarea
                    placeholder="List visual and tonal guidelines..."
                    rows={3}
                    variant="secondary"
                  />
                </div>
              </div>
            </LiquidGlassContainer>

            <LiquidGlassContainer level="lg">
              <h2 className="text-lg font-bold text-ink-primary mb-3">
                Risks & Blockers
              </h2>
              <ul className="space-y-2 text-sm text-ink-secondary">
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 rounded-full bg-amber-500" />
                  Clarify deliverable scope and final runtime.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 rounded-full bg-amber-500" />
                  Secure reference assets for visual direction.
                </li>
              </ul>
            </LiquidGlassContainer>

            <LiquidGlassContainer level="lg">
              <h2 className="text-lg font-bold text-ink-primary mb-3">
                Next Actions
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-sm text-ink-secondary">
                <li>Draft shot list outline.</li>
                <li>Upload three mood references.</li>
                <li>Confirm deliverable specs with client.</li>
              </ol>
            </LiquidGlassContainer>
          </div>

          {/* MIDDLE COLUMN: Assets + Metadata */}
          <div className="lg:col-span-1 space-y-6">
            {/* Asset Library */}
            <LiquidGlassContainer level="lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-ink-primary">
                  Asset Library
                </h2>
                <button
                  type="button"
                  title="Add image"
                  className="p-2 hover:bg-white/10 rounded-[16px] transition-colors text-ink-tertiary"
                >
                  <Image size={16} />
                </button>
              </div>

              <div className="rounded-[24px] bg-subtle p-8 text-center border-2 border-dashed border-border-subtle">
                <Image size={32} className="mx-auto text-ink-tertiary mb-3" />
                <p className="text-sm text-ink-secondary">Drag images here</p>
                <p className="text-xs text-ink-tertiary">
                  AI vision analysis on upload
                </p>
              </div>
            </LiquidGlassContainer>

            {/* Metadata */}
            <LiquidGlassContainer level="lg">
              <h2 className="text-lg font-bold text-ink-primary mb-4">
                Deliverables
              </h2>

              <div className="space-y-3">
                <div>
                  <Input
                    label="Resolution"
                    placeholder="1920x1080"
                    variant="secondary"
                  />
                </div>
                <div>
                  <Input
                    label="Aspect Ratio"
                    placeholder="16:9"
                    variant="secondary"
                  />
                </div>
                <div>
                  <Input
                    label="Duration (sec)"
                    placeholder="30"
                    variant="secondary"
                  />
                </div>
              </div>
            </LiquidGlassContainer>
          </div>

          {/* RIGHT COLUMN: Script Window + Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <LiquidGlassContainer level="lg">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-ink-primary">
                  AI Quick Actions
                </h2>
                <Zap size={16} className="text-ink-tertiary" />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  leftIcon={<Zap size={16} />}
                  onClick={onNavigateToWritersRoom}
                >
                  Draft script outline
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  leftIcon={<Zap size={16} />}
                  onClick={onNavigateToWritersRoom}
                >
                  Generate shot list
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  leftIcon={<Zap size={16} />}
                  onClick={onNavigateToMoodboard}
                >
                  Suggest moodboard tags
                </Button>
              </div>
            </LiquidGlassContainer>

            {/* Script Window */}
            <LiquidGlassContainer level="lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-ink-primary">
                  Script & Shotlist
                </h2>
                <button
                  type="button"
                  title="Add script"
                  className="p-2 hover:bg-white/10 rounded-[16px] transition-colors text-ink-tertiary"
                >
                  <FileText size={16} />
                </button>
              </div>

              <div className="rounded-[24px] bg-subtle p-6 text-center border-2 border-dashed border-border-subtle">
                <FileText
                  size={32}
                  className="mx-auto text-ink-tertiary mb-3"
                />
                <p className="text-sm text-ink-secondary">
                  Upload or create scripts
                </p>
                <Button size="sm" variant="secondary" className="w-full mt-3">
                  Browse Files
                </Button>
              </div>
            </LiquidGlassContainer>

            {/* Writer's Room Button */}
            <Button
              className="w-full"
              onClick={onNavigateToWritersRoom}
              leftIcon={<Zap size={16} />}
            >
              Writer's Room
            </Button>

            {/* Moodboard Button */}
            <Button
              variant="secondary"
              className="w-full"
              onClick={onNavigateToMoodboard}
              leftIcon={<Image size={16} />}
            >
              Moodboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
