import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImportWizard from './ImportWizard';
import * as api from '../services/api';

// Mock the API module
vi.mock('../services/api', () => ({
    api: {
        ai: {
            extract: vi.fn(),
        },
    },
}));

describe('ImportWizard', () => {
    const mockOnImport = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render initial state with upload options', () => {
        render(<ImportWizard onImport={mockOnImport} />);

        expect(screen.getByText('Data Ingestion Portal')).toBeDefined();
        expect(screen.getByText('Upload Binary')).toBeDefined();
        expect(screen.getByText('Raw Text Stream')).toBeDefined();
    });

    it('should handle file upload', async () => {
        const mockExtractedData = [
            { name: 'Project 1', client: 'Client A' },
            { name: 'Project 2', client: 'Client B' },
        ];

        vi.mocked(api.api.ai.extract).mockResolvedValue(mockExtractedData);

        render(<ImportWizard onImport={mockOnImport} />);

        const file = new File(['test content'], 'test.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const input = await waitFor(() => screen.getByLabelText('Select file'));
        await userEvent.upload(input, file);

        // Verify extraction was triggered
        await waitFor(() => {
            expect(api.api.ai.extract).toHaveBeenCalled();
        });

        // Check extracted data is displayed
        await waitFor(() => {
            expect(screen.getByText('Project 1')).toBeDefined();
            expect(screen.getByText('Project 2')).toBeDefined();
        });
    });

    it('should handle text paste extraction', async () => {
        const mockExtractedData = [
            { name: 'Pasted Project', client: 'Pasted Client' },
        ];

        vi.mocked(api.api.ai.extract).mockResolvedValue(mockExtractedData);

        render(<ImportWizard onImport={mockOnImport} />);

        // Switch to paste mode
        const pasteButton = screen.getByText('Raw Text Stream');
        await userEvent.click(pasteButton);

        const textarea = screen.getByPlaceholderText('// Paste raw unstructured text here...');
        await userEvent.type(textarea, 'Sample project data');

        const analyzeButton = screen.getByRole('button', { name: 'Initiate Analysis' });
        await userEvent.click(analyzeButton);

        await waitFor(() => {
            expect(api.api.ai.extract).toHaveBeenCalled();
            expect(screen.getByText('Pasted Project')).toBeDefined();
        });
    });

    it('should show loading state during extraction', async () => {
        vi.mocked(api.api.ai.extract).mockImplementation(() =>
            new Promise(() => { }) // Never resolves
        );

        render(<ImportWizard onImport={mockOnImport} />);

        const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
        const input = await waitFor(() => screen.getByLabelText('Select file'));
        await userEvent.upload(input, file);

        expect(screen.getByText(/processing/i)).toBeDefined();
    });

    it('should handle extraction errors', async () => {
        vi.mocked(api.api.ai.extract).mockRejectedValue(new Error('Extraction failed'));

        render(<ImportWizard onImport={mockOnImport} />);

        const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
        const input = await waitFor(() => screen.getByLabelText('Select file'));
        await userEvent.upload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeDefined();
        });
    });

    it('should allow navigation between steps', async () => {
        const mockExtractedData = [
            { name: 'Project 1', client: 'Client A' },
        ];

        vi.mocked(api.api.ai.extract).mockResolvedValue(mockExtractedData);

        render(<ImportWizard onImport={mockOnImport} />);

        // Upload file and extract
        const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
        const input = await waitFor(() => screen.getByLabelText('Select file'));
        await userEvent.upload(input, file);

        await waitFor(() => {
            expect(screen.getByText('Project 1')).toBeDefined();
        });

        // Navigate to next step
        const nextButton = screen.getByRole('button', { name: /next/i });
        await userEvent.click(nextButton);

        expect(screen.getByText(/confirm import/i)).toBeDefined();
    });

    it('should support different file types', async () => {
        vi.mocked(api.api.ai.extract).mockResolvedValue([]);

        render(<ImportWizard onImport={mockOnImport} />);

        const fileTypes = [
            { name: 'test.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
            { name: 'test.csv', type: 'text/csv' },
            { name: 'test.pdf', type: 'application/pdf' },
        ];

        for (const fileType of fileTypes) {
            vi.clearAllMocks();
            const file = new File(['content'], fileType.name, { type: fileType.type });
            const input = await waitFor(() => screen.getByLabelText('Select file'));
            await userEvent.upload(input, file);

            await waitFor(() => {
                expect(api.api.ai.extract).toHaveBeenCalled();
            });
        }
    });
});
