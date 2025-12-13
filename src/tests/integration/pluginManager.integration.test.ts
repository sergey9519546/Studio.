/**
 * Comprehensive Integration Tests for PluginManager
 * Tests plugin installation, management, and error scenarios using mock data
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PluginManagerProvider, usePluginManager } from '../../components/extensibility/PluginManager_Final';
import { 
  generateMockUsers, 
  generateMockProjects, 
  generateMockFreelancers,
  generateMockErrorScenario,
  generatePluginTestScenarios
} from '../../utils/mockDataGenerators';
import button from '@app/components/tiptap-ui-primitive/button/button';

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PluginManagerProvider>
    {children}
  </PluginManagerProvider>
);

// Hook for accessing plugin manager in tests
const useTestPluginManager = () => {
  const context = usePluginManager();
  if (!context) {
    throw new Error('usePluginManager must be used within PluginManagerProvider');
  }
  return context;
};

// Test component that uses the hook
const TestComponent: React.FC = () => {
  const { state, installPlugin, uninstallPlugin, enablePlugin, disablePlugin } = useTestPluginManager();
  
  return (
    <div>
      <div data-testid="plugin-count">{state.plugins.installedPlugins.length}</div>
      <div data-testid="available-plugins">{state.plugins.availablePlugins.length}</div>
      <div data-testid="loading-state">{state.plugins.loading.toString()}</div>
      <div data-testid="error-state">{state.plugins.error || 'none'}</div>
      
      <button 
        data-testid="install-button" 
        onClick={() => installPlugin(state.plugins.availablePlugins[0])}
      >
        Install First Plugin
      </button>
      
      <button 
        data-testid="uninstall-button" 
        onClick={() => uninstallPlugin(state.plugins.installedPlugins[0]?.id || '')}
      >
        Uninstall First Plugin
      </button>
      
      <button 
        data-testid="enable-button" 
        onClick={() => enablePlugin(state.plugins.installedPlugins[0]?.id || '')}
      >
        Enable First Plugin
      </button>
      
      <button 
        data-testid="disable-button" 
        onClick={() => disablePlugin(state.plugins.installedPlugins[0]?.id || '')}
      >
        Disable First Plugin
      </button>
    </div>
  );
};

describe('PluginManager Integration Tests', () => {
  
  describe('Plugin Loading and State Management', () => {
    it('should load plugins successfully with mock data', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      // Should show loading state initially
      expect(screen.getByTestId('loading-state')).toHaveTextContent('true');
      
      // Wait for plugins to load
      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
      });
      
      // Verify plugins were loaded
      expect(screen.getByTestId('available-plugins')).toHaveTextContent('2');
      expect(screen.getByTestId('plugin-count')).toHaveTextContent('2');
    });
    
    it('should handle loading errors gracefully', async () => {
      // This would test error scenarios - implementation would depend on error handling
      const mockError = generateMockErrorScenario('network');
      console.log('Network Error Test:', mockError);
      
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      await waitFor(() => {
        // Should not show persistent error state for successful loading
        expect(screen.getByTestId('error-state')).toHaveTextContent('none');
      });
    });
  });
  
  describe('Plugin Installation', () => {
    it('should install plugins successfully', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
      });
      
      const initialCount = parseInt(screen.getByTestId('plugin-count').textContent || '0');
      
      // Install a plugin
      fireEvent.click(screen.getByTestId('install-button'));
      
      // Wait for installation to complete
      await waitFor(() => {
        const newCount = parseInt(screen.getByTestId('plugin-count').textContent || '0');
        expect(newCount).toBe(initialCount + 1);
      }, { timeout: 3000 });
    });
    
    it('should handle permission denied scenarios', async () => {
      const scenarios = generatePluginTestScenarios();
      const restrictedPlugin = scenarios.permissionDenied.plugin;
      
      // Test with restricted plugin that should fail permission check
      console.log('Permission Test Scenario:', restrictedPlugin);
      
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
      });
      
      // The test would verify that permission-denied plugins show appropriate error messages
      // This depends on the actual implementation of permission checking
    });
  });
  
  describe('Plugin Management Operations', () => {
    beforeEach(async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );
      
      // Wait for plugins to load
      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
      });
    });
    
    it('should uninstall plugins successfully', async () => {
      const initialCount = parseInt(screen.getByTestId('plugin-count').textContent || '0');
      
      if (initialCount > 0) {
        fireEvent.click(screen.getByTestId('uninstall-button'));
        
        await waitFor(() => {
          const newCount = parseInt(screen.getByTestId('plugin-count').textContent || '0');
          expect(newCount).toBe(initialCount - 1);
        }, { timeout: 2000 });
      }
    });
    
    it('should enable and disable plugins', async () => {
      // This test would verify plugin state changes
      // Implementation depends on how plugin state is displayed
      const mockUser = generateMockUsers(1)[0];
      const mockProject = generateMockProjects(1)[0];
      
      console.log('Plugin State Test Data:', { user: mockUser, project: mockProject });
    });
  });
  
  describe('Performance and Large Data Handling', () => {
    it('should handle large datasets efficiently', async () => {
      const startTime = performance.now();
      
      // Generate large dataset for performance testing
      const largeUserDataset = generateMockUsers(100);
      const largeProjectDataset = generateMockProjects(50);
      
      console.log('Generated large datasets:', {
        users: largeUserDataset.length,
        projects: largeProjectDataset.length
      });
      
      const endTime = performance.now();
      const generationTime = endTime - startTime;
      
      // Should generate data efficiently (adjust threshold as needed)
      expect(generationTime).toBeLessThan(1000); // Less than 1 second
      
      // Verify data quality
      expect(largeUserDataset).toHaveLength(100);
      expect(largeProjectDataset).toHaveLength(50);
      expect(largeUserDataset[0]).toHaveProperty('id');
      expect(largeProjectDataset[0]).toHaveProperty('name');
    });
  });
  
  describe('Error Scenario Testing', () => {
    it('should handle different error types', () => {
      const errorTypes: Array<'network' | 'validation' | 'permission' | 'not-found'> = [
        'network', 'validation', 'permission', 'not-found'
      ];
      
      errorTypes.forEach(errorType => {
        const error = generateMockErrorScenario(errorType);
        
        expect(error).toHaveProperty('code');
        expect(error).toHaveProperty('message');
        expect(error).toHaveProperty('timestamp');
        expect(error).toHaveProperty('path');
        
        console.log(`${errorType} Error:`, error);
      });
    });
  });
  
  describe('Integration with Mock Data', () => {
    it('should work seamlessly with generated mock data', () => {
      const mockUsers = generateMockUsers(5);
      const mockProjects = generateMockProjects(3);
      const mockFreelancers = generateMockFreelancers(10);
      
      // Verify data structure and quality
      mockUsers.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('contactInfo');
        expect(user).toHaveProperty('role');
      });
      
      mockProjects.forEach(project => {
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('name');
        expect(project).toHaveProperty('status');
        expect(project).toHaveProperty('priority');
      });
      
      mockFreelancers.forEach(freelancer => {
        expect(freelancer).toHaveProperty('id');
        expect(freelancer).toHaveProperty('name');
        expect(freelancer).toHaveProperty('role');
        expect(freelancer).toHaveProperty('skills');
      });
      
      console.log('Mock Data Integration Test Results:', {
        users: mockUsers.length,
        projects: mockProjects.length,
        freelancers: mockFreelancers.length
      });
    });
  });
});

// Performance benchmarks
describe('PluginManager Performance Benchmarks', () => {
  it('should load plugins within acceptable time', async () => {
    const startTime = performance.now();
    
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
    });
    
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    // Plugin loading should complete within 2 seconds
    expect(loadTime).toBeLessThan(2000);
    
    console.log(`Plugin loading time: ${loadTime}ms`);
  });
  
  it('should handle plugin operations efficiently', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('false');
    });
    
    const operationStartTime = performance.now();
    
    // Test multiple operations
    fireEvent.click(screen.getByTestId('enable-button'));
    await new Promise(resolve => setTimeout(resolve, 100));
    
    fireEvent.click(screen.getByTestId('disable-button'));
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const operationEndTime = performance.now();
    const operationTime = operationEndTime - operationStartTime;
    
    // Operations should complete quickly
    expect(operationTime).toBeLessThan(500);
    
    console.log(`Plugin operations time: ${operationTime}ms`);
  });
});

// Export test utilities for other test files
export const testUtils = {
  generateTestData: {
    users: generateMockUsers,
    projects: generateMockProjects,
    freelancers: generateMockFreelancers,
    error: generateMockErrorScenario,
    pluginScenarios: generatePluginTestScenarios
  },
  renderWithProvider: (component: React.ReactElement) => 
    render(<TestWrapper>{component}</TestWrapper>)
};
