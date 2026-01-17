import { Sparkles, X, Wand2 } from "lucide-react";
import React, { useState } from "react";
import { AIAPI } from "../../services/api/ai";

interface AIImageGeneratorProps {
  onImageGenerated?: (imageUrl: string) => void;
  onClose: () => void;
}

const AIImageGenerator: React.FC<AIImageGeneratorProps> = ({
  onImageGenerated,
  onClose,
}) => {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState<'1024x1024' | '1280x1280' | '512x512'>('1280x1280');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const { data } = await AIAPI.generateImage({ prompt, size });
      setGeneratedImageUrl(data.imageUrl);
      
      if (onImageGenerated) {
        onImageGenerated(data.imageUrl);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate image"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-4xl mx-4 p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-ink-tertiary hover:text-ink-primary transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Wand2 className="text-primary" size={20} />
            </div>
            <h2 className="text-3xl font-bold text-ink-primary">
              AI Image Generator
            </h2>
          </div>
          <p className="text-ink-secondary text-sm">
            Create stunning images using GLM-Image AI model
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-ink-primary mb-2">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate... (e.g., A cute little kitten sitting on a sunny windowsill)"
              className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-surface text-ink-primary placeholder-ink-tertiary focus:border-primary focus:outline-none transition-colors resize-none"
              rows={4}
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-primary mb-2">
              Image Size
            </label>
            <div className="flex gap-3">
              {(['512x512', '1024x1024', '1280x1280'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  disabled={isGenerating}
                  className={`
                    px-4 py-2 rounded-xl border transition-all font-medium text-sm
                    ${
                      size === s
                        ? 'border-primary bg-primary text-white'
                        : 'border-border-subtle text-ink-secondary hover:border-primary hover:text-primary'
                    }
                    ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-state-danger-bg border border-state-danger rounded-xl">
              <p className="text-sm text-state-danger">{error}</p>
            </div>
          )}

          {generatedImageUrl && (
            <div className="relative">
              <img
                src={generatedImageUrl}
                alt="Generated image"
                className="w-full rounded-2xl shadow-lg"
              />
              <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-ink-primary">
                Generated with GLM-Image
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-border-subtle text-ink-primary hover:border-ink-primary transition-colors"
              disabled={isGenerating}
            >
              Close
            </button>
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className={`
                px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2
                ${
                  !prompt.trim() || isGenerating
                    ? "bg-subtle text-ink-tertiary cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-hover shadow-lg"
                }
              `}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Image
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIImageGenerator;
