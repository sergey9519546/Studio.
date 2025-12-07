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


});
