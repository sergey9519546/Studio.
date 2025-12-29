import React from "react";

interface StatusBadgeProps {
  text: string;
  isOnline?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ text, isOnline = true }) => {
  return (
    <span className="px-3 py-1 bg-surface border border-border-subtle rounded-lg text-[11px] font-bold uppercase tracking-widest text-ink-secondary shadow-sm flex items-center gap-2">
      <div
        className={`w-1.5 h-1.5 rounded-full ${
          isOnline ? "animate-pulse status-indicator" : "bg-ink-tertiary"
        }`}
      />
      {text}
    </span>
  );
};

export default StatusBadge;
