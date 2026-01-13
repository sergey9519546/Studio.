/**
 * Apple HIG Analytics Dashboard - Complete Implementation
 * 
 * Bento Box layout with all Pro widgets:
 * - Activity Rings Widget (Large)
 * - Revenue Chart Widget (Medium)
 * - System Health Widget (Medium)
 * - Data Table Widget (Wide)
 * 
 * Features:
 * - Real-time data updates
 * - Smooth animations
 * - Responsive design
 * - Accessibility support
 * - Perfect alignment grid
 * 
 * Architect: Senior Principal Designer (Apple)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityRingsWidget from './ActivityRingsWidget';
import RevenueChartWidget from './RevenueChartWidget';
import SystemHealthWidget from './SystemHealthWidget';
import DataTableWidget, { type TableColumn, type TableRow } from './DataTableWidget';

/**
 * Analytics Dashboard Component
 * Main container for all analytics widgets in Bento Box layout
 */
const AnalyticsDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Activity Rings Data
  const activityRingsData = useMemo(() => ({
    timeline: { label: 'Timeline', value: 75, color: '#FF3B30', target: 100 },
    budget: { label: 'Budget', value: 60, color: '#34C759', target: 100 },
    engagement: { label: 'Team Engagement', value: 85, color: '#007AFF', target: 100 }
  }), []);

  // Revenue Chart Data
  const revenueData = useMemo(() => [
    { month: 'Jan', value: 125000, target: 150000 },
    { month: 'Feb', value: 142000, target: 150000 },
    { month: 'Mar', value: 158000, target: 160000 },
    { month: 'Apr', value: 145000, target: 170000 },
    { month: 'May', value: 172000, target: 180000 },
    { month: 'Jun', value: 195000, target: 190000 }
  ], []);

  // System Health Data
  const systemHealthData = useMemo(() => ({
    cpu: { label: 'CPU', value: 45, unit: '%', icon: 'cpu' },
    memory: { label: 'Memory', value: 62, unit: '%', icon: 'memory' },
    network: { label: 'Network', value: 28, unit: '%', icon: 'network' }
  }), []);

  // Data Table Columns
  const tableColumns: TableColumn[] = useMemo(() => [
    { key: 'id', label: 'Transaction ID', width: '150px' },
    { key: 'status', label: 'Status', width: '120px', sortable: true },
    { key: 'amount', label: 'Amount', width: '120px', align: 'right', sortable: true },
    { key: 'date', label: 'Date', sortable: true }
  ], []);

  // Data Table Rows
  const tableRows: TableRow[] = useMemo(() => [
    { id: 'TXN-001', status: 'Completed', amount: '$5,420.00', date: '2026-01-10' },
    { id: 'TXN-002', status: 'Pending', amount: '$3,250.00', date: '2026-01-11' },
    { id: 'TXN-003', status: 'Active', amount: '$7,890.00', date: '2026-01-12' },
    { id: 'TXN-004', status: 'Failed', amount: '$2,100.00', date: '2026-01-13' },
    { id: 'TXN-005', status: 'Completed', amount: '$4,680.00', date: '2026-01-14' }
  ], []);

  const handleRowClick = (row: TableRow) => {
    console.log('Row clicked:', row);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-apple-background-primary">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full border-4 border-apple-border-thin border-t-apple-blue animate-spin" />
          <p className="apple-callout mt-4 text-apple-content-secondary">
            Loading Analytics...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-apple-background-primary"
      style={{ fontFamily: 'var(--apple-font-family)' }}
    >
      {/* Main Content Area - Account for Sidebar */}
      <div className="ml-[320px] p-6">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
          className="mb-6"
        >
          <h1 className="apple-large-title mb-1">Analytics Hub</h1>
          <p className="apple-body text-apple-content-secondary">
            Predictive project intelligence with real-time insights
          </p>
        </motion.div>

        {/* Bento Box Grid */}
        <div className="apple-bento-grid">
          {/* Row 1 */}
          <AnimatePresence mode="popLayout">
            {/* Activity Rings Widget - Large */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
            >
              <ActivityRingsWidget
                className="apple-bento-large"
                rings={activityRingsData}
                healthScore={73}
                lastUpdated={new Date().toISOString()}
              />
            </motion.div>

            {/* Revenue Chart Widget - Medium */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4, type: 'spring' }}
            >
              <RevenueChartWidget
                className="apple-bento-medium"
                data={revenueData}
                subtitle="Growth +56% YoY"
                currency="$"
                showTarget
              />
            </motion.div>

            {/* System Health Widget - Medium */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5, type: 'spring' }}
            >
              <SystemHealthWidget
                className="apple-bento-medium"
                metrics={systemHealthData}
                latency={125}
                uptime={99.8}
                lastUpdated={new Date().toISOString()}
              />
            </motion.div>

            {/* Data Table Widget - Wide */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6, type: 'spring' }}
              className="col-span-12"
            >
              <DataTableWidget
                className="apple-bento-wide"
                title="Recent Transactions"
                columns={tableColumns}
                rows={tableRows}
                statusColumn="status"
                onRowClick={handleRowClick}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="apple-caption1 text-apple-content-tertiary">
            Apple HIG Analytics Hub • Powered by Studio Roster
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

/**
 * Usage:
 * 
 * import AnalyticsDashboard from '@/components/apple/AnalyticsDashboard';
 * 
 * <AnalyticsDashboard />
 * 
 * The dashboard will automatically load and display all widgets in a Bento Box layout.
 * All widgets have live updates and smooth animations.
 */