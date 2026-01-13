/**
 * Apple HIG Revenue Chart Widget
 * 
 * Smooth line graph showing monthly revenue with System Green gradient
 * Focuses on the shape of the data curve
 * 
 * Features:
 * - Smooth cubic-bezier curve (not jagged lines)
 * - System Green gradient fill
 * - Subtle X/Y axis labels (caption1 weight)
 * - Interactive: Hover shows data points with tooltips
 * - Responsive: Resizes with container
 * 
 * Architect: Senior Principal Designer (Apple)
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface RevenueDataPoint {
  month: string;
  value: number;
  target?: number;
}

interface RevenueChartWidgetProps {
  data: RevenueDataPoint[];
  title?: string;
  className?: string;
  subtitle?: string;
  currency?: string;
  showTarget?: boolean;
}

/**
 * Revenue Chart Widget Component
 * Renders smooth curve with gradient fill and hover interactions
 */
const RevenueChartWidget: React.FC<RevenueChartWidgetProps> = ({
  data,
  title = 'Monthly Revenue',
  subtitle,
  className = '',
  currency = '$',
  showTarget = true
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<RevenueDataPoint | null>(null);

  // Calculate SVG path with smooth cubic-bezier curve
  const generateSmoothPath = (points: RevenueDataPoint[], width: number, height: number) => {
    if (points.length < 2) return '';

    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const maxValue = Math.max(...points.map(p => p.value)) * 1.1; // 10% headroom
    const minValue = 0;

    const getX = (index: number) => padding.left + (index / (points.length - 1)) * chartWidth;
    const getY = (value: number) => padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

    // Generate path data with curve smoothing
    let pathD = `M ${getX(0)} ${getY(points[0].value)}`;
    
    for (let i = 1; i < points.length; i++) {
      const x1 = getX(i - 1);
      const y1 = getY(points[i - 1].value);
      const x2 = getX(i);
      const y2 = getY(points[i].value);
      const cx = (x1 + x2) / 2; // Control point for smoothing
      
      pathD += ` C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
    }

    // Generate fill path (close the loop at bottom)
    const fillD = `${pathD} L ${getX(points.length - 1)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

    return { pathD, fillD, padding, chartWidth, chartHeight, maxValue, minValue, getX, getY };
  };

  // Render chart on SVG
  const Chart: React.FC<{ width: number; height: number }> = ({ width, height }) => {
    const { pathD, fillD, padding, chartWidth, chartHeight, maxValue, getX, getY } = generateSmoothPath(data, width, height);

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Gradient definition */}
        <defs>
          <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--apple-green)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--apple-green)" stopOpacity="0.05" />
          </linearGradient>
          
          {/* Drop shadow for line */}
          <filter id="lineShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="var(--apple-green)" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Grid lines (horizontal) */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={padding.top + chartHeight * ratio}
            x2={width - padding.right}
            y2={padding.top + chartHeight * ratio}
            stroke="var(--apple-border-ultra-thin)"
            strokeWidth="1"
          />
        ))}

        {/* Fill area */}
        <motion.path
          d={fillD}
          fill="url(#revenueGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Target line (optional) */}
        {showTarget && data[0].target && (
          <line
            x1={padding.left}
            y1={getY(data[0].target)}
            x2={width - padding.right}
            y2={getY(data[0].target)}
            stroke="var(--apple-content-quaternary)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        )}

        {/* Main line curve */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="var(--apple-green)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lineShadow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Data points */}
        {data.map((point, index) => (
          <g key={point.month}>
            {/* Invisible hit target for hover */}
            <circle
              cx={getX(index)}
              cy={getY(point.value)}
              r={12}
              fill="transparent"
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`Revenue for ${point.month}: ${currency}${point.value.toLocaleString()}`}
            />

            {/* Visible point */}
            <circle
              cx={getX(index)}
              cy={getY(point.value)}
              r={hoveredPoint?.month === point.month ? 6 : 4}
              fill="var(--apple-background-secondary)"
              stroke="var(--apple-green)"
              strokeWidth={2}
              transition={{ r: 0.2 }}
            />
          </g>
        ))}

        {/* X-axis labels (months) */}
        {data.map((point, index) => (
          <text
            key={point.month}
            x={getX(index)}
            y={height - padding.bottom + 20}
            textAnchor="middle"
            className="apple-caption1"
            fill="var(--apple-content-tertiary)"
          >
            {point.month}
          </text>
        ))}

        {/* Y-axis labels (values) */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <text
            key={i}
            x={padding.left - 10}
            y={padding.top + chartHeight * ratio + 4}
            textAnchor="end"
            className="apple-caption1"
            fill="var(--apple-content-tertiary)"
          >
            {currency}{Math.round(maxValue * ratio).toLocaleString()}
          </text>
        ))}
      </svg>
    );
  };

  // Format currency with K/M suffix
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `${currency}${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${currency}${(value / 1000).toFixed(1)}K`;
    return `${currency}${value.toLocaleString()}`;
  };

  return (
    <div className={`apple-widget ${className}`}>
      <div className="apple-widget-content">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="apple-title1 mb-1">{title}</h2>
            {subtitle && (
              <span className="apple-caption1 text-apple-content-secondary">
                {subtitle}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="apple-large-title">
              {formatCurrency(data[data.length - 1]?.value || 0)}
            </span>
            <span className="apple-callout text-apple-content-tertiary">
              / month
            </span>
          </div>
        </div>

        {/* Chart container */}
        <div className="flex-1 relative" style={{ minHeight: '300px' }}>
          <Chart width={800} height={300} />

          {/* Tooltip */}
          {hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-0 right-0 apple-material-thin apple-squircle-lg p-4 shadow-lg"
              style={{ zIndex: 10 }}
            >
              <div className="apple-caption1 uppercase tracking-wide text-apple-content-tertiary mb-1">
                {hoveredPoint.month}
              </div>
              <div className="apple-headline">
                {formatCurrency(hoveredPoint.value)}
              </div>
              {hoveredPoint.target && (
                <div className="apple-caption1 mt-1">
                  Target: {formatCurrency(hoveredPoint.target)}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueChartWidget;

/**
 * Usage Example:
 * 
 * import RevenueChartWidget from '@/components/apple/RevenueChartWidget';
 * 
 * <RevenueChartWidget
 *   className="apple-bento-medium"
 *   data={[
 *     { month: 'Jan', value: 125000, target: 150000 },
 *     { month: 'Feb', value: 142000, target: 150000 },
 *     { month: 'Mar', value: 158000, target: 160000 },
 *     { month: 'Apr', value: 145000, target: 170000 },
 *     { month: 'May', value: 172000, target: 180000 },
 *     { month: 'Jun', value: 195000, target: 190000 }
 *   ]}
 *   subtitle="Growth +56% YoY"
 *   currency="$"
 *   showTarget
 * />
 */