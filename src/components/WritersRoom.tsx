import {
  Book,
  Command,
  Copy,
  Download,
  History,
  Loader2,
  Redo2,
  Save,
  Send,
  Undo2,
} from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { useAutoSave } from "../hooks/useAutoSave";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import UndoRedoService from "../services/UndoRedoService";
import { Button } from "./design/Button";
import { LiquidGlassContainer } from "./design/LiquidGlassContainer";
import { Textarea } from "./design/Textarea";
import { CommandPalette } from "./ui/CommandPalette";

interface Message {
  role: "user" | "assistant";
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
  onGenerateContent?: (
    prompt: string,
    context: GenerationContext
  ) => Promise<string>;
}

export const WritersRoom: React.FC<WritersRoomProps> = ({
  projectId,
  projectTitle = "Untitled Project",
  brief = "",
  guidelines = "",
  onGenerateContent,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showContext] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [historyPanel, setHistoryPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Undo/Redo service
  const undoRedoService = useRef(new UndoRedoService()).current;

  // Auto-save functionality
  const autoSave = useAutoSave(
    `writers-room-${projectId}`,
    "document",
    {
      messages,
      inputValue,
      timestamp: new Date(),
    },
    {
      enabled: true,
      interval: 30000, // 30 seconds
      debounceMs: 2000,
      enableVersioning: true,
      maxVersions: 50,
      onSave: (draft) => {
        console.log("Draft saved:", draft.id);
      },
      onError: (error) => {
        console.error("Auto-save error:", error);
      },
    }
  );

  // Scroll to bottom when new messages are added
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load draft on mount
  React.useEffect(() => {
    const savedDraft = autoSave.draft;
    if (savedDraft && savedDraft.content) {
      try {
        if (savedDraft.content.messages)
          setMessages(savedDraft.content.messages);
        if (savedDraft.content.inputValue)
          setInputValue(savedDraft.content.inputValue);
      } catch (error) {
        console.warn("Failed to parse saved draft:", error);
      }
    }
  }, [autoSave.draft]);

  // Update draft when messages or input change
  React.useEffect(() => {
    const content = {
      messages,
      inputValue,
      projectTitle,
      timestamp: new Date(),
    };
    autoSave.update(content, {
      title: projectTitle,
      projectId,
    });
  }, [messages, inputValue, projectTitle, projectId, autoSave]);

  // Keyboard shortcuts
  const { registerShortcut } = useKeyboardShortcuts("editor");

  React.useEffect(() => {
    const cleanups = [
      registerShortcut(
        {
          id: "open-command-palette",
          key: "k",
          modifiers: { meta: true },
          description: "Open command palette",
        },
        (e) => {
          e.preventDefault();
          setShowCommandPalette(true);
        }
      ),
      registerShortcut(
        {
          id: "save-draft",
          key: "s",
          modifiers: { meta: true },
          description: "Save current draft",
        },
        (e) => {
          e.preventDefault();
          autoSave.save();
        }
      ),
      registerShortcut(
        {
          id: "undo",
          key: "z",
          modifiers: { meta: true },
          description: "Undo",
        },
        (e) => {
          e.preventDefault();
          undoRedoService.undo();
        }
      ),
      registerShortcut(
        {
          id: "redo",
          key: "z",
          modifiers: { meta: true, shift: true },
          description: "Redo",
        },
        (e) => {
          e.preventDefault();
          undoRedoService.redo();
        }
      ),
      registerShortcut(
        {
          id: "send-message",
          key: "Enter",
          modifiers: {},
          description: "Send message",
        },
        (e) => {
          if (!e.shiftKey && !isGenerating && inputValue.trim()) {
            e.preventDefault();
            handleSendMessage();
          }
        }
      ),
      registerShortcut(
        {
          id: "close-panels",
          key: "Escape",
          modifiers: {},
          description: "Close panels",
        },
        (e) => {
          if (showCommandPalette) {
            setShowCommandPalette(false);
          }
          if (historyPanel) {
            setHistoryPanel(false);
          }
        }
      ),
    ];

    return () => cleanups.forEach((c) => c());
  }, [
    registerShortcut,
    autoSave,
    undoRedoService,
    isGenerating,
    inputValue,
    showCommandPalette,
    historyPanel,
  ]);

  // Command palette commands
  const commands: any[] = [
    {
      id: "save-draft",
      title: "Save Current Draft",
      icon: Save,
      category: "actions",
      keywords: ["save", "draft", "keep"],
      action: () => autoSave.save(),
      shortcut: "⌘S",
    },
    {
      id: "undo",
      title: "Undo",
      icon: Undo2,
      category: "actions",
      keywords: ["undo", "back", "revert"],
      action: () => {
        undoRedoService.undo();
      },
      shortcut: "⌘Z",
    },
    {
      id: "redo",
      title: "Redo",
      icon: Redo2,
      category: "actions",
      keywords: ["redo", "forward", "again"],
      action: () => {
        undoRedoService.redo();
      },
      shortcut: "⇧⌘Z",
    },
    {
      id: "show-history",
      title: "Show Draft History",
      icon: History,
      category: "tools",
      keywords: ["history", "versions", "drafts"],
      action: () => setHistoryPanel(true),
      shortcut: "⌘H",
    },
    {
      id: "clear-drafts",
      title: "Clear All Drafts",
      icon: History,
      category: "actions",
      keywords: ["clear", "delete", "reset"],
      action: () => {
        autoSave.deleteDraft();
      },
    },
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;

    // Save current state for undo/redo
    const currentState = { messages, inputValue };
    undoRedoService.executeAction({
      id: `send_message_${Date.now()}`,
      type: "send_message",
      description: "Send message",
      timestamp: new Date(),
      data: currentState,
      execute: async () => {
        // This will be handled by the main flow
      },
    });

    setInputValue("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);

    setIsGenerating(true);
    try {
      const context = {
        projectTitle,
        brief,
        guidelines,
        assetMetadata: [],
        projectIntelligence: [],
      };

      const response =
        (await onGenerateContent?.(userMessage, context)) ||
        `Generated response for: ${userMessage}`;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
          context: [brief, guidelines].filter(Boolean),
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };;

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleDownloadMessage = (content: string) => {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    );
    element.setAttribute("download", `${projectTitle}-script.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getAutoSaveStatus = () => {
    switch (autoSave.status) {
      case "saving":
        return { text: "Saving...", icon: Loader2, className: "text-blue-500" };
      case "saved":
        return { text: "Saved", icon: Save, className: "text-green-500" };
      case "error":
        return { text: "Save failed", icon: Save, className: "text-red-500" };
      default:
        return { text: "Draft", icon: Save, className: "text-ink-tertiary" };
    }
  };

  const autoSaveStatus = getAutoSaveStatus();
  const StatusIcon = autoSaveStatus.icon;

  const getDraftHistory = () => {
    return autoSave.getVersions();
  };

  const handleRestoreVersion = async (versionIndex: number) => {
    await autoSave.restoreVersion(versionIndex);
    setHistoryPanel(false);
  };

  return (
    <div className="w-full h-full bg-app">
      <div className="max-w-7xl mx-auto p-8">
        {/* Enhanced Header with Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-ink-primary">
              Writer's Room
            </h1>
            <div className="flex items-center gap-4">
              {/* Auto-save Status */}
              <div
                className={`flex items-center gap-2 text-sm ${autoSaveStatus.className}`}
              >
                <StatusIcon
                  size={16}
                  className={autoSave.status === "saving" ? "animate-spin" : ""}
                />
                <span>{autoSaveStatus.text}</span>
                {autoSave.lastSaved && (
                  <span className="text-xs text-ink-tertiary">
                    {autoSave.lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </div>

              {/* History Panel Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHistoryPanel(!historyPanel)}
                className={historyPanel ? "bg-primary text-white" : ""}
              >
                <History size={16} />
              </Button>
            </div>
          </div>
          <p className="text-ink-secondary">
            Lumina-powered content generation with full project context
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar: Context */}
          {showContext && (
            <div className="lg:col-span-1">
              <LiquidGlassContainer level="lg" className="sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-ink-primary">
                    Context
                  </h2>
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
          <div className={`${showContext ? "lg:col-span-3" : "lg:col-span-4"}`}>
            <div className="flex flex-col h-[600px] bg-white rounded-[24px] shadow-ambient overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <Book
                        size={48}
                        className="mx-auto text-ink-tertiary mb-4"
                      />
                      <p className="text-ink-secondary mb-2">
                        Welcome to the Writer's Room
                      </p>
                      <p className="text-xs text-ink-tertiary max-w-sm">
                        Ask Lumina to generate scripts, copy, shotlists, and
                        more. All suggestions are grounded in your project
                        context.
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
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md rounded-[24px] px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-primary text-white"
                            : "bg-subtle text-ink-primary"
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
                        {msg.role === "assistant" && (
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
                      <Loader2
                        size={16}
                        className="animate-spin text-primary"
                      />
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
                      placeholder="Ask Lumina to create a 30-second script, copywriting, etc..."
                      rows={1}
                      variant="secondary"
                      className="resize-none pr-20"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    {/* Keyboard shortcuts hint */}
                    <div className="absolute right-2 top-2 flex gap-1">
                      <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 rounded">
                        ⌘K
                      </kbd>
                      <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 rounded">
                        ⌘S
                      </kbd>
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
                <h3 className="text-lg font-bold text-ink-primary">
                  Draft History
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHistoryPanel(false)}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-2">
                {getDraftHistory().length === 0 ? (
                  <p className="text-ink-tertiary text-sm">
                    No draft history available.
                  </p>
                ) : (
                  getDraftHistory().map((version, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-subtle rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-ink-primary">
                          Version {getDraftHistory().length - index}
                        </p>
                        <p className="text-xs text-ink-tertiary">
                          {new Date(version.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRestoreVersion(index)}
                      >
                        Restore
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Command Palette */}
        {showCommandPalette && (
          <CommandPalette
            commands={commands}
            isOpen={showCommandPalette}
            onClose={() => setShowCommandPalette(false)}
          />
        )}
      </div>
    </div>
  );
};

export default WritersRoom;
