import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import FreelancerCard from '../../components/FreelancerCard';

const mockFreelancer = {
    id: '1',
    name: 'John Doe',
    role: 'Developer',
    rate: 150,
    availability: 'AVAILABLE',
    skills: ['React', 'TypeScript', 'Node.js'],
    email: 'john@example.com',
};

const routerFuture = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
};

const renderWithRouter = (ui: React.ReactElement) =>
    render(<BrowserRouter future={routerFuture}>{ui}</BrowserRouter>);

describe('FreelancerCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render freelancer information', () => {
        renderWithRouter(<FreelancerCard freelancer={mockFreelancer} />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Developer')).toBeInTheDocument();
        expect(screen.getByText(/\$150/)).toBeInTheDocument();
    });

    it('should display availability status badge', () => {
        renderWithRouter(<FreelancerCard freelancer={mockFreelancer} />);

        const badge = screen.getByText(/available/i);
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('text-state-success');
    });

    it('should show BUSY status with appropriate styling', () => {
        const busyFreelancer = { ...mockFreelancer, availability: 'BUSY' };

        renderWithRouter(<FreelancerCard freelancer={busyFreelancer} />);

        const badge = screen.getByText(/busy/i);
        expect(badge).toHaveClass('text-state-warning');
    });

    it('should display skills list', () => {
        renderWithRouter(<FreelancerCard freelancer={mockFreelancer} />);

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Node.js')).toBeInTheDocument();
    });

    it('should handle click to view details', async () => {
        const mockOnClick = vi.fn();

        renderWithRouter(<FreelancerCard freelancer={mockFreelancer} onClick={mockOnClick} />);

        const card = screen.getByText('John Doe').closest('div');
        await userEvent.click(card!);

        expect(mockOnClick).toHaveBeenCalledWith(mockFreelancer.id);
    });

    it('should show contact information on hover', async () => {
        renderWithRouter(<FreelancerCard freelancer={mockFreelancer} showContact />);

        expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should format rate correctly', () => {
        const expensiveFreelancer = { ...mockFreelancer, rate: 1500 };

        renderWithRouter(<FreelancerCard freelancer={expensiveFreelancer} />);

        expect(screen.getByText(/\$1,500/)).toBeInTheDocument();
    });

    it('should handle freelancer without skills', () => {
        const noSkillsFreelancer = { ...mockFreelancer, skills: [] };

        renderWithRouter(<FreelancerCard freelancer={noSkillsFreelancer} />);

        expect(screen.queryByText('React')).not.toBeInTheDocument();
    });
});
