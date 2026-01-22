import {
  Circle,
  Hand,
  Layers,
  MousePointer2,
  PenTool,
  Square,
  StickyNote,
  Text,
  Sparkles,
} from "lucide-react";

interface WhiteboardToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
  onShapeChange: (shape: "rectangle" | "ellipse") => void;
  discoveryOpen: boolean;
  onToggleDiscovery: () => void;
  onToggleDeck: () => void;
  canToggleDeck: boolean;
}

const toolButtonBase =
  "flex items-center gap-2 rounded-full border border-transparent bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-ink-primary shadow-sm transition hover:-translate-y-0.5 hover:border-border-subtle hover:bg-white";

const toolButtonActive = "border-ink-primary bg-white text-ink-primary";

export function WhiteboardToolbar({
  activeTool,
  onToolChange,
  onShapeChange,
  discoveryOpen,
  onToggleDiscovery,
  onToggleDeck,
  canToggleDeck,
}: WhiteboardToolbarProps) {
  return (
    <div className="pointer-events-auto fixed left-1/2 top-24 z-20 -translate-x-1/2">
      <div className="flex flex-wrap items-center gap-2 rounded-full border border-border-subtle bg-white/70 px-3 py-2 shadow-lg backdrop-blur-xl">
        <button
          type="button"
          className={`${toolButtonBase} ${activeTool === "select" ? toolButtonActive : ""}`}
          onClick={() => onToolChange("select")}
        >
          <MousePointer2 className="h-4 w-4" />
          Select
        </button>
        <button
          type="button"
          className={`${toolButtonBase} ${activeTool === "hand" ? toolButtonActive : ""}`}
          onClick={() => onToolChange("hand")}
        >
          <Hand className="h-4 w-4" />
          Hand
        </button>
        <button
          type="button"
          className={`${toolButtonBase} ${activeTool === "draw" ? toolButtonActive : ""}`}
          onClick={() => onToolChange("draw")}
        >
          <PenTool className="h-4 w-4" />
          Pen
        </button>
        <button
          type="button"
          className={`${toolButtonBase} ${activeTool === "note" ? toolButtonActive : ""}`}
          onClick={() => onToolChange("note")}
        >
          <StickyNote className="h-4 w-4" />
          Note
        </button>
        <button
          type="button"
          className={`${toolButtonBase} ${activeTool === "text" ? toolButtonActive : ""}`}
          onClick={() => onToolChange("text")}
        >
          <Text className="h-4 w-4" />
          Text
        </button>
        <button
          type="button"
          className={`${toolButtonBase} ${activeTool === "rectangle" ? toolButtonActive : ""}`}
          onClick={() => onShapeChange("rectangle")}
        >
          <Square className="h-4 w-4" />
          Rect
        </button>
        <button
          type="button"
          className={`${toolButtonBase} ${activeTool === "ellipse" ? toolButtonActive : ""}`}
          onClick={() => onShapeChange("ellipse")}
        >
          <Circle className="h-4 w-4" />
          Circle
        </button>
        <div className="h-6 w-px bg-border-subtle" />
        <button
          type="button"
          className={`${toolButtonBase} ${discoveryOpen ? toolButtonActive : ""}`}
          onClick={onToggleDiscovery}
        >
          <Sparkles className="h-4 w-4" />
          Aura
        </button>
        <button
          type="button"
          className={`${toolButtonBase} ${canToggleDeck ? "" : "opacity-40"}`}
          onClick={onToggleDeck}
          disabled={!canToggleDeck}
        >
          <Layers className="h-4 w-4" />
          Stack
        </button>
      </div>
    </div>
  );
}
