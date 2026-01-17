import { ArrowRight, Brain } from "lucide-react";
import React, { useId, useState } from "react";
import Card from "../../components/ui/Card";

interface LuminaAICardProps {
  onSubmitPrompt?: (prompt: string) => void;
  className?: string;
}

const MAX_PROMPT_LENGTH = 160;

const LuminaAICard: React.FC<LuminaAICardProps> = ({ onSubmitPrompt, className = "" }) => {
  const [prompt, setPrompt] = useState("");
  const helperId = useId();
  const accent = "var(--dashboard-accent, #2463E6)";
  const remainingCharacters = MAX_PROMPT_LENGTH - prompt.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPrompt = prompt.trim();
    if (normalizedPrompt) {
      onSubmitPrompt?.(normalizedPrompt);
      setPrompt("");
    }
  };

  return (
    <Card
      className={`flex flex-col justify-between text-white border-0 shadow-xl relative overflow-hidden ${className}`}
      hoverable
      style={{
        background: `radial-gradient(120% 120% at 100% 0%, rgba(255,255,255,0.08), transparent 45%), ${accent}`,
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-state-warning/20 blur-3xl rounded-full pointer-events-none" />
      <div className="flex justify-between items-start z-10">
        <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
          <Brain size={20} className="text-white" />
        </div>
        <span className="text-[10px] font-mono text-white/40">AI v4.0</span>
      </div>
      <div className="z-10">
        <h3 className="text-lg font-medium mb-4 leading-tight">
          Lumina
          <br />
          Intelligence.
        </h3>
        <form onSubmit={handleSubmit} className="relative group/input">
          <label htmlFor="ai-prompt" className="sr-only">
            Enter a concept prompt for AI generation
          </label>
          <input
            id="ai-prompt"
            placeholder="Ask Lumina..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-white/20 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/60 outline-none focus:bg-white/30 focus:border-white/30 transition-all pr-10"
            maxLength={MAX_PROMPT_LENGTH}
            aria-describedby={helperId}
          />
          <button
            type="submit"
            className="absolute right-2 top-2 p-1.5 text-white/50 hover:text-white bg-white/5 hover:bg-white/20 rounded-lg transition-all disabled:opacity-50"
            disabled={!prompt.trim()}
            aria-label="Submit prompt"
          >
            <span className="sr-only">Submit prompt</span>
            <ArrowRight size={14} />
          </button>
        </form>
        <div
          id={helperId}
          className="mt-2 text-[11px] text-white/70 flex items-center justify-between"
        >
          <span>Anchor with concrete nouns and tone cues.</span>
          <span aria-live="polite">{remainingCharacters} left</span>
        </div>
      </div>
    </Card>
  );
};

export default LuminaAICard;
