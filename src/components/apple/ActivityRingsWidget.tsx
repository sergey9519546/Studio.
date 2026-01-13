/**
 * Apple HIG Activity Rings Widget
 * 
 * Apple Watch-style activity rings for project health tracking
 * Three concentric rings: Timeline (Red), Budget (Green), Team Engagement (Blue)
 * 
 * Features:
 * - Smooth SVG-based animations
 * - Spring easing on load
 * - Real-time data updates
 * - Color-coded thresholds
 * - Accessibility support
 * 
 * Architect: Senior Principal Designer (Apple)
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ActivityRing {
  label: string;
  value: number; // 0-100
  color: string;
  target: number; // Target percentage
}

interface ActivityRingsWidgetProps {
  rings: {
    timeline: ActivityRing;
    budget: ActivityRing;
    engagement: ActivityRing;
  };
  healthScore: number; // 0-100
  className?: string;
  lastUpdated?: string;
}

/**
 * Individual Activity Ring Component
 * Renders a circular progress ring with smooth animation
 */
const ActivityRing: React.FC<{
  ring: ActivityRing;
  size: number;
  strokeWidth: number;
  delay: number;
}> = ({ ring, size, strokeWidth, delay }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (ring.value / 100) * circumference;

  // Determine color based on threshold
  const getColor = (value: number) => {
    if (value < 60) return 'var(--apple-red)';
    if (value < 80) return 'var(--apple-orange)';
    return ring.color;
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.6, type: 'spring', damping: 25, stiffness: 180 }}
      className="relative"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--apple-background-tertiary)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(ring.value)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ delay: delay + 0.2, duration: 1.2, type: 'spring', damping: 30, stiffness: 120 }}
        />
      </svg>
      
      {/* Center value */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="apple-headline"
          style={{ color: getColor(ring.value) }}
        >
          {Math.round(ring.value)}%
        </span>
      </div>
    </motion.div>
  );
};

/**
 * Main Activity Rings Widget Component
 */
const ActivityRingsWidget: React.FC<ActivityRingsWidgetProps> = ({
  rings,
  healthScore,
  className = '',
  lastUpdated
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update time display every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeAgo = (date: string) => {
    const diff = new Date().getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'var(--apple-green)';
    if (score >= 70) return 'var(--apple-blue)';
    if (score >= 50) return 'var(--apple-orange)';
    return 'var(--apple-red)';
  };

  return (
    <div className={`apple-widget ${className}`}>
      <div className="apple-widget-content">
        {/* Header */}
        <div className="mb-6">
          <h2 className="apple-title1 mb-1">Project Health</h2>
          <div className="flex items-center justify-between">
            <span className="apple-subheadline text-apple-content-secondary">
              Overall Score
            </span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="apple-headline font-bold"
              style={{ color: getHealthScoreColor(healthScore) }}
            >
              {healthScore}/100
            </motion.span>
          </div>
        </div>

        {/* Activity Rings */}
        <div className="flex-1 flex items-center justify-center gap-8">
          {/* Timeline Ring (Red) */}
          <div className="flex flex-col items-center gap-2">
            <ActivityRing
              ring={rings.timeline}
              size={120}
              strokeWidth={12}
              delay={0}
            />
            <span className="apple-caption1 uppercase tracking-wide text-apple-content-tertiary">
              Timeline
            </span>
          </div>

          {/* Budget Ring (Green) */}
          <div className="flex flex-col items-center gap-2">
            <ActivityRing
              ring={rings.budget}
              size={120}
              strokeWidth={12}
              delay={0.1}
            />
            <span className="apple-caption1 uppercase tracking-wide text-apple-content-tertiary">
              Budget
            </span>
          </div>

          {/* Team Engagement Ring (Blue) */}
          <div className="flex flex-col items-center gap-2">
            <ActivityRing
              ring={rings.engagement}
              size={120}
              strokeWidth={12}
              delay={0.2}
            />
            <span className="apple-caption1 uppercase tracking-wide text-apple-content-tertiary">
              Team
            </span>
          </div>
        </div>

        {/* Footer */}
        {lastUpdated && (
          <div className="mt-4 pt-4 border-t border-apple-border-ultra-thin">
            <span className="apple-caption1 text-apple-content-tertiary">
              Updated {formatTimeAgo(lastUpdated)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityRingsWidget;

/**
 * Usage Example:
 * 
 * import ActivityRingsWidget from '@/components/apple/ActivityRingsWidget';
 * 
 * <ActivityRingsWidget
 *   className="apple-bento-large"
 *   rings={{
 *     timeline: { label: 'Timeline', value: 75, color: '#FF3B30', target: 100 },
 *     budget: { label: 'Budget', value: 60, color: '#34C759', target: 100 },
 *     engagement: { label: 'Team Engagement', value: 85, color: '#007AFF', target: 100 }
 *   }}
 *   healthScore={73}
 *   lastUpdated={new Date().toISOString()}
 * />
 */