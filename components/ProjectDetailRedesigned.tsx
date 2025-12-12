import { 
  AlertTriangle, 
  ArrowRight, 
  Calendar, 
  ChevronDown, 
  Clock, 
  Database, 
  FileText, 
  Grid, 
  ImageIcon, 
  LayoutDashboard, 
  MessageSquare, 
  Plus, 
  Save, 
  ScrollText, 
  Settings, 
  Sparkles, 
  Target, 
  Upload, 
  User, 
  Users, 
  Zap,
  Search,
  Filter,
  Download,
  Share2,
  Bookmark,
  Star,
  TrendingUp,
  Activity,
  Brain,
  Lightbulb,
  Palette,
  Eye,
  Edit3,
  Copy,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader,
  Minimize2,
  Maximize2
} from 'lucide-react';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ActivityLog, Assignment, Freelancer, KnowledgeSource, Project, ProjectContextItem, Script } from '../types';
import ContextHub from './ContextHub';
import MoodboardTab from './Moodboard/MoodboardTab';
import ReferenceGallery from './ReferenceGallery';
import ToneMoodBoard from './ToneMoodBoard';
import AIChat from './AIChat';
import GuardianRoom from '../src/views/GuardianRoom';
import { api } from '../services/api';

interface ProjectDetailRedesignedProps {
  freelancers: Freelancer[];
  projects: Project[];
  assignments: Assignment[];
  logs?: ActivityLog[];
  onAssign: (assignment: Assignment) => void;
  checkConflict?: (freelancerId: string, start: string, end: string, ignoreAssignmentId?: string) => Assignment | undefined;
  onUpdateProject: (project: Project) => void;
  onDelete?: (id: string) => Promise<void>;
  onLog?: (action: string, details: string) => void;
}

interface Message {
  role: "user" | "system";
  text: string;
  timestamp?: Date;
  id?: string;
}

interface ProjectInsight {
  type: 'trend' | 'suggestion' | 'warning' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  action?: string;
}

