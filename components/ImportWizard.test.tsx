import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
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

        expect(screen.getByText('Import Data')).toBeInTheDocument();
        expect(screen.getByText('Upload File')).toBeInTheDocument();
        expect(screen.getByText('Paste Text')).toBeInTheDocument();
    });

    it('should handle file upload', async () => {
        vi.mocked(api.api.ai.extract).mockResolvedValue([{ name: 'test' }]);
        render(<ImportWizard onImport={mockOnImport} />);
        const file = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const input = screen.getByLabelText('Select file');
        await userEvent.upload(input, file);
        await waitFor(() => {
            expect(api.api.ai.extract).toHaveBeenCalled();
            expect(screen.getByText('test')).toBeInTheDocument();
        });
    });

    it('should handle text paste extraction', async () => {
        vi.mocked(api.api.ai.extract).mockResolvedValue([{ name: 'test' }]);
        render(<ImportWizard onImport={mockOnImport} />);
        await userEvent.click(screen.getByText('Paste Text'));
        const pasteArea = screen.getByLabelText('Paste your data');
        await userEvent.paste(pasteArea, 'test');
        await userEvent.click(screen.getByLabelText('Analyze'));
        await waitFor(() => {
            expect(api.api.ai.extract).toHaveBeenCalled();
            expect(screen.getByText('test')).toBeInTheDocument();
        });
    });

    it('should show loading state during extraction', async () => {
        let resolve: (value: unknown) => void;
        const promise = new Promise((r) => (resolve = r));
        vi.mocked(api.api.ai.extract).mockImplementation(async () => {
            await promise;
            return [];
        });

        render(<ImportWizard onImport={mockOnImport} />);

        const file = new File(['test content'], 'test.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const input = screen.getByLabelText('Select file');
        await act(async () => {
            await userEvent.upload(input, file);
        });

        await waitFor(() => {
            expect(screen.getByText(/Processing/i)).toBeInTheDocument();
        });

        await act(async () => {
            resolve!({});
        });
    });

    it('should handle extraction errors', async () => {
        vi.mocked(api.api.ai.extract).mockRejectedValue(
            new Error('Extraction failed')
        );

        render(<ImportWizard onImport={mockOnImport} />);

        const file = new File(['test content'], 'test.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const input = screen.getByLabelText('Select file');
        await userEvent.upload(input, file);

        await waitFor(() => {
            expect(screen.getByText(/Error/i)).toBeInTheDocument();
        });
    });

    it('should allow navigation between steps', async () => {
        vi.mocked(api.api.ai.extract).mockResolvedValue([{ name: 'test' }]);
        render(<ImportWizard onImport={mockOnImport} />);

        // Upload file and extract
        const file = new File(['test content'], 'test.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const input = screen.getByLabelText('Select file');
        await userEvent.upload(input, file);

        await waitFor(() => {
            expect(screen.getByText('test')).toBeInTheDocument();
        });

        await userEvent.click(screen.getByText('Next'));

        expect(screen.getByText('Confirm import')).toBeInTheDocument();
    });

    it('should support different file types', async () => {
        vi.mocked(api.api.ai.extract).mockResolvedValue([]);

        render(<ImportWizard onImport={mockOnImport} />);

        const fileTypes = [
            {
                name: 'test.xlsx',
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
            { name: 'test.csv', type: 'text/csv' },
            { name: 'test.pdf', type: 'application/pdf' },
        ];

        for (const fileType of fileTypes) {
            vi.clearAllMocks();
            const file = new File(['content'], fileType.name, { type: fileType.type });
            const input = screen.getByLabelText('Select file');
            await userEvent.upload(input, file);

            await waitFor(() => {
                expect(api.api.ai.extract).toHaveBeenCalled();
            });
        }
    });
});
