import type { FreelancerStatus, ProjectStatus } from '../services/types';

const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  PLANNED: 'Planned',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'In Review',
  DELIVERED: 'Delivered',
  ARCHIVED: 'Archived',
};

const FREELANCER_STATUS_LABELS: Record<FreelancerStatus, string> = {
  AVAILABLE: 'Available',
  BUSY: 'Busy',
  UNAVAILABLE: 'Unavailable',
};

const PROJECT_STATUS_STYLES: Record<ProjectStatus, string> = {
  PLANNED: 'bg-subtle text-ink-secondary border-border-subtle',
  IN_PROGRESS: 'bg-primary-tint text-primary border-primary/20',
  REVIEW: 'bg-state-warning-bg text-state-warning border-state-warning/30',
  DELIVERED: 'bg-state-success-bg text-state-success border-state-success/30',
  ARCHIVED: 'bg-subtle text-ink-tertiary border-border-subtle',
};

const FREELANCER_STATUS_STYLES: Record<FreelancerStatus, string> = {
  AVAILABLE: 'bg-state-success-bg text-state-success border-state-success/30',
  BUSY: 'bg-state-warning-bg text-state-warning border-state-warning/30',
  UNAVAILABLE: 'bg-subtle text-ink-tertiary border-border-subtle',
};

const normalizeProjectStatus = (status?: string): ProjectStatus => {
  if (!status) return 'PLANNED';
  const normalized = status.toUpperCase().replace(/\s+/g, '_');
  const allowed = Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[];
  return (allowed.includes(normalized as ProjectStatus) ? normalized : 'PLANNED') as ProjectStatus;
};

const normalizeFreelancerStatus = (status?: string): FreelancerStatus => {
  if (!status) return 'AVAILABLE';
  const normalized = status.toUpperCase().replace(/\s+/g, '_');
  const allowed = Object.keys(FREELANCER_STATUS_LABELS) as FreelancerStatus[];
  return (allowed.includes(normalized as FreelancerStatus) ? normalized : 'AVAILABLE') as FreelancerStatus;
};

export const getProjectStatusMeta = (status?: string) => {
  const normalized = normalizeProjectStatus(status);
  return {
    value: normalized,
    label: PROJECT_STATUS_LABELS[normalized],
    className: PROJECT_STATUS_STYLES[normalized],
  };
};

export const getFreelancerStatusMeta = (status?: string) => {
  const normalized = normalizeFreelancerStatus(status);
  return {
    value: normalized,
    label: FREELANCER_STATUS_LABELS[normalized],
    className: FREELANCER_STATUS_STYLES[normalized],
  };
};

export const PROJECT_STATUS_OPTIONS = (Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map(
  (status) => ({
    value: status,
    label: PROJECT_STATUS_LABELS[status],
  })
);

export const FREELANCER_STATUS_OPTIONS = (Object.keys(
  FREELANCER_STATUS_LABELS
) as FreelancerStatus[]).map((status) => ({
  value: status,
  label: FREELANCER_STATUS_LABELS[status],
}));
