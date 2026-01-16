import { ArrowRight, FileText, ImageIcon, Plus, Sparkles, Image as ImageIcon2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Card from "../components/ui/Card";
import { GenAIService } from "../services/GenAIService";
import { ScriptAPI } from "../services/api/script";
import { MoodboardAPI } from "../services/api/moodboard";
import { Asset } from "../services/types";
import { useToast } from "../hooks/useToast";
import { useStudio } from "../context/StudioContext";

interface Message {
  role: "user" | "system";
  text: string;
  suggestedAssets?: Asset[];
}

interface GuardianRoomProps {
  project?: {
    id?: string;
    title: string;
    description?: string;
    tone?: string[];
  } | null;
  onBack: () => void;
  initialPrompt?: string;
}

const GuardianRoom: React.FC<GuardianRoomProps> = ({
  project: propProject,
  onBack,
  initialPrompt,
}) => {
  const { activeProject } = useStudio();
  const project = propProject || activeProject; // Prefer prop if passed (e.g. from route params), else context

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
  const [isVisualizing, setIsVisualizing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const hasSentInitialPrompt = useRef(false);
  const genAIService = GenAIService.getInstance();
  const { addToast } = useToast();

  const buildProjectContext = () => {
    if (!project) return undefined;
    const contextParts = [
      project.title ? `Project: ${project.title}` : null,
      project.description ? `Brief: ${project.description}` : null,
      project.tone?.length ? `Tone: ${project.tone.join(", ")}` : null,
    ];
    const context = contextParts.filter(Boolean).join("\n");
    return context || undefined;
  };

  const sendMessage = React.useCallback(
    async (overrideText?: string) => {
      const messageToSend = (overrideText ?? input).trim();
      if (!messageToSend || isLoading) return;

      const newMsg: Message = { role: "user", text: messageToSend };
      const history = messages;
      setMessages((p) => [...p, newMsg]);
      if (!overrideText) {
        setInput("");
      }
      setIsLoading(true);

      try {
        const systemInstruction = project
          ? `You are Lumina, an AI creative director working on "${project.title}". ${project.description ? "Project: " + project.description + ". " : ""}Keep responses concise and focused on film/design direction.`
          : "You are Lumina, a creative AI director. Keep responses concise and focused on film/design direction.";

        const res = await genAIService.generateContent(messageToSend, {
          context: buildProjectContext(),
          systemInstruction,
          history,
        });
        setMessages((p) => [...p, { role: "system", text: res }]);
      } catch (error) {
        // Log error for debugging in development only
        if (import.meta.env.DEV) {
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
    },
    [input, isLoading, messages, project, genAIService]
  );

  const handleVisualize = async () => {
    if (!input.trim() || !project?.id) return;

    setIsVisualizing(true);
    const scriptText = input.trim();

    // Optimistic user message
    const userMsg: Message = { role: "user", text: `Visualize: "${scriptText}"` };
    setMessages((p) => [...p, userMsg]);
    setInput("");

    try {
      const assets = await ScriptAPI.scriptAssist(project.id, scriptText);

      const systemMsg: Message = {
        role: "system",
        text: assets.length > 0
          ? `I've found ${assets.length} visual references that match that mood.`
          : "I couldn't find any exact visual matches in our library for that specific imagery.",
        suggestedAssets: assets
      };

      setMessages((p) => [...p, systemMsg]);
    } catch (error) {
      console.error("Visualization failed:", error);
      addToast("Failed to visualize script line.");
      setMessages((p) => [...p, { role: "system", text: "I had trouble accessing the visual library." }]);
    } finally {
      setIsVisualizing(false);
    }
  };

  const addToMoodboard = async (asset: Asset) => {
    if (!project?.id) return;
    try {
      await MoodboardAPI.createFromAsset(project.id, asset.id);
      addToast("Added to Moodboard");
    } catch (error) {
      console.error("Failed to add to moodboard:", error);
      addToast("Failed to add asset to moodboard");
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

  useEffect(() => {
    if (!initialPrompt || hasSentInitialPrompt.current) return;
    hasSentInitialPrompt.current = true;
    void sendMessage(initialPrompt);
  }, [initialPrompt, sendMessage]);

  return (
    <div className="page-shell h-full flex flex-col md:flex-row gap-8 animate-in fade-in">
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

        <Card className="bg-surface border-border-subtle shadow-sm" hoverable>
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

        <Card className="bg-surface border-border-subtle shadow-sm flex-1" hoverable>
          <div className="flex items-center gap-3 mb-4 text-ink-primary">
            <ImageIcon size={18} />
            <h3 className="text-sm font-bold">Visual Language</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl border border-border-subtle flex flex-col items-center justify-center text-center p-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mb-2">
                <ImageIcon size={16} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-primary">Style Guide</span>
            </div>
            <div className="aspect-square bg-gradient-to-br from-state-warning-bg to-state-warning/15 rounded-xl border border-border-subtle flex flex-col items-center justify-center text-center p-3">
              <div className="w-8 h-8 bg-state-warning rounded-lg flex items-center justify-center mb-2">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-state-warning">Mood Board</span>
            </div>
            <div className="aspect-square bg-gradient-to-br from-subtle to-surface rounded-xl border border-border-subtle flex flex-col items-center justify-center text-center p-3">
              <div className="w-8 h-8 bg-ink-secondary rounded-lg flex items-center justify-center mb-2">
                <FileText size={16} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-ink-secondary">Reference</span>
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
            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-glow" />
            <div>
              <span className="text-sm font-bold text-ink-primary block">
                Lumina Intelligence
              </span>
              <span className="text-[10px] text-ink-tertiary font-medium">
                AI Creative Director
              </span>
            </div>
          </div>
          <button className="text-xs text-ink-inverse bg-ink-primary hover:bg-ink-primary/90 border border-transparent px-4 py-2 rounded-full font-bold transition-all shadow-sm">
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

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={`${msg.role}-${idx}`} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-ink-primary text-ink-inverse"
                    : "bg-subtle text-ink-secondary"
                }`}
              >
                {msg.text}
              </div>

              {/* Asset Suggestions Grid */}
              {msg.suggestedAssets && msg.suggestedAssets.length > 0 && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 max-w-[85%]">
                  {msg.suggestedAssets.map((asset) => (
                    <div key={asset.id} className="group relative aspect-video rounded-lg overflow-hidden border border-border-subtle cursor-pointer shadow-sm hover:shadow-md transition-all">
                      <img
                        src={asset.url}
                        alt={asset.title || "Visual reference"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => addToMoodboard(asset)}
                          className="bg-white/90 text-ink-primary px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-white"
                        >
                          + Moodboard
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <form
          className="p-6 border-t border-border-subtle flex items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessage();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Lumina for direction or visualize a scene..."
            className="flex-1 bg-subtle rounded-full px-4 py-3 text-sm text-ink-primary placeholder-ink-tertiary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />

          {project && (
             <button
              type="button"
              onClick={handleVisualize}
              disabled={isLoading || isVisualizing || !input.trim()}
              className="p-3 rounded-full bg-subtle text-ink-secondary hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-50"
              title="Visualize Script Line"
            >
              {isVisualizing ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <ImageIcon2 size={20} />
              )}
            </button>
          )}

          <button
            type="submit"
            className="px-5 py-3 rounded-full bg-ink-primary text-white text-xs font-bold uppercase tracking-widest disabled:opacity-50"
            disabled={isLoading || isVisualizing}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default GuardianRoom;
