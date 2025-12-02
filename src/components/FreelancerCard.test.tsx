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

describe('FreelancerCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render freelancer information', () => {
        render(
            <BrowserRouter>
                <FreelancerCard freelancer={mockFreelancer} />
            </BrowserRouter>
        );

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Developer')).toBeInTheDocument();
        expect(screen.getByText(/\$150/)).toBeInTheDocument();
    });

    it('should display availability status badge', () => {
        render(
            <BrowserRouter>
                <FreelancerCard freelancer={mockFreelancer} />
            </BrowserRouter>
        );

        const badge = screen.getByText(/available/i);
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('text-state-success');
    });

    it('should show BUSY status with appropriate styling', () => {
        const busyFreelancer = { ...mockFreelancer, availability: 'BUSY' };

        render(
            <BrowserRouter>
                <FreelancerCard freelancer={busyFreelancer} />
            </BrowserRouter>
        );

        const badge = screen.getByText(/busy/i);
        expect(badge).toHaveClass('text-state-warning');
    });

    it('should display skills list', () => {
        render(
            <BrowserRouter>
                <FreelancerCard freelancer={mockFreelancer} />
            </BrowserRouter>
        );

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Node.js')).toBeInTheDocument();
    });

    it('should handle click to view details', async () => {
        const mockOnClick = vi.fn();

        render(
            <BrowserRouter>
                <FreelancerCard freelancer={mockFreelancer} onClick={mockOnClick} />
            </BrowserRouter>
        );

        const card = screen.getByText('John Doe').closest('div');
        await userEvent.click(card!);

        expect(mockOnClick).toHaveBeenCalledWith(mockFreelancer.id);
    });

    it('should show contact information on hover', async () => {
        render(
            <BrowserRouter>
                <FreelancerCard freelancer={mockFreelancer} showContact />
            </BrowserRouter>
        );

        expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should format rate correctly', () => {
        const expensiveFreelancer = { ...mockFreelancer, rate: 1500 };

        render(
            <BrowserRouter>
                <FreelancerCard freelancer={expensiveFreelancer} />
            </BrowserRouter>
        );

        expect(screen.getByText(/\$1,500/)).toBeInTheDocument();
    });

    it('should handle freelancer without skills', () => {
        const noSkillsFreelancer = { ...mockFreelancer, skills: [] };

        render(
            <BrowserRouter>
                <FreelancerCard freelancer={noSkillsFreelancer} />
            </BrowserRouter>
        );

        expect(screen.queryByText('React')).not.toBeInTheDocument();
    });
});
