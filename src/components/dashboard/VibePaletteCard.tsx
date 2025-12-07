import { Palette } from "lucide-react";
import React from "react";
import Card from "../../components/ui/Card";

interface VibePaletteCardProps {
  paletteName?: string;
  colors?: string[];
  onColorSelect?: (color: string) => void;
}

const DEFAULT_COLORS = ["#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#007AFF"];

const VibePaletteCard: React.FC<VibePaletteCardProps> = ({
  paletteName = "PALETTE_NEON_04",
  colors = DEFAULT_COLORS,
  onColorSelect,
}) => {
  return (
    <Card className="col-span-2 md:col-span-1 flex flex-col relative overflow-hidden shadow-lg border-0 bg-surface">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-bold text-ink-primary">Daily Vibe</h3>
        <Palette size={20} className="text-ink-tertiary" />
      </div>
      <div className="flex-1 flex flex-col justify-center gap-3">
        <div className="flex gap-2 h-12" role="group" aria-label="Color palette selection">
          {colors.map((color, i) => (
            <button
              key={color}
              className={`palette-color palette-color-${i}`}
              onClick={() => onColorSelect?.(color)}
              aria-label={`Select color ${color}`}
              style={{ backgroundColor: color }}
            >
              <span className="sr-only">Color {color}</span>
            </button>
          ))}
        </div>
        <span className="text-xs text-ink-tertiary font-mono text-center mt-2">
          {paletteName}
        </span>
      </div>
    </Card>
  );
};

export default VibePaletteCard;
