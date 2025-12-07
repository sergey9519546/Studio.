import { ArrowRight, Brain } from "lucide-react";
import React, { useState } from "react";
import Card from "../../components/ui/Card";

interface SparkAICardProps {
  onSubmitPrompt?: (prompt: string) => void;
}

const SparkAICard: React.FC<SparkAICardProps> = ({ onSubmitPrompt }) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmitPrompt?.(prompt);
      setPrompt("");
    }
  };

  return (
    <Card className="col-span-2 md:col-span-1 flex flex-col justify-between bg-ink-primary text-white border-0 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />
      <div className="flex justify-between items-start z-10">
        <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
          <Brain size={20} className="text-white" />
        </div>
        <span className="text-[10px] font-mono text-white/40">
          AI v4.0
        </span>
      </div>
      <div className="z-10">
        <h3 className="text-lg font-medium mb-4 leading-tight">
          Spark
          <br />
          Creativity.
        </h3>
        <form onSubmit={handleSubmit} className="relative group/input">
          <label htmlFor="ai-prompt" className="sr-only">
            Enter a concept prompt for AI generation
          </label>
          <input
            id="ai-prompt"
            placeholder="Concept prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-white/10 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:bg-white/20 focus:border-white/20 transition-all pr-10"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 p-1.5 text-white/50 hover:text-white bg-white/5 hover:bg-white/20 rounded-lg transition-all disabled:opacity-50"
            disabled={!prompt.trim()}
            aria-label="Submit prompt"
          >
            <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </Card>
  );
};

export default SparkAICard;
