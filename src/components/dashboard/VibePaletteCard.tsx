import { Palette } from "lucide-react";
import React from "react";
import Card from "../../components/ui/Card";
import { colors as themeColors } from "../../theme/tokens";

interface VibePaletteCardProps {
  paletteName?: string;
  colors?: string[];
  onColorSelect?: (color: string) => void;
  className?: string;
  selectedColor?: string;
}

const DEFAULT_COLORS = [
  themeColors.state.danger,
  themeColors.state.warning,
  "#FFCC00",
  themeColors.state.success,
  themeColors.accent.primary,
];

const VibePaletteCard: React.FC<VibePaletteCardProps> = ({
  paletteName = "PALETTE_NEON_04",
  colors = DEFAULT_COLORS,
  onColorSelect,
  className = "",
  selectedColor,
}) => {
  return (
    <Card className={`flex flex-col relative overflow-hidden shadow-lg border-0 bg-surface ${className}`}>
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
              aria-pressed={selectedColor ? selectedColor.toLowerCase() === color.toLowerCase() : undefined}
              style={{
                backgroundColor: color,
                transitionDelay: `${i * 40}ms`,
                boxShadow:
                  selectedColor && selectedColor.toLowerCase() === color.toLowerCase()
                    ? "0 0 0 3px var(--dashboard-accent, #2463E6)"
                    : undefined,
                borderColor:
                  selectedColor && selectedColor.toLowerCase() === color.toLowerCase()
                    ? "var(--dashboard-accent, #2463E6)"
                    : undefined,
              }}
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
