
import { Activity, Clock, FileCheck, GitCommit, User } from "lucide-react";
import React from "react";
import Card from "../ui/Card";

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: "commit" | "comment" | "upload" | "review";
}

const mockActivity: ActivityItem[] = [
  {
    id: "1",
    user: { name: "Alex Director" },
    action: "updated brief for",
    target: "Nebula Phase II",
    timestamp: "2m ago",
    type: "upload",
  },
  {
    id: "2",
    user: { name: "Sarah Editor" },
    action: "commented on",
    target: "Rough Cut v3",
    timestamp: "15m ago",
    type: "comment",
  },
  {
    id: "3",
    user: { name: "Mike Color" },
    action: "pushed changes to",
    target: "Grading Workflow",
    timestamp: "1h ago",
    type: "commit",
  },
  {
    id: "4",
    user: { name: "Client" },
    action: "approved",
    target: "Final Deliverable",
    timestamp: "2h ago",
    type: "review",
  },
];

const RecentActivityWidget: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <Card className={`flex flex-col h-full bg-surface border-border-subtle ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-ink-primary">
          <Activity size={18} />
          <h3 className="font-bold text-sm">Team Activity</h3>
        </div>
        <button className="text-xs text-ink-tertiary hover:text-ink-primary transition-colors">
          View All
        </button>
      </div>
      
      <div className="flex-1 space-y-4">
        {mockActivity.map((item) => (
          <div key={item.id} className="flex gap-3 items-start group">
            <div className="w-8 h-8 rounded-full bg-subtle flex items-center justify-center text-ink-secondary border border-border-subtle shrink-0">
              {item.type === "commit" && <GitCommit size={14} />}
              {item.type === "comment" && <Activity size={14} />}
              {item.type === "upload" && <FileCheck size={14} />}
              {item.type === "review" && <User size={14} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-ink-primary leading-relaxed">
                <span className="font-bold">{item.user.name}</span>{" "}
                <span className="text-ink-secondary">{item.action}</span>{" "}
                <span className="font-medium text-primary">{item.target}</span>
              </p>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-ink-tertiary">
                <Clock size={10} />
                <span>{item.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivityWidget;
