import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    Command,
    FileText,
    FolderOpen,
    Home,
    Image,
    Keyboard,
    MessageSquare,
    Palette,
    Plus,
    Search,
    Settings,
    Users,
    Zap
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface Command {
  id: string;
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'navigation' | 'actions' | 'tools' | 'settings' | 'shortcuts';
  keywords: string[];
  action: () => void;
  shortcut?: string;
  route?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ 
  isOpen, 
  onClose, 
  className 
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Define available commands
  const commands = useMemo<Command[]>(() => [
    // Navigation
    {
      id: 'nav-home',
      title: 'Go to Dashboard',
      description: 'Navigate to the main dashboard',
      icon: Home,
      category: 'navigation',
      keywords: ['dashboard', 'home', 'main'],
      action: () => navigate('/dashboard'),
      route: '/dashboard',
      shortcut: 'g d'
    },
    {
      id: 'nav-projects',
      title: 'Go to Projects',
      description: 'View and manage projects',
      icon: FolderOpen,
      category: 'navigation',
      keywords: ['projects', 'portfolio', 'work'],
      action: () => navigate('/projects'),
      route: '/projects',
      shortcut: 'g p'
    },
    {
      id: 'nav-freelancers',
      title: 'Go to Talent Roster',
      description: 'Browse available freelancers',
      icon: Users,
      category: 'navigation',
      keywords: ['freelancers', 'talent', 'team', 'roster'],
      action: () => navigate('/freelancers'),
      route: '/freelancers',
      shortcut: 'g t'
    },
    {
      id: 'nav-messages',
      title: 'Go to Messages',
      description: 'Check your conversations',
      icon: MessageSquare,
      category: 'navigation',
      keywords: ['messages', 'chat', 'conversations'],
      action: () => navigate('/messages'),
      route: '/messages',
      shortcut: 'g m'
    },

    // Actions
    {
      id: 'action-new-project',
      title: 'Create New Project',
      description: 'Start a new creative project',
      icon: Plus,
      category: 'actions',
      keywords: ['new', 'create', 'project', 'add'],
      action: () => navigate('/projects/new'),
      shortcut: 'n p'
    },
    {
      id: 'action-new-freelancer',
      title: 'Add Freelancer',
      description: 'Add a new freelancer to the roster',
      icon: Plus,
      category: 'actions',
      keywords: ['add', 'freelancer', 'hire', 'new'],
      action: () => navigate('/freelancers/new'),
      shortcut: 'n f'
    },
    {
      id: 'action-new-script',
      title: 'Write New Script',
      description: 'Create a new script or document',
      icon: FileText,
      category: 'actions',
      keywords: ['script', 'write', 'document', 'new'],
      action: () => navigate('/writers-room'),
      shortcut: 'n s'
    },

    // Tools
    {
      id: 'tool-moodboard',
      title: 'Open Moodboard',
      description: 'Create and manage visual moodboards',
      icon: Palette,
      category: 'tools',
      keywords: ['moodboard', 'design', 'visual', 'inspiration'],
      action: () => navigate('/moodboard'),
      shortcut: 't m'
    },
    {
      id: 'tool-ai-chat',
      title: 'AI Creative Assistant',
      description: 'Chat with AI for creative insights',
      icon: Zap,
      category: 'tools',
      keywords: ['ai', 'chat', 'assistant', 'help'],
      action: () => navigate('/ai-chat'),
      shortcut: 't a'
    },
    {
      id: 'tool-asset-browser',
      title: 'Asset Browser',
      description: 'Browse and manage creative assets',
      icon: Image,
      category: 'tools',
      keywords: ['assets', 'images', 'files', 'media'],
      action: () => navigate('/assets'),
      shortcut: 't b'
    },

    // Settings
    {
      id: 'settings-profile',
      title: 'Profile Settings',
      description: 'Manage your profile and preferences',
      icon: Settings,
      category: 'settings',
      keywords: ['profile', 'settings', 'account', 'preferences'],
      action: () => navigate('/settings/profile'),
      shortcut: 's p'
    },
    {
      id: 'settings-team',
      title: 'Team Settings',
      description: 'Manage team members and permissions',
      icon: Users,
      category: 'settings',
      keywords: ['team', 'settings', 'members', 'permissions'],
      action: () => navigate('/settings/team'),
      shortcut: 's t'
    },

    // Shortcuts
    {
      id: 'shortcuts-help',
      title: 'Keyboard Shortcuts',
      description: 'View all available keyboard shortcuts',
      icon: Keyboard,
      category: 'shortcuts',
      keywords: ['shortcuts', 'keyboard', 'help', 'cheat sheet'],
      action: () => {
        // Could open a shortcuts modal
        console.log('Show shortcuts help');
      },
      shortcut: '?'
    }
  ], [navigate]);

  // Filter commands based on search query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;

    const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
    
    return commands
      .map(command => {
        const searchText = [
          command.title,
          command.description || '',
          ...command.keywords
        ].join(' ').toLowerCase();

        const matches = searchTerms.every(term => searchText.includes(term));
        
        return matches ? {
          ...command,
          matchScore: calculateMatchScore(searchTerms, searchText)
        } : null;
      })
      .filter(Boolean)
      .sort((a, b) => (b?.matchScore || 0) - (a?.matchScore || 0));
  }, [query, commands]);

  // Calculate relevance score for search results
  const calculateMatchScore = (searchTerms: string[], searchText: string): number => {
    let score = 0;
    
    searchTerms.forEach(term => {
      if (searchText.includes(term)) {
        // Exact title match gets highest score
        if (searchText.startsWith(term)) score += 10;
        // Word boundary match gets good score
        else if (searchText.includes(` ${term} `)) score += 5;
        // Substring match gets lower score
        else score += 2;
      }
    });
    
    return score;
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands.length]);

  const handleCommandClick = (command: Command) => {
    command.action();
    onClose();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation': return <FolderOpen className="w-4 h-4" />;
      case 'actions': return <Plus className="w-4 h-4" />;
      case 'tools': return <Zap className="w-4 h-4" />;
      case 'settings': return <Settings className="w-4 h-4" />;
      case 'shortcuts': return <Keyboard className="w-4 h-4" />;
      default: return <Command className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'navigation': return 'text-blue-400';
      case 'actions': return 'text-green-400';
      case 'tools': return 'text-purple-400';
      case 'settings': return 'text-orange-400';
      case 'shortcuts': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="flex items-start justify-center min-h-screen p-4 pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "w-full max-w-2xl",
              "bg-white/10 backdrop-blur-xl",
              "border border-white/20 rounded-2xl",
              "shadow-2xl shadow-black/20",
              "overflow-hidden",
              className
            )}
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center px-6 py-4 border-b border-white/10">
              <Search className="w-5 h-5 text-white/60 mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search commands..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-white/60 outline-none text-lg"
              />
              <div className="flex items-center space-x-2 text-white/60">
                <kbd className="px-2 py-1 text-xs bg-white/10 rounded border border-white/20">
                  ⌘
                </kbd>
                <kbd className="px-2 py-1 text-xs bg-white/10 rounded border border-white/20">
                  K
                </kbd>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <div className="px-6 py-8 text-center text-white/60">
                  <Command className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium mb-1">No commands found</p>
                  <p className="text-sm">
                    Try searching for "create", "go to", or "settings"
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  {filteredCommands.map((command, index) => (
                    <motion.button
                      key={command.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleCommandClick(command)}
                      className={cn(
                        "w-full px-6 py-3 text-left",
                        "flex items-center space-x-4",
                        "hover:bg-white/5 transition-colors duration-150",
                        index === selectedIndex && "bg-white/10"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-lg",
                        "bg-white/10 border border-white/20"
                      )}>
                        <command.icon className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-white font-medium truncate">
                            {command.title}
                          </h3>
                          {command.shortcut && (
                            <span className="text-xs text-white/50 font-mono">
                              {command.shortcut}
                            </span>
                          )}
                        </div>
                        {command.description && (
                          <p className="text-white/60 text-sm truncate mt-0.5">
                            {command.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className={cn("flex items-center", getCategoryColor(command.category))}>
                          {getCategoryIcon(command.category)}
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/40" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredCommands.length > 0 && (
              <div className="px-6 py-3 border-t border-white/10 bg-white/5">
                <div className="flex items-center justify-between text-xs text-white/60">
                  <div className="flex items-center space-x-4">
                    <span>Navigate</span>
                    <span>↑↓</span>
                    <span>•</span>
                    <span>Select</span>
                    <span>↵</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>Close</span>
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">esc</kbd>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommandPalette;
