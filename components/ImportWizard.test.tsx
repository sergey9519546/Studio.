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

// Mock file reader
global.FileReader = class FileReader {
    readAsText() {
        if (this.onload) {
            this.onload({ target: { result: 'mock file content' } } as any);
        }
    }
} as any;

describe('ImportWizard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render initial state with upload options', () => {
        render(<ImportWizard />);

        expect(screen.getByText(/import data/i)).toBeInTheDocument();
        expect(screen.getByText(/upload file/i)).toBeInTheDocument();
        expect(screen.getByText(/paste text/i)).toBeInTheDocument();
    });

    it('should handle file upload', async () => {
        const mockExtractedData = [
            { name: 'Project 1', client: 'Client A' },
            { name: 'Project 2', client: 'Client B' },
        ];

        vi.mocked(api.api.ai.extract).mockResolvedValue(mockExtractedData);

        render(<ImportWizard />);

        const file = new File(['test content'], 'test.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const input = screen.getByLabelText(/upload file/i);
        await userEvent.upload(input, file);

        // Verify extraction was triggered
        await waitFor(() => {
            expect(api.api.ai.extract).toHaveBeenCalled();
        });

        // Check extracted data is displayed
        await waitFor(() => {
            expect(screen.getByText('Project 1')).toBeInTheDocument();
            expect(screen.getByText('Project 2')).toBeInTheDocument();
        });
    });

    it('should handle text paste extraction', async () => {
        const mockExtractedData = [
            { name: 'Pasted Project', client: 'Pasted Client' },
        ];

        vi.mocked(api.api.ai.extract).mockResolvedValue(mockExtractedData);

        render(<ImportWizard />);

        // Switch to paste mode
        const pasteButton = screen.getByText(/paste text/i);
        await userEvent.click(pasteButton);

        const textarea = screen.getByPlaceholderText(/paste your data/i);
        await userEvent.type(textarea, 'Sample project data');

        const analyzeButton = screen.getByRole('button', { name: /analyze/i });
        await userEvent.click(analyzeButton);

        await waitFor(() => {
            expect(api.api.ai.extract).toHaveBeenCalled();
            expect(screen.getByText('Pasted Project')).toBeInTheDocument();
        });
    });

    it('should show loading state during extraction', async () => {
        vi.mocked(api.api.ai.extract).mockImplementation(() =>
            new Promise(() => { }) // Never resolves
        );

        render(<ImportWizard />);

        const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
        const input = screen.getByLabelText(/upload file/i);
        await userEvent.upload(input, file);

        expect(screen.getByText(/processing/i)).toBeInTheDocument();
    });

    it('should handle extraction errors', async () => {
        vi.mocked(api.api.ai.extract).mockRejectedValue(new Error('Extraction failed'));

        render(<ImportWizard />);

        const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
        const input = screen.getByLabelText(/upload file/i);
        await userEvent.upload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
        });
    });

    it('should allow navigation between steps', async () => {
        const mockExtractedData = [
            { name: 'Project 1', client: 'Client A' },
        ];

        vi.mocked(api.api.ai.extract).mockResolvedValue(mockExtractedData);

        render(<ImportWizard />);

        // Upload file and extract
        const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
        const input = screen.getByLabelText(/upload file/i);
        await userEvent.upload(input, file);

        await waitFor(() => {
            expect(screen.getByText('Project 1')).toBeInTheDocument();
        });

        // Navigate to next step
        const nextButton = screen.getByRole('button', { name: /next/i });
        await userEvent.click(nextButton);

        expect(screen.getByText(/confirm import/i)).toBeInTheDocument();
    });

    it('should support different file types', async () => {
        vi.mocked(api.api.ai.extract).mockResolvedValue([]);

        render(<ImportWizard />);

        const fileTypes = [
            { name: 'test.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
            { name: 'test.csv', type: 'text/csv' },
            { name: 'test.pdf', type: 'application/pdf' },
        ];

        for (const fileType of fileTypes) {
            vi.clearAllMocks();
            const file = new File(['content'], fileType.name, { type: fileType.type });
            const input = screen.getByLabelText(/upload file/i);
            await userEvent.upload(input, file);

            await waitFor(() => {
                expect(api.api.ai.extract).toHaveBeenCalled();
            });
        }
    });
});
