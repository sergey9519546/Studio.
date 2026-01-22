import { describe, it, expect } from 'vitest';
import { getProjectStatusMeta } from './status';
import { ProjectStatus } from '../services/types';

describe('getProjectStatusMeta', () => {
  it('should return the correct meta for PLANNED', () => {
    const meta = getProjectStatusMeta(ProjectStatus.PLANNED);
    expect(meta).toEqual({ label: 'Planned', color: 'gray' });
  });

  it('should return the correct meta for IN_PROGRESS', () => {
    const meta = getProjectStatusMeta(ProjectStatus.IN_PROGRESS);
    expect(meta).toEqual({ label: 'In Progress', color: 'blue' });
  });

  it('should return the correct meta for REVIEW', () => {
    const meta = getProjectStatusMeta(ProjectStatus.REVIEW);
    expect(meta).toEqual({ label: 'In Review', color: 'purple' });
  });

  it('should return the correct meta for DELIVERED', () => {
    const meta = getProjectStatusMeta(ProjectStatus.DELIVERED);
    expect(meta).toEqual({ label: 'Delivered', color: 'green' });
  });

  it('should return the correct meta for ARCHIVED', () => {
    const meta = getProjectStatusMeta(ProjectStatus.ARCHIVED);
    expect(meta).toEqual({ label: 'Archived', color: 'gray' });
  });

  it('should return a default meta for an unknown status', () => {
    const meta = getProjectStatusMeta('unknown' as ProjectStatus);
    expect(meta).toEqual({ label: 'Unknown', color: 'gray' });
  });
});
