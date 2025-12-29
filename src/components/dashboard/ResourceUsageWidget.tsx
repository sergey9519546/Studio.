import { ImageIcon, Layers, Users } from "lucide-react";
import React from "react";
import Card from "../ui/Card";
import type { DashboardCounts } from "../../hooks/useDashboardData";

interface ResourceUsageWidgetProps {
  className?: string;
  counts: DashboardCounts;
  isError?: boolean;
}

const ResourceUsageWidget: React.FC<ResourceUsageWidgetProps> = ({
  className = "",
  counts,
  isError = false,
}) => {
  const metrics = [
    {
      label: "Projects",
      value: counts.projects,
      helper: "Active pipeline",
      icon: Layers,
    },
    {
      label: "Freelancers",
      value: counts.freelancers,
      helper: "Rostered talent",
      icon: Users,
    },
    {
      label: "Assets",
      value: counts.moodboardItems,
      helper: "Moodboard items",
      icon: ImageIcon,
    },
  ];

  return (
    <Card className={`bg-surface border-border-subtle ${className}`}>
      <h3 className="font-bold text-sm text-ink-primary mb-4">Studio Metrics</h3>
      {isError ? (
        <div className="rounded-xl border border-state-warning/30 bg-state-warning-bg px-4 py-3 text-xs text-state-warning">
          Metrics are partially unavailable.
        </div>
      ) : null}
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-between rounded-2xl border border-border-subtle bg-subtle px-4 py-3"
          >
            <div className="flex items-center gap-3 text-ink-secondary">
              <div className="w-8 h-8 rounded-xl bg-surface border border-border-subtle flex items-center justify-center">
                <metric.icon size={14} />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em]">
                  {metric.label}
                </div>
                <div className="text-[11px] text-ink-tertiary">
                  {metric.helper}
                </div>
              </div>
            </div>
            <div className="text-lg font-semibold text-ink-primary">
              {metric.value}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ResourceUsageWidget;
