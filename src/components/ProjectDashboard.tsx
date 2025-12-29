import { Activity, Edit2, FileText, Image, RefreshCw, Save, User, Users, Wifi, WifiOff } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAutoSave } from "../hooks/useAutoSave";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { getProjectStatusMeta } from "../utils/status";
import { Button } from "./design/Button";
import { LiquidGlassContainer } from "./design/LiquidGlassContainer";
import { Textarea } from "./design/Textarea";

interface ProjectDashboardProps {
  projectId: string;
  projectTitle?: string;
  brief?: string;
  status?: string;
  client?: string;
  startDate?: string;
  endDate?: string;
  tone?: string[];
  assets?: Array<{ id: string; url: string; caption?: string }>;
  onBriefChange?: (brief: string) => void;
  onNavigateToWritersRoom?: () => void;
  onNavigateToMoodboard?: () => void;
}

interface ActivityItem {
  id: string;
  type: 'brief_update' | 'asset_upload' | 'script_generated' | 'user_joined' | 'collaboration';
  user: string;
  message: string;
  timestamp: Date;
  avatar?: string;
}

interface Collaborator {
  id: string;
  name: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: Date;
  avatar?: string;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  projectId,
  projectTitle = "Untitled Project",
  brief = "",
  status,
  client,
  startDate,
  endDate,
  tone = [],
  assets = [],
  onBriefChange,
  onNavigateToWritersRoom,
  onNavigateToMoodboard,
}) => {
  const [editingBrief, setEditingBrief] = useState(false);
  const [localBrief, setLocalBrief] = useState(brief);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [collaborators] = useState<Collaborator[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const activityFeedRef = useRef<HTMLDivElement>(null);
  const statusMeta = getProjectStatusMeta(status);
  const formattedStartDate = (() => {
    if (!startDate) return "No kickoff date";
    const date = new Date(startDate);
    return Number.isNaN(date.getTime()) ? "No kickoff date" : date.toLocaleDateString();
  })();
  const formattedDueDate = (() => {
    if (!endDate) return "No deadline";
    const date = new Date(endDate);
    return Number.isNaN(date.getTime()) ? "No deadline" : date.toLocaleDateString();
  })();

  useEffect(() => {
    setLocalBrief(brief);
  }, [brief]);

  // Auto-save functionality
  const autoSave = useAutoSave(
    `project-dashboard-${projectId}`,
    'document',
    {
      brief: localBrief,
      timestamp: new Date(),
    },
    {
      enabled: true,
      interval: 30000, // 30 seconds
      debounceMs: 2000,
      enableVersioning: true,
      maxVersions: 10,
      onSave: (draft) => {
        setLastSaved(new Date());
        console.log('Project dashboard saved:', draft.id);
      },
      onError: (error) => {
        console.error('Auto-save error:', error);
      }
    }
  );

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 's',
      modifiers: ['meta'],
      handler: (e: KeyboardEvent) => {
        e.preventDefault();
        handleSaveBrief();
      },
      description: 'Save brief',
    },
    {
      key: 'e',
      modifiers: ['meta'],
      handler: (e: KeyboardEvent) => {
        e.preventDefault();
        if (!editingBrief) {
          setEditingBrief(true);
        }
      },
      description: 'Edit brief',
    },
    {
      key: 'Escape',
      modifiers: [],
      handler: (e: KeyboardEvent) => {
        if (editingBrief) {
          setEditingBrief(false);
          setLocalBrief(brief);
        }
      },
      description: 'Cancel editing',
    },
  ], { enableOnInputs: true });

  // Connection status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-scroll activity feed to bottom
  useEffect(() => {
    if (activityFeedRef.current) {
      activityFeedRef.current.scrollTop = activityFeedRef.current.scrollHeight;
    }
  }, [activities]);

  // Add new activity
  const addActivity = useCallback((activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: `activity_${Date.now()}`,
      timestamp: new Date(),
    };
    setActivities(prev => [...prev, newActivity]);
  }, []);

  const handleSaveBrief = () => {
    onBriefChange?.(localBrief);
    setEditingBrief(false);
    addActivity({
      type: 'brief_update',
      user: 'You',
      message: 'updated the creative brief',
    });
    autoSave.save();
  };

  const handleBriefChange = (value: string) => {
    setLocalBrief(value);
    autoSave.update({
      brief: value,
      timestamp: new Date(),
    });
  };

  const getStatusColor = (status: Collaborator['status']) => {
    switch (status) {
      case 'online': return 'bg-state-success';
      case 'away': return 'bg-state-warning';
      case 'offline': return 'bg-ink-tertiary';
      default: return 'bg-ink-tertiary';
    }
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'brief_update': return <Edit2 size={14} />;
      case 'asset_upload': return <Image size={14} />;
      case 'script_generated': return <FileText size={14} />;
      case 'user_joined': return <User size={14} />;
      case 'collaboration': return <Users size={14} />;
      default: return <Activity size={14} />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="w-full h-full bg-app">
      <div className="page-shell">
        {/* Enhanced Header with Real-time Status */}
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
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-4xl font-bold text-ink-primary">
                  {projectTitle}
                </h1>
                {/* Connection Status */}
                <div className="flex items-center gap-2">
                  {isOnline ? (
                    <Wifi size={16} className="text-state-success" />
                  ) : (
                    <WifiOff size={16} className="text-state-danger" />
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isOnline 
                      ? 'bg-state-success-bg text-state-success' 
                      : 'bg-state-danger-bg text-state-danger'
                  }`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 text-sm text-ink-secondary">
                <span className={`px-3 py-1 rounded-full border font-semibold text-xs ${statusMeta.className}`}>
                  Status: {statusMeta.label}
                </span>
                <span className="px-3 py-1 rounded-full bg-subtle border border-border-subtle text-ink-primary text-xs">
                  Due: {formattedDueDate}
                </span>
                {client && (
                  <span className="px-3 py-1 rounded-full bg-subtle border border-border-subtle text-ink-primary text-xs">
                    Client: {client}
                  </span>
                )}
                {/* Auto-save Status */}
                <span className={`px-3 py-1 rounded-full border text-xs ${
                  autoSave.status === 'saving' 
                    ? 'bg-primary-tint border-primary/30 text-primary'
                    : autoSave.status === 'saved'
                    ? 'bg-state-success-bg border-state-success/30 text-state-success'
                    : 'bg-subtle border-border-subtle text-ink-primary'
                }`}>
                  {autoSave.status === 'saving' && <RefreshCw size={12} className="inline mr-1 animate-spin" />}
                  {autoSave.status === 'saved' && <Save size={12} className="inline mr-1" />}
                  {lastSaved ? `Saved ${formatTimeAgo(lastSaved)}` : 'Draft'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Collaborators */}
              <div className="flex items-center gap-2">
                <Users size={16} className="text-ink-tertiary" />
                {collaborators.length > 0 ? (
                  <div className="flex -space-x-2">
                    {collaborators.slice(0, 3).map((collaborator) => (
                      <div
                        key={collaborator.id}
                        className="relative w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                        title={`${collaborator.name} (${collaborator.status})`}
                      >
                        {collaborator.name.split(' ').map(n => n[0]).join('')}
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(collaborator.status)}`} />
                      </div>
                    ))}
                    {collaborators.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-ink-tertiary flex items-center justify-center text-ink-inverse text-xs font-medium border-2 border-white">
                        +{collaborators.length - 3}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-ink-tertiary">No collaborators yet</span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={onNavigateToMoodboard}>
                  View Moodboard
                </Button>
                <Button size="sm" variant="primary" onClick={onNavigateToWritersRoom}>
                  Open Writer's Room
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout with Real-time Features */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT COLUMN: Brief + Vibe */}
          <div className="lg:col-span-1 space-y-6">
            {/* The Brief with Auto-save */}
            <LiquidGlassContainer level="lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-ink-primary">
                  Creative Brief
                </h2>
                  <div className="flex items-center gap-2">
                  {/* Auto-save indicator */}
                  {autoSave.status === 'saving' && (
                    <RefreshCw size={14} className="text-primary animate-spin" />
                  )}
                  {autoSave.status === 'saved' && (
                    <Save size={14} className="text-state-success" />
                  )}
                  {!editingBrief && (
                    <button
                      onClick={() => setEditingBrief(true)}
                      className="p-2 hover:bg-white/10 rounded-[16px] transition-colors text-ink-tertiary"
                      aria-label="Edit brief"
                      title="Edit brief (⌘E)"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {editingBrief ? (
                <div className="space-y-3">
                  <Textarea
                    value={localBrief}
                    onChange={(e) => handleBriefChange(e.target.value)}
                    placeholder="Enter your creative brief..."
                    rows={6}
                    variant="secondary"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleSaveBrief}
                      leftIcon={<Save size={14} />}
                    >
                      Save Brief (⌘S)
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setLocalBrief(brief);
                        setEditingBrief(false);
                      }}
                    >
                      Cancel (Esc)
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

            {/* Real-time Activity Feed */}
            <LiquidGlassContainer level="lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                  <Activity size={16} />
                  Activity Feed
                </h2>
                <button
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Refresh activities"
                >
                  <RefreshCw size={14} className="text-ink-tertiary" />
                </button>
              </div>
              
              <div 
                ref={activityFeedRef}
                className="space-y-3 max-h-64 overflow-y-auto"
              >
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <div className="p-1.5 rounded-full bg-primary/10 text-primary flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-ink-primary">
                          <span className="font-medium">{activity.user}</span>{" "}
                          {activity.message}
                        </p>
                        <p className="text-xs text-ink-tertiary mt-0.5">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-border-subtle bg-subtle p-4 text-xs text-ink-tertiary">
                    No activity yet. Save a brief or add assets to begin tracking updates.
                  </div>
                )}
              </div>
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
                    {tone.length > 0 ? (
                      tone.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 rounded-[24px] bg-primary-tint text-primary text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-ink-tertiary">
                        No tone tags yet.
                      </span>
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
              <p className="text-sm text-ink-tertiary">
                No blockers logged yet. Capture risks in the brief or add them here as they emerge.
              </p>
            </LiquidGlassContainer>
          </div>

          {/* RIGHT COLUMNS: Assets & Timeline */}
          <div className="lg:col-span-3 space-y-6">
            {/* Assets Grid */}
            <LiquidGlassContainer level="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-ink-primary">
                  Project Assets
                </h2>
                <Button size="sm" variant="secondary" onClick={onNavigateToMoodboard}>
                  Upload Asset
                </Button>
              </div>

              {assets.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="aspect-square bg-subtle border border-border-subtle rounded-lg overflow-hidden"
                    >
                      <img
                        src={asset.url}
                        alt={asset.caption || "Project asset"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border-subtle bg-subtle p-6 text-sm text-ink-tertiary">
                  No assets uploaded yet. Add visuals from the moodboard to populate this space.
                </div>
              )}
            </LiquidGlassContainer>

            {/* Timeline/Progress */}
            <LiquidGlassContainer level="lg">
              <h2 className="text-lg font-bold text-ink-primary mb-6">
                Project Timeline
              </h2>

              {startDate || endDate ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-ink-primary">
                          Kickoff
                        </span>
                        <span className="text-sm text-ink-tertiary">{formattedStartDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-state-warning" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-ink-primary">
                          Delivery
                        </span>
                        <span className="text-sm text-ink-tertiary">{formattedDueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-border-subtle bg-subtle p-6 text-sm text-ink-tertiary">
                  No timeline set yet. Add a kickoff and delivery date to track milestones.
                </div>
              )}
            </LiquidGlassContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
