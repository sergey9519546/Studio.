import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import App from '../App';

describe('App', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
