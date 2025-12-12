import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../components/Dashboard';
import * as api from '../../services/api';

import { ApiResponse, Project, Freelancer, Assignment } from '../../types';

// Mock the API service
vi.mock('../../services/api', () => ({
  api: {
    projects: {
      list: vi.fn(),
    },
    freelancers: {
      list: vi.fn(),
    },
    assignments: {
      list: vi.fn(),
    },
  },
}));

const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter future={routerFuture}>{ui}</BrowserRouter>);

describe('Dashboard', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock successful API responses
    vi.mocked(api.api.projects.list).mockResolvedValue({
      success: true,
      data: Array(12).fill({}) as Project[],
    } as ApiResponse<Project[]>);
    vi.mocked(api.api.freelancers.list).mockResolvedValue({
      success: true,
      data: Array(25).fill({}) as Freelancer[],
    } as ApiResponse<Freelancer[]>);
    vi.mocked(api.api.assignments.list).mockResolvedValue({
      success: true,
      data: Array(8).fill({}) as Assignment[],
    } as ApiResponse<Assignment[]>);
  });

    it('should render dashboard statistics', async () => {
        renderWithRouter(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText(/12.*projects/i)).toBeInTheDocument();
            expect(screen.getByText(/25.*freelancers/i)).toBeInTheDocument();
            expect(screen.getByText(/8.*active assignments/i)).toBeInTheDocument();
        });
    });

    it('should display recent activity section', async () => {
        renderWithRouter(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
        });
    });

    it('should show loading state initially', () => {
        vi.mocked(api.api.projects.list).mockImplementation(
            () => new Promise(() => { }) // Never resolves
        );

        renderWithRouter(<Dashboard />);

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should navigate to projects page', async () => {
        renderWithRouter(<Dashboard />);

        await waitFor(() => {
            const viewProjectsLink = screen.getByText(/view all projects/i);
            expect(viewProjectsLink.closest('a')).toHaveAttribute('href', '/projects');
        });
    });

    it('should navigate to freelancers page', async () => {
        renderWithRouter(<Dashboard />);

        await waitFor(() => {
            const viewFreelancersLink = screen.getByText(/view all freelancers/i);
            expect(viewFreelancersLink.closest('a')).toHaveAttribute('href', '/freelancers');
        });
    });

    it('should handle API errors gracefully', async () => {
        vi.mocked(api.api.projects.list).mockRejectedValue(new Error('API Error'));
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        renderWithRouter(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText(/error loading dashboard/i)).toBeInTheDocument();
        });

        errorSpy.mockRestore();
    });

    it('should display stats cards with correct styling', async () => {
        renderWithRouter(<Dashboard />);

        await waitFor(() => {
            const stats = screen.getAllByRole('article');
            expect(stats.length).toBeGreaterThan(0);
            stats.forEach(stat => {
                expect(stat).toHaveClass('bg-surface');
            });
        });
    });

    it('should show quick actions section', async () => {
        renderWithRouter(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText(/new project/i)).toBeInTheDocument();
            expect(screen.getByText(/import data/i)).toBeInTheDocument();
        });
    });
});
