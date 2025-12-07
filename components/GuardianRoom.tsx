import { ArrowRight, FileText, ImageIcon, Plus, Sparkles } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { GenAIService } from "../services/GenAIService";
import Card from "./ui/Card";

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

  const send = async () => {
    if (!input.trim() || isLoading) return;
    const newMsg: Message = { role: "user", text: input };
    setMessages((p) => [...p, newMsg]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const systemInstruction = project
        ? `You are Lumina, an AI creative director working on "${project.title}". ${project.description ? "Project: " + project.description + ". " : ""}Keep responses concise and focused on film/design direction.`
        : "You are Lumina, a creative AI director. Keep responses concise and focused on film/design direction.";

      const res = await genAIService.generateEnhancedContent(
        currentInput,
        undefined,
        systemInstruction
      );
      setMessages((p) => [...p, { role: "system", text: res }]);
    } catch (error) {
      console.error("Lumina Intelligence Error:", error);
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
            <div className="aspect-square bg-subtle rounded-xl border border-border-subtle flex items-center justify-center text-ink-tertiary">
              Ref 1
            </div>
            <div className="aspect-square bg-subtle rounded-xl border border-border-subtle flex items-center justify-center text-ink-tertiary">
              Ref 2
            </div>
            <div className="aspect-square bg-subtle rounded-xl border border-border-subtle flex items-center justify-center text-ink-tertiary">
              Ref 3
            </div>
            <div className="aspect-square border-2 border-dashed border-border-subtle rounded-xl flex items-center justify-center text-ink-tertiary hover:border-ink-primary hover:text-ink-primary transition-colors cursor-pointer">
              <Plus size={20} />
            </div>
          </div>
        </Card>
      </div>

      {/* Right Panel: Chat */}
      <div className="flex-1 flex flex-col h-full bg-surface rounded-3xl border border-border-subtle shadow-sm relative overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-surface/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-glow" />
            <div>
              <span className="text-sm font-bold text-ink-primary block">
                Lumina Intelligence
              </span>
              <span className="text-[10px] text-ink-tertiary font-medium">
                AI Creative Director
              </span>
            </div>
          </div>
          <button className="text-xs text-ink-primary bg-subtle hover:bg-border-subtle border border-transparent px-4 py-2 rounded-full font-bold transition-all">
            Export Script
          </button>
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
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Message Lumina..."
              disabled={isLoading}
              className="w-full bg-subtle border border-transparent focus:border-border-subtle focus:bg-surface rounded-2xl px-6 py-4 text-sm outline-none transition-all pl-6 pr-14 font-medium placeholder:text-ink-tertiary text-ink-primary disabled:opacity-50"
            />
            <button
              onClick={send}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 p-2 bg-ink-primary text-white rounded-xl hover:scale-105 transition-transform shadow-md disabled:opacity-50 disabled:hover:scale-100"
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