const DateBadge = ({ dueDate }: { dueDate?: string }) => {
  if (!dueDate) return <span className="text-pencil text-xs font-medium tracking-wide">No Date</span>;

  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let bgClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
  let icon = <Clock size={12} />;
  let text = `${diffDays} days left`;

  if (diffDays < 0) {
    bgClass = "bg-rose-50 text-rose-700 border-rose-100";
    icon = <AlertTriangle size={12} />;
    text = `Overdue (${Math.abs(diffDays)}d)`;
  } else if (diffDays < 3) {
    bgClass = "bg-amber-50 text-amber-700 border-amber-100";
    text = `Due in ${diffDays} days`;
  }

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${bgClass}`}>
      {icon} {text}
    </div>
  );
};

const LoadingSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };
  
  return (
    <Loader className={`animate-spin text-primary ${sizeClasses[size]}`} />
  );
};

const ProjectInsights = ({ project, onInsightClick }: { 
  project: Project; 
  onInsightClick: (insight: ProjectInsight) => void; 
}) => {
  const [insights, setInsights] = useState<ProjectInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setIsLoading(true);
      // Simulate AI-generated insights
      setTimeout(() => {
        const mockInsights: ProjectInsight[] = [
          {
            type: 'opportunity',
            title: 'Creative Momentum Detected',
            description: 'Your recent moodboard additions show strong visual coherence. Consider expanding this aesthetic direction.',
            confidence: 0.89,
            action: 'Explore Direction'
          },
          {
            type: 'suggestion', 
            title: 'Timeline Optimization',
            description: 'Based on project scope, consider allocating more time to the creative development phase.',
            confidence: 0.76,
            action: 'Adjust Timeline'
          },
          {
            type: 'trend',
            title: 'Client Preferences Aligning',
            description: 'Your creative direction matches 85% of client\'s previous project preferences.',
            confidence: 0.92,
            action: 'View Analysis'
          }
        ];
        setInsights(mockInsights);
        setIsLoading(false);
      }, 1000);
    }
  }, [project]);

  const getInsightIcon = (type: ProjectInsight['type']) => {
    switch (type) {
      case 'trend': return <TrendingUp size={16} className="text-blue-600" />;
      case 'suggestion': return <Lightbulb size={16} className="text-yellow-600" />;
      case 'warning': return <AlertTriangle size={16} className="text-orange-600" />;
      case 'opportunity': return <Star size={16} className="text-green-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-mist p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Brain size={16} className="text-purple-600" />
          <h3 className="text-sm font-bold text-ink">AI Project Insights</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-mist p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-purple-600" />
          <h3 className="text-sm font-bold text-ink">AI Project Insights</h3>
        </div>
        <button className="text-xs text-purple-600 hover:text-purple-800 font-medium">
          Refresh
        </button>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            onClick={() => onInsightClick(insight)}
            className="p-4 border border-mist rounded-xl hover:border-purple-200 hover:bg-purple-50/30 cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xs font-bold text-ink group-hover:text-purple-700">
                    {insight.title}
                  </h4>
                  <div className="text-[10px] text-muted bg-mist px-2 py-0.5 rounded-full">
                    {Math.round(insight.confidence * 100)}%
                  </div>
                </div>
                <p className="text-xs text-muted leading-relaxed mb-2">
                  {insight.description}
                </p>
                {insight.action && (
                  <button className="text-[10px] text-purple-600 hover:text-purple-800 font-medium">
                    {insight.action} →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuickActions = ({ onAction, isLoading }: { 
  onAction: (action: string) => void; 
  isLoading: boolean; 
}) => {
  const actions = [
    { id: 'analyze-brief', icon: FileText, label: 'Analyze Brief', color: 'text-blue-600' },
    { id: 'moodboard-help', icon: Palette, label: 'Moodboard Help', color: 'text-indigo-600' },
    { id: 'script-review', icon: Edit3, label: 'Script Review', color: 'text-purple-600' },
    { id: 'timeline-check', icon: Clock, label: 'Timeline Check', color: 'text-orange-600' },
    { id: 'team-collab', icon: Users, label: 'Team Collab', color: 'text-green-600' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-mist p-4 shadow-sm">
      <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
        <Zap size={16} className="text-yellow-600" />
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            disabled={isLoading}
            className="flex flex-col items-center gap-2 p-3 border border-mist rounded-lg hover:border-current hover:bg-subtle/30 transition-all duration-200 disabled:opacity-50 group"
          >
            <action.icon size={16} className={`${action.color} group-hover:scale-110 transition-transform`} />
            <span className="text-[10px] font-medium text-ink text-center leading-tight">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const ProjectDetailRedesigned: React.FC<ProjectDetailRedesignedProps> = ({ 
  projects, 
  freelancers, 
  assignments, 
  onUpdateProject 
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);
  
  // Enhanced state management
  const [activePanel, setActivePanel] = useState<'brief' | 'moodboard' | 'writers-room' | 'references' | 'intelligence' | 'insights'>('brief');
  const [aiMessages, setAiMessages] = useState<Message[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInsight, setSelectedInsight] = useState<ProjectInsight | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Project data states
  const [scripts, setScripts] = useState<Script[]>([]);
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiInputRef = useRef<HTMLInputElement>(null);

  const projectId = project?.id;

  useEffect(() => {
    if (projectId) {
      api.scripts.findByProject(projectId).then(res => setScripts(res.data || [])).catch(console.error);
    }
  }, [projectId]);

  useEffect(() => {
    // Enhanced AI initialization with project context
    if (project) {
      const welcomeMessage: Message = {
        role: "system",
        text: `I'm your AI creative director for "${project.name}". I've analyzed your brief and I'm ready to help with creative direction, mood development, and script enhancement. What would you like to work on first?`,
        timestamp: new Date(),
        id: 'welcome'
      };
      setAiMessages([welcomeMessage]);
      
      // Auto-focus AI input
      setTimeout(() => {
        aiInputRef.current?.focus();
      }, 500);
    }
  }, [project]);

  // Auto-scroll AI messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  const handleAddSource = async (newSource: KnowledgeSource) => {
    if (!project) return;

    setSources(prev => [...prev, newSource]);

    let category: ProjectContextItem['category'] = 'General';
    if (newSource.type === 'file') category = 'Technical';
    else if (newSource.type === 'wiki' || newSource.type === 'youtube') category = 'Research';
    else if (newSource.type === 'text') category = 'Brand';

    const newItem: ProjectContextItem = {
      id: newSource.id,
      title: newSource.title,
      content: newSource.originalContent || newSource.summary || '',
      category,
      updatedAt: new Date().toISOString()
    };

    const updatedKB = [...(project.knowledgeBase || []), newItem];
    onUpdateProject({ ...project, knowledgeBase: updatedKB });
    setLastActivity(new Date());
  };

  const handleRemoveSource = async (id: string) => {
    if (!project) return;
    setSources(prev => prev.filter(s => s.id !== id));
    const updatedKB = (project.knowledgeBase || []).filter(kb => kb.id !== id);
    onUpdateProject({ ...project, knowledgeBase: updatedKB });
    setLastActivity(new Date());
  };

  const handleProjectUpdate = (updates: Partial<Project>) => {
    if (!project) return;
    onUpdateProject({ ...project, ...updates });
    setLastActivity(new Date());
  };

  const handleAiMessage = async (message: string) => {
    if (!message.trim() || isAiLoading) return;
    
    const userMessage: Message = { 
      role: "user", 
      text: message, 
      timestamp: new Date(),
      id: `user-${Date.now()}`
    };
    setAiMessages(prev => [...prev, userMessage]);
    setAiInput("");
    setIsAiLoading(true);

    try {
      // Enhanced AI response with project context
      setTimeout(() => {
        const responses = [
          `Based on your "${project?.name}" brief, I suggest we focus on the client's core values: ${project?.description?.slice(0, 50)}... This aligns well with current market trends.`,
          `For the visual direction of ${project?.name}, I recommend exploring ${project?.clientName}'s brand heritage while incorporating modern aesthetic elements.`,
          `Your moodboard references suggest a sophisticated approach. I can help you develop this into a compelling visual narrative.`,
          `I've analyzed your project intelligence and found some interesting patterns. The creative direction you're taking has 89% similarity to successful campaigns in this category.`,
          `Considering your timeline constraints for ${project?.name}, I suggest prioritizing the concept development phase to ensure quality execution.`
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const aiMessage: Message = {
          role: "system",
          text: randomResponse,
          timestamp: new Date(),
          id: `ai-${Date.now()}`
        };
        setAiMessages(prev => [...prev, aiMessage]);
        setIsAiLoading(false);
        setLastActivity(new Date());
      }, 1500);
    } catch (error) {
      setAiMessages(prev => [...prev, { 
        role: "system", 
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        id: `error-${Date.now()}`
      }]);
      setIsAiLoading(false);
    }
  };

  const handleInsightClick = (insight: ProjectInsight) => {
    setSelectedInsight(insight);
    const message = `Tell me more about ${insight.title.toLowerCase()}`;
    handleAiMessage(message);
  };

  const handleQuickAction = useCallback((action: string) => {
    const quickActions = {
      'analyze-brief': `Analyze the creative brief for "${project?.name}" and provide suggestions`,
      'moodboard-help': `Help me develop the visual moodboard for ${project?.name}`,
      'script-review': `Review the current script and provide feedback for ${project?.name}`,
      'timeline-check': `Review the project timeline and suggest optimizations`,
      'team-collab': `How can I better collaborate with my team on ${project?.name}?`
    };
    
    const message = quickActions[action as keyof typeof quickActions];
    if (message) {
      handleAiMessage(message);
    }
  }, [project]);

  if (!project) return (
    <div className="p-12 text-center text-pencil text-sm font-medium">
      <div className="max-w-md mx-auto">
        <AlertTriangle size={48} className="mx-auto mb-4 text-muted" />
        <h3 className="text-lg font-bold text-ink mb
