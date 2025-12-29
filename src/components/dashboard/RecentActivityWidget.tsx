import { Activity, Clock, FileCheck, User } from "lucide-react";
import React from "react";
import Card from "../ui/Card";

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "project" | "moodboard" | "freelancer";
}

interface RecentActivityWidgetProps {
  className?: string;
  activities?: ActivityItem[];
  loading?: boolean;
}

const formatRelativeTime = (timestamp: string): string => {
  const time = new Date(timestamp).getTime();
  if (Number.isNaN(time)) return "Just now";
  const diff = Date.now() - time;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const iconMap = {
  project: Activity,
  moodboard: FileCheck,
  freelancer: User,
};

const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({
  className = "",
  activities = [],
  loading = false,
}) => {
  const hasActivities = activities.length > 0;

  return (
    <Card className={`flex flex-col h-full bg-surface border-border-subtle ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-ink-primary">
          <Activity size={18} />
          <h3 className="font-bold text-sm">Latest Activity</h3>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 space-y-4">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-12 rounded-xl bg-subtle border border-border-subtle animate-pulse"
            />
          ))}
        </div>
      ) : hasActivities ? (
        <div className="flex-1 space-y-4">
          {activities.map((item) => {
            const Icon = iconMap[item.type] || Activity;
            return (
              <div key={item.id} className="flex gap-3 items-start group">
                <div className="w-8 h-8 rounded-full bg-subtle flex items-center justify-center text-ink-secondary border border-border-subtle shrink-0">
                  <Icon size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-ink-primary leading-relaxed">
                    <span className="font-bold">{item.title}</span>{" "}
                    <span className="text-ink-secondary">{item.description}</span>
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-ink-tertiary">
                    <Clock size={10} />
                    <span>{formatRelativeTime(item.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 rounded-xl bg-subtle border border-border-subtle p-6 flex flex-col items-start justify-center gap-3">
          <div className="text-sm font-medium text-ink-primary">No updates yet</div>
          <p className="text-xs text-ink-secondary">
            Activity from projects, freelancers, and moodboards will appear here.
          </p>
        </div>
      )}
    </Card>
  );
};

export default RecentActivityWidget;
