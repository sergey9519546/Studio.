import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ProjectList from '../../components/ProjectList';
import * as api from '../../services/api';
import { ApiResponse, Project, ProjectStatus, Priority } from '../../types';

// Mock the API module
vi.mock('../../services/api', () => ({
    api: {
        projects: {
            list: vi.fn(),
        },
    },
}));

const mockProjects: Project[] = [
    { id: '1', name: 'Project Alpha', clientName: 'Client A', dueDate: '2025-12-31', roleRequirements: [], status: ProjectStatus.PLANNED, priority: Priority.NORMAL },
    { id: '2', name: 'Project Beta', clientName: 'Client B', dueDate: '2025-11-30', roleRequirements: [], status: ProjectStatus.IN_PROGRESS, priority: Priority.HIGH },
];

const mockProjectsResponse: ApiResponse<Project[]> = {
    success: true,
    data: mockProjects,
    meta: { total: 25, page: 1, limit: 10, totalPages: 3 },
};

const routerFuture = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
};

const renderWithRouter = (ui: React.ReactElement) =>
    render(<BrowserRouter future={routerFuture}>{ui}</BrowserRouter>);

describe('ProjectList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render project list with data', async () => {
        vi.mocked(api.api.projects.list).mockResolvedValue(mockProjectsResponse);

        renderWithRouter(<ProjectList />);

        // Wait for projects to load
        await waitFor(() => {
            expect(screen.getByText('Project Alpha')).toBeInTheDocument();
            expect(screen.getByText('Project Beta')).toBeInTheDocument();
        });

        expect(screen.getByText('Client A')).toBeInTheDocument();
        expect(screen.getByText('Client B')).toBeInTheDocument();
    });

    it('should display loading state initially', () => {
        vi.mocked(api.api.projects.list).mockImplementation(() =>
            new Promise(() => { }) // Never resolves
        );

        renderWithRouter(<ProjectList />);

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should handle pagination controls', async () => {
        vi.mocked(api.api.projects.list).mockResolvedValue(mockProjectsResponse);

        renderWithRouter(<ProjectList />);

        await waitFor(() => {
            expect(screen.getByText('Project Alpha')).toBeInTheDocument();
        });

        // Check pagination controls are rendered
        const nextButton = screen.getByRole('button', { name: /next/i });
        expect(nextButton).toBeInTheDocument();

        // Click next page
        await userEvent.click(nextButton);

        // Verify API was called with page 2
        await waitFor(() => {
            expect(api.api.projects.list).toHaveBeenCalledWith({ page: 2, limit: 10 });
        });
    });

    it('should handle API errors gracefully', async () => {
        vi.mocked(api.api.projects.list).mockRejectedValue(new Error('API Error'));
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        renderWithRouter(<ProjectList />);

        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
        });

        errorSpy.mockRestore();
    });

    it('should display empty state when no projects', async () => {
        vi.mocked(api.api.projects.list).mockResolvedValue({
            success: true,
            data: [],
            meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
        } as ApiResponse<Project[]>);

        renderWithRouter(<ProjectList />);

        await waitFor(() => {
            expect(screen.getByText(/no projects/i)).toBeInTheDocument();
        });
    });

    it('should navigate to project details on click', async () => {
        vi.mocked(api.api.projects.list).mockResolvedValue(mockProjectsResponse);

        renderWithRouter(<ProjectList />);

        await waitFor(() => {
            expect(screen.getByText('Project Alpha')).toBeInTheDocument();
        });

        const projectLink = screen.getByText('Project Alpha');
        expect(projectLink.closest('a')).toHaveAttribute('href', '/projects/1');
    });
});
