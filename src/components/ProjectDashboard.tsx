import { Edit2, FileText, Image, Zap, Users, Activity, Bell, RefreshCw, Wifi, WifiOff, Save, Clock, User } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./design/Button";
import { Input } from "./design/Input";
import { LiquidGlassContainer } from "./design/LiquidGlassContainer";
import { Textarea } from "./design/Textarea";
import { useAutoSave } from "../hooks/useAutoSave";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { draftService } from "../services/DraftService";

interface ProjectDashboardProps {
  projectId: string;
  projectTitle?: string;
  brief?: string;
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
  onBriefChange,
  onNavigateToWritersRoom,
  onNavigateToMoodboard,
}) => {
  const [editingBrief, setEditingBrief] = useState(false);
  const [localBrief, setLocalBrief] = useState(brief);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      status: 'online',
      lastSeen: new Date(),
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      status: 'away',
      lastSeen: new Date(Date.now() - 5 * 60 * 1000),
    },
  ]);
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'user_joined',
      user: 'Sarah Chen',
      message: 'joined the project',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
    },
    {
      id: '2',
      type: 'brief_update',
      user: 'You',
      message: 'updated the creative brief',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
  ]);
  const activityFeedRef = useRef<HTMLDivElement>(null);

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
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
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
      <div className="max-w-7xl mx-auto p-8">
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
                    <Wifi size={16} className="text-green-500" />
                  ) : (
                    <WifiOff size={16} className="text-red-500" />
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isOnline 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              
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
                {/* Auto-save Status */}
                <span className={`px-3 py-1 rounded-full border text-xs ${
                  autoSave.status === 'saving' 
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : autoSave.status === 'saved'
                    ? 'bg-green-100 border-green-300 text-green-800'
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
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                      +{collaborators.length - 3}
                    </div>
                  )}
                </div>
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
                    <RefreshCw size={14} className="text-blue-500 animate-spin" />
                  )}
                  {autoSave.status === 'saved' && (
                    <Save size={14} className="text-green-500" />
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
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <div className="p-1.5 rounded-full bg-primary/10 text-primary flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink-primary">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        {activity.message}
                      </p>
                      <p className="text-xs text-ink-tertiary mt-0.5">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
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
                </li
