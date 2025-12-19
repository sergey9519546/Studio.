import { ArrowRight, FileText, ImageIcon, Plus, Sparkles } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Card from "../../components/ui/Card";
import { GenAIService } from "../../services/GenAIService";

interface Message {
  role: "user" | "system";
  text: string;
}

interface GuardianRoomProps {
  project?: {
    id?: string;
    title: string;
    description?: string;
    tone?: string[];
  } | null;
  onBack: () => void;
}

const GuardianRoom: React.FC<GuardianRoomProps> = ({ project, onBack }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      text: project?.title
        ? `I've analyzed the "${project.title}" brief. ${project.description ? project.description + " " : ""}Would you like me to draft concepts or provide creative direction?`
        : "Welcome to Writer's Room. I'm Lumina, your AI creative director. How can I help shape your vision today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const genAIService = GenAIService.getInstance();

  const sendMessage = async (overrideText?: string) => {
    const messageToSend = overrideText ?? input;
    if (!messageToSend.trim() || isLoading) return;

    const newMsg: Message = { role: "user", text: messageToSend };
    setMessages((p) => [...p, newMsg]);
    if (!overrideText) {
      setInput("");
    }
    setIsLoading(true);

    try {
      const systemInstruction = project
        ? `You are Lumina, an AI creative director working on "${project.title}". ${project.description ? "Project: " + project.description + ". " : ""}Keep responses concise and focused on film/design direction.`
        : "You are Lumina, a creative AI director. Keep responses concise and focused on film/design direction.";

      const res = await genAIService.generateEnhancedContent(
        messageToSend,
        undefined,
        systemInstruction
      );
      setMessages((p) => [...p, { role: "system", text: res }]);
    } catch (error) {
      // Log error for debugging in development only
      if (process.env.NODE_ENV === 'development') {
        console.error("Lumina Intelligence Error:", error);
      }
      setMessages((p) => [
        ...p,
        {
          role: "system",
          text: "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const promptStarters = [
    "Draft a scene outline based on this brief.",
    "Turn the brief into a 10-shot storyboard list.",
    "Write a 30-second VO read with a cinematic tone.",
  ];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full flex flex-col md:flex-row gap-8 pb-32 animate-in fade-in pt-8 px-8 max-w-[1800px] mx-auto">
      {/* Header for Mobile */}
      <div className="md:hidden flex items-center gap-4 mb-4">
        <button
          onClick={onBack}
          className="text-ink-secondary hover:text-ink-primary"
          aria-label="Go back"
        >
          <ArrowRight className="rotate-180" size={24} />
        </button>
        <h2 className="text-lg font-bold text-ink-primary">Writer's Room</h2>
      </div>

      {/* Left Panel: Context (Hidden on small mobile, visible on desktop) */}
      <div className="hidden md:flex w-[380px] flex-col gap-6 shrink-0 h-full overflow-y-auto pb-4">
        <div className="text-xs font-bold uppercase tracking-widest text-ink-secondary pl-1">
          Project Context
        </div>

        <Card className="bg-surface border-border-subtle shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-ink-primary">
            <FileText size={18} />
            <h3 className="text-sm font-bold">The Brief</h3>
          </div>
          <p className="text-sm text-ink-secondary leading-relaxed mb-6 font-medium">
            {project?.description ||
              `Creative direction for "${project?.title || "your project"}".`}
          </p>
          {project?.tone && (
            <div className="flex gap-2 flex-wrap">
              {project.tone.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-subtle rounded-md text-[11px] font-semibold text-ink-primary border border-border-subtle"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </Card>

        <Card className="bg-surface border-border-subtle shadow-sm flex-1">
          <div className="flex items-center gap-3 mb-4 text-ink-primary">
            <ImageIcon size={18} />
            <h3 className="text-sm font-bold">Visual Language</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-border-subtle flex flex-col items-center justify-center text-center p-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
                <ImageIcon size={16} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Style Guide</span>
            </div>
            <div className="aspect-square bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-border-subtle flex flex-col items-center justify-center text-center p-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">Mood Board</span>
            </div>
            <div className="aspect-square bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-border-subtle flex flex-col items-center justify-center text-center p-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                <FileText size={16} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-green-700 dark:text-green-300">Reference</span>
            </div>
            <div className="aspect-square border-2 border-dashed border-border-subtle rounded-xl flex flex-col items-center justify-center text-center p-3 hover:border-ink-primary hover:bg-ink-primary/5 transition-all cursor-pointer">
              <Plus size={20} className="text-ink-tertiary hover:text-ink-primary mb-1" />
              <span className="text-xs font-medium text-ink-tertiary hover:text-ink-primary">Add Visual</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Panel: Chat */}
      <div className="flex-1 flex flex-col h-full bg-surface rounded-3xl border border-border-subtle shadow-sm relative overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-surface/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-black rounded-full animate-pulse shadow-glow" />
            <div>
              <span className="text-sm font-bold text-ink-primary block">
                Lumina Intelligence
              </span>
              <span className="text-[10px] text-ink-tertiary font-medium">
                AI Creative Director
              </span>
            </div>
          </div>
          <button className="text-xs text-white bg-black hover:bg-black/90 border border-transparent px-4 py-2 rounded-full font-bold transition-all shadow-sm">
            Export Script
          </button>
        </div>

        {/* Prompt starters */}
        <div className="px-6 pb-2 pt-4 flex flex-wrap gap-2 border-b border-border-subtle">
          {promptStarters.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="px-3 py-2 bg-subtle text-xs font-semibold text-ink-primary rounded-full border border-border-subtle hover:border-ink-primary transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-app">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start items-start gap-4"} animate-in slide-in-from-bottom-2`}
            >
              {m.role === "system" && (
                <div className="w-8 h-8 rounded-full bg-surface border border-border-subtle flex items-center justify-center mt-4 flex-shrink-0 shadow-sm text-ink-primary">
                  <Sparkles size={14} />
                </div>
              )}
              <div
                className={`max-w-[85%] md:max-w-[70%] ${m.role === "user" ? "bubble-user" : "bubble-ai"}`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start items-start gap-4 animate-in slide-in-from-bottom-2">
              <div className="w-8 h-8 rounded-full bg-surface border border-border-subtle flex items-center justify-center mt-4 flex-shrink-0 shadow-sm text-ink-primary">
                <Sparkles size={14} />
              </div>
              <div className="bubble-ai shimmer">Thinking...</div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-6 bg-surface border-t border-border-subtle">
          <div className="relative max-w-4xl mx-auto">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              placeholder="Message Lumina..."
              disabled={isLoading}
              className="w-full bg-subtle border border-transparent focus:border-border-subtle focus:bg-surface rounded-2xl px-6 py-4 text-sm outline-none transition-all pl-6 pr-14 font-medium placeholder:text-ink-tertiary text-ink-primary disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 p-2 bg-black text-white rounded-xl hover:scale-105 transition-transform shadow-md disabled:opacity-50 disabled:hover:scale-100"
              aria-label="Send message"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardianRoom;
