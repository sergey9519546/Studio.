
import { Cpu, HardDrive, Wifi } from "lucide-react";
import React from "react";
import Card from "../ui/Card";

interface ResourceMetric {
  label: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  color: string;
}

const metrics: ResourceMetric[] = [
  { label: "CPU", value: 42, unit: "%", icon: Cpu, color: "text-blue-500" },
  { label: "Storage", value: 68, unit: "%", icon: HardDrive, color: "text-purple-500" },
  { label: "Network", value: 24, unit: "ms", icon: Wifi, color: "text-emerald-500" },
];

const ResourceUsageWidget: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <Card className={`bg-surface border-border-subtle ${className}`}>
      <h3 className="font-bold text-sm text-ink-primary mb-4">System Status</h3>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="flex items-end justify-between mb-1">
              <div className="flex items-center gap-2 text-ink-secondary text-xs font-medium">
                <metric.icon size={14} className={metric.color} />
                {metric.label}
              </div>
              <div className="text-xs font-bold text-ink-primary">
                {metric.value}{metric.unit}
              </div>
            </div>
            <div className="h-1.5 w-full bg-subtle rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${metric.color.replace('text-', 'bg-')}`}
                style={{ width: `${metric.value}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ResourceUsageWidget;
