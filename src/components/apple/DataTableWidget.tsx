/**
 * Apple HIG Data Table Widget
 * 
 * Sophisticated data table with pill-shaped status badges
 * Rows separated by subtle hairlines, rounded rectangles
 * Subtle translucent header
 * 
 * Features:
 * - Pill-shaped colored badges for status
 * - Rounded rectangle row separation
 * - Subtle translucent header
 * - Sortable columns
 * - Hover effects
 * - Accessibility support
 * 
 * Architect: Senior Principal Designer (Apple)
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface TableRow {
  id: string;
  [key: string]: string | number | React.ReactNode;
}

export interface DataTableWidgetProps {
  columns: TableColumn[];
  rows: TableRow[];
  title?: string;
  className?: string;
  statusColumn?: string;
  emptyState?: React.ReactNode;
  onRowClick?: (row: TableRow) => void;
}

/**
 * Status Badge Component
 * Renders pill-shaped badge with color coding
 */
const StatusBadge: React.FC<{
  status: string;
}> = ({ status }) => {
  const getBadgeStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'completed' || s === 'active' || s === 'paid') {
      return 'apple-pill-success';
    }
    if (s === 'pending' || s === 'in progress' || s === 'processing') {
      return 'apple-pill-warning';
    }
    if (s === 'failed' || s === 'error' || s === 'overdue') {
      return 'apple-pill-danger';
    }
    return 'apple-pill-info';
  };

  return (
    <span className={`apple-pill ${getBadgeStyle(status)}`}>
      {status}
    </span>
  );
};

/**
 * Main Data Table Widget Component
 */
const DataTableWidget: React.FC<DataTableWidgetProps> = ({
  columns,
  rows,
  title = 'Recent Transactions',
  className = '',
  statusColumn,
  emptyState,
  onRowClick
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sort rows
  const sortedRows = useMemo(() => {
    if (!sortColumn) return rows;

    return [...rows].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal);
      const bStr = String(bVal);

      return sortDirection === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [rows, sortColumn, sortDirection]);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const getSortIndicator = (columnKey: string) => {
    if (sortColumn !== columnKey) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={`apple-widget ${className}`}>
      <div className="apple-widget-content">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="apple-title1">{title}</h2>
            <span className="apple-caption1 text-apple-content-tertiary">
              {rows.length} items
            </span>
          </div>
        </div>

        {/* Table Container */}
        {rows.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-8">
            {emptyState || (
              <div className="text-center">
                <span className="apple-body text-apple-content-tertiary">
                  No data available
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto">
            <table className="apple-table">
              {/* Header */}
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      style={{ width: column.width }}
                      className={`cursor-pointer ${column.sortable ? 'hover:bg-apple-background-tertiary' : ''}`}
                      onClick={() => column.sortable && handleSort(column.key)}
                      role="columnheader"
                      aria-sort={
                        sortColumn === column.key
                          ? sortDirection === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                    >
                      <div className="flex items-center gap-2">
                        <span>{column.label}</span>
                        {column.sortable && getSortIndicator(column.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                <AnimatePresence mode="popLayout">
                  {sortedRows.map((row) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className={`cursor-pointer transition-colors duration-200 hover:bg-apple-background-tertiary ${
                        onRowClick ? 'hover:bg-apple-background-tertiary' : ''
                      }`}
                      onClick={() => onRowClick?.(row)}
                      role="row"
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          style={{
                            textAlign: column.align || 'left'
                          }}
                        >
                          {/* Render status badge if this is the status column */}
                          {column.key === statusColumn && typeof row[column.key] === 'string' ? (
                            <StatusBadge status={row[column.key] as string} />
                          ) : (
                            row[column.key]
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTableWidget;

/**
 * Usage Example:
 * 
 * import DataTableWidget, { type TableColumn, type TableRow } from '@/components/apple/DataTableWidget';
 * 
 * const columns: TableColumn[] = [
 *   { key: 'id', label: 'Transaction ID', width: '150px' },
 *   { key: 'status', label: 'Status', width: '120px', sortable: true },
 *   { key: 'amount', label: 'Amount', width: '120px', align: 'right', sortable: true },
 *   { key: 'date', label: 'Date', sortable: true }
 * ];
 * 
 * const rows: TableRow[] = [
 *   { id: 'TXN-001', status: 'Completed', amount: '$5,420.00', date: '2026-01-10' },
 *   { id: 'TXN-002', status: 'Pending', amount: '$3,250.00', date: '2026-01-11' },
 *   { id: 'TXN-003', status: 'Active', amount: '$7,890.00', date: '2026-01-12' },
 *   { id: 'TXN-004', status: 'Failed', amount: '$2,100.00', date: '2026-01-13' }
 * ];
 * 
 * <DataTableWidget
 *   className="apple-bento-wide"
 *   title="Recent Transactions"
 *   columns={columns}
 *   rows={rows}
 *   statusColumn="status"
 *   onRowClick={(row) => console.log('Clicked:', row)}
 * />
 */