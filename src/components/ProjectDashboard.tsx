import React, { useState } from 'react';
import { Edit2, Image, FileText, Settings, Zap } from 'lucide-react';
import { Card } from './design/Card';
import { Button } from './design/Button';
import { Textarea } from './design/Textarea';
import { Input } from './design/Input';
import { LiquidGlassContainer } from './design/LiquidGlassContainer';

interface ProjectDashboardProps {
  projectId: string;
  projectTitle?: string;
  brief?: string;
  onBriefChange?: (brief: string) => void;
  onNavigateToWritersRoom?: () => void;
  onNavigateToMoodboard?: () => void;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  projectId,
  projectTitle = 'Untitled Project',
  brief = '',
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
          <h1 className="text-4xl font-bold text-ink-primary mb-2">{projectTitle}</h1>
          <p className="text-ink-secondary">Creative workspace and project intelligence</p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Brief + Vibe */}
          <div className="lg:col-span-1 space-y-6">
            {/* The Brief */}
            <LiquidGlassContainer level="lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-ink-primary">Creative Brief</h2>
                {!editingBrief && (
                  <button
                    onClick={() => setEditingBrief(true)}
                    className="p-2 hover:bg-white/10 rounded-[16px] transition-colors text-ink-tertiary"
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
                    <p className="text-ink-tertiary italic">No brief yet. Click edit to add one.</p>
                  )}
                </div>
              )}
            </LiquidGlassContainer>

            {/* The Vibe */}
            <LiquidGlassContainer level="lg">
              <h2 className="text-lg font-bold text-ink-primary mb-4">Mood & Tone</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-ink-secondary uppercase tracking-wide block mb-2">
                    Mood Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Cinematic', 'Minimalist', 'Bold', 'Elegant'].map(tag => (
                      <button
                        key={tag}
                        className="px-3 py-1.5 rounded-[24px] bg-primary-tint text-primary text-xs font-medium hover:bg-primary hover:text-white transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
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
          </div>

          {/* MIDDLE COLUMN: Assets + Metadata */}
          <div className="lg:col-span-1 space-y-6">
            {/* Asset Library */}
            <LiquidGlassContainer level="lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-ink-primary">Asset Library</h2>
                <button className="p-2 hover:bg-white/10 rounded-[16px] transition-colors text-ink-tertiary">
                  <Image size={16} />
                </button>
              </div>

              <div className="rounded-[24px] bg-subtle p-8 text-center border-2 border-dashed border-border-subtle">
                <Image size={32} className="mx-auto text-ink-tertiary mb-3" />
                <p className="text-sm text-ink-secondary">Drag images here</p>
                <p className="text-xs text-ink-tertiary">AI vision analysis on upload</p>
              </div>
            </LiquidGlassContainer>

            {/* Metadata */}
            <LiquidGlassContainer level="lg">
              <h2 className="text-lg font-bold text-ink-primary mb-4">Deliverables</h2>

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
            {/* Script Window */}
            <LiquidGlassContainer level="lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-ink-primary">Script & Shotlist</h2>
                <button className="p-2 hover:bg-white/10 rounded-[16px] transition-colors text-ink-tertiary">
                  <FileText size={16} />
                </button>
              </div>

              <div className="rounded-[24px] bg-subtle p-6 text-center border-2 border-dashed border-border-subtle">
                <FileText size={32} className="mx-auto text-ink-tertiary mb-3" />
                <p className="text-sm text-ink-secondary">Upload or create scripts</p>
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
