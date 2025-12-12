import React, { useState, useRef, useCallback } from 'react';
import { Send, Loader2, Copy, Download, Book, Undo2, Redo2, Save, History, Command, Sparkles } from 'lucide-react';
import { Button } from './design/Button';
import { Textarea } from './design/Textarea';
import { LiquidGlassContainer } from './design/LiquidGlassContainer';
import { useAutoSave } from '../hooks/useAutoSave';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { CommandPalette } from './ui/CommandPalette';
import { DraftService } from '../services/DraftService';
import { UndoRedoService } from '../services/UndoRedoService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  context?: string[];
  timestamp?: Date;
}

interface GenerationContext {
  projectTitle?: string;
  brief?: string;
  guidelines?: string;
  assetMetadata: unknown[]; 
  projectIntelligence: unknown[]; 
}

interface WritersRoomProps {
  projectId: string;
  projectTitle?: string;
  brief?: string;
  guidelines?: string;
  onGenerateContent?: (prompt: string, context: GenerationContext) => Promise<string>;
}

export const WritersRoom: React.FC<WritersRoomProps> = ({
  projectId,
  projectTitle = 'Untitled Project',
  brief = '',
  guidelines = '',
  onGenerateContent,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showContext] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [historyPanel, setHistoryPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save functionality
  const { 
    autoSaveState, 
    saveCurrentDraft, 
    loadDraft, 
    getDraftHistory,
    clearDrafts 
  } = useAutoSave({
    draftId: `writers-room-${projectId}`,
    autoSaveInterval: 30000, // 30 seconds
    enableVersioning: true,
    maxVersions: 50,
  });

  // Undo/Redo service
  const undoRedoService = useRef(new UndoRedoService()).current;

  // Scroll to bottom when new messages are added
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle draft auto-save
  React.useEffect(() => {
    const draftContent = JSON.stringify({
      messages,
      inputValue,
      timestamp: new Date(),
    });

    DraftService.getInstance().saveDraft(`writers-room-${projectId}`, {
      content: draftContent,
      metadata: {
        projectTitle,
        messageCount: messages.length,
      },
    });
  }, [messages, inputValue, projectId, projectTitle]);

  // Load draft on mount
  React.useEffect(() => {
    const savedDraft = DraftService.getInstance().loadDraft(`writers-room-${projectId}`);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft.content);
        if (parsed.messages) setMessages(parsed.messages);
        if (parsed.inputValue) setInputValue(parsed.inputValue);
      } catch (error) {
        console.warn('Failed to parse saved draft:', error);
      }
    }
  }, [projectId]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      modifiers: ['meta'],
      handler: (e) => {
        e.preventDefault();
        setShowCommandPalette(true);
      },
      description: 'Open command palette',
    },
    {
      key: 's',
      modifiers: ['meta'],
      handler: (e) => {
        e.preventDefault();
        saveCurrentDraft();
      },
      description: 'Save current draft',
    },
    {
      key: 'z',
      modifiers: ['meta'],
      handler: (e) => {
        e.preventDefault();
        if (e.shiftKey) {
          // Redo
          const redoState = undoRedoService.redo();
          if (redoState) {
            setMessages(redoState.messages || []);
            setInputValue(redoState.inputValue || '');
          }
        } else {
          // Undo
          const currentState = { messages, inputValue };
          const undoState = undoRedoService.undo(currentState);
          if (undoState) {
            setMessages(undoState.messages || []);
            setInputValue(undoState.inputValue || '');
          }
        }
      },
      description: 'Undo (Shift+Meta+Z for redo)',
    },
    {
      key: 'Enter',
      modifiers: [],
      handler: (e) => {
        if (!e.shiftKey && !isGenerating && inputValue.trim()) {
          e.preventDefault();
          handleSendMessage();
        }
      },
      description: 'Send message',
    },
    {
      key: 'Escape',
      modifiers: [],
      handler: (e) => {
        if (showCommandPalette) {
          setShowCommandPalette(false);
        }
        if (historyPanel) {
          setHistoryPanel(false);
        }
      },
      description: 'Close panels',
    },
  ], { enableOnInputs: true });

  // Command palette commands
  const commands = [
    {
      id: 'save-draft',
      label: 'Save Current Draft',
      icon: Save,
      action: () => saveCurrentDraft(),
      shortcut: '⌘S',
    },
    {
      id: 'undo',
      label: 'Undo',
      icon: Undo2,
      action: () => {
        const currentState = { messages, inputValue };
        const undoState = undoRedoService.undo(currentState);
        if (undoState) {
          setMessages(undoState.messages || []);
          setInputValue(undoState.inputValue || '');
        }
      },
      shortcut: '⌘Z',
    },
    {
      id: 'redo',
      label: 'Redo',
      icon: Redo2,
      action: () => {
        const redoState = undoRedoService.redo();
        if (redoState) {
          setMessages(redoState.messages || []);
          setInputValue(redoState.inputValue || '');
        }
      },
      shortcut: '⇧⌘Z',
    },
    {
      id: 'show-history',
      label: 'Show Draft History',
      icon: History,
      action: () => setHistoryPanel(true),
      shortcut: '⌘H',
    },
    {
      id: 'clear-drafts',
      label: 'Clear All Drafts',
      icon: Sparkles,
      action: () => clearDrafts(),
    },
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    
    // Save current state for undo/redo
    const currentState = { messages, inputValue };
    undoRedoService.saveState(currentState);

    setInputValue('');
    
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date(),
    }]);

    setIsGenerating(true);
    try {
      const context = {
        projectTitle,
        brief,
        guidelines,
        assetMetadata: [],
        projectIntelligence: [],
      };

      const response = await onGenerateContent?.(userMessage, context) || 
        `Generated response for: ${userMessage}`;

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        context: [brief, guidelines].filter(Boolean),
        timestamp: new Date(),
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleDownloadMessage = (content: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `${projectTitle}-script.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getAutoSaveStatus = () => {
    switch (autoSaveState.status) {
      case 'saving':
        return { text: 'Saving...', icon: Loader2, className: 'text-blue-500' };
      case 'saved':
        return { text: 'Saved', icon: Save, className: 'text-green-500' };
      case 'error':
        return { text: 'Save failed', icon: Save, className: 'text-red-500' };
      default:
        return { text: 'Draft', icon: Save, className: 'text-ink-tertiary' };
    }
  };

  const autoSaveStatus = getAutoSaveStatus();
  const StatusIcon = autoSaveStatus.icon;

  return (
    <div className="w-full h-full bg-app">
      <div className="max-w-7xl mx-auto p-8">
        {/* Enhanced Header with Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-ink-primary">Writer's Room</h1>
            <div className="flex items-center gap-4">
              {/* Auto-save Status */}
              <div className={`flex items-center gap-2 text-sm ${autoSaveStatus.className}`}>
                <StatusIcon size={16} className={autoSaveState.status === 'saving' ? 'animate-spin' : ''} />
                <span>{autoSaveStatus.text}</span>
                {autoSaveState.lastSaved && (
                  <span className="text-xs text-ink-tertiary">
                    {new Date(autoSaveState.lastSaved).toLocaleTimeString()}
                  </span>
                )}
              </div>
              
              {/* History Panel Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHistoryPanel(!historyPanel)}
                className={historyPanel ? 'bg-primary text-white' : ''}
              >
                <History size={16} />
              </Button>
            </div>
          </div>
          <p className="text-ink-secondary">
            AI-powered content generation with full project context
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar: Context */}
          {showContext && (
            <div className="lg:col-span-1">
              <LiquidGlassContainer level="lg" className="sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-ink-primary">Context</h2>
                  <Book size={16} className="text-ink-tertiary" />
                </div>

                <div className="space-y-4">
                  {brief && (
                    <div>
                      <h3 className="text-xs font-bold text-ink-secondary uppercase tracking-wide mb-2">
                        Brief
                      </h3>
                      <p className="text-xs text-ink-secondary leading-relaxed line-clamp-4">
                        {brief}
                      </p>
                    </div>
                  )}

                  {guidelines && (
                    <div className="pt-4 border-t border-border-subtle">
                      <h3 className="text-xs font-bold text-ink-secondary uppercase tracking-wide mb-2">
                        Guidelines
                      </h3>
                      <p className="text-xs text-ink-secondary leading-relaxed line-clamp-3">
                        {guidelines}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border-subtle">
                    <h3 className="text-xs font-bold text-ink-secondary uppercase tracking-wide mb-2">
                      Available Tools
                    </h3>
                    <ul className="text-xs text-ink-tertiary space-y-1">
                      <li>• Script Generation</li>
                      <li>• Copywriting</li>
                      <li>• Shotlist Creation</li>
                      <li>• Storyboards</li>
                    </ul>
                  </div>
                </div>
              </LiquidGlassContainer>
            </div>
          )}

          {/* Main: Chat Interface */}
          <div className={`${showContext ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            <div className="flex flex-col h-[600px] bg-white rounded-[24px] shadow-ambient overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <Book size={48} className="mx-auto text-ink-tertiary mb-4" />
                      <p className="text-ink-secondary mb-2">
                        Welcome to the Writer's Room
                      </p>
                      <p className="text-xs text-ink-tertiary max-w-sm">
                        Ask me to generate scripts, copy, shotlists, and more. All suggestions are grounded in your project context.
                      </p>
                      <div className="mt-4 flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowCommandPalette(true)}
                        >
                          <Command size={14} className="mr-2" />
                          Commands (⌘K)
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md rounded-[24px] px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-subtle text-ink-primary'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                        {msg.timestamp && (
                          <p className="text-xs opacity-70 mt-1">
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        )}
                        {msg.role === 'assistant' && (
                          <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                            <button
                              onClick={() => handleCopyMessage(msg.content)}
                              className="p-1 hover:bg-white/10 rounded transition-colors"
                              title="Copy"
                            >
                              <Copy size={14} />
                            </button>
                            <button
                              onClick={() => handleDownloadMessage(msg.content)}
                              className="p-1 hover:bg-white/10 rounded transition-colors"
                              title="Download"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-subtle rounded-[24px] px-4 py-3">
                      <Loader2 size={16} className="animate-spin text-primary" />
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Input with Keyboard Shortcuts */}
              <div className="border-t border-subtle p-4">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask me to create a 30-second script, copywriting, etc..."
                      rows={1}
                      variant="secondary"
                      className="resize-none pr-20"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    {/* Keyboard shortcuts hint */}
                    <div className="absolute right-2 top-2 flex gap-1">
                      <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 rounded">⌘K</kbd>
                      <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 rounded">⌘S</kbd>
                    </div>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isGenerating}
                    className="self-end"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Panel */}
        {historyPanel && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-[24px] p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-ink-primary">Draft History</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHistoryPanel(false)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                {getDraftHistory().map((draft, index) => (
                  <div key={draft.id} className="border border-border-subtle rounded-lg p-4">
                    <div className="flex items-center justify
