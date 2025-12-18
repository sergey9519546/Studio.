/**
 * PluginManagerUI - Main plugin management interface
 * Provides dashboard for plugin installation, configuration, and monitoring
 */

import {
    AlertCircle,
    CheckCircle,
    Clock,
    Download,
    Pause,
    Play,
    Plug,
    Search,
    Settings,
    Shield,
    Star,
    Trash2,
    Zap
} from 'lucide-react';
import React, { useState } from "react";
import { Button } from "../design/Button";
import type { Plugin } from "../extensibility/PluginManager";
import { usePluginManager } from "../extensibility/PluginManager";

interface PluginManagerUIProps {
  onClose?: () => void;
}

export const PluginManagerUI: React.FC<PluginManagerUIProps> = ({ onClose }) => {
  const {
    state,
    installPlugin,
    uninstallPlugin,
    enablePlugin,
    disablePlugin
  } = usePluginManager();

  const [viewMode, setViewMode] = useState<'installed' | 'available'>('installed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const plugins = viewMode === 'installed' 
    ? state.plugins.installedPlugins 
    : state.plugins.availablePlugins;

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'ui-enhancement', 'data-analysis', 'integration', 'visualization', 'productivity', 'development'];

  const getStatusColor = (plugin: Plugin) => {
    if (plugin.enabled) return 'text-green-600';
    if (plugin.lifecycle?.state === 'loading') return 'text-blue-600';
    if (plugin.lifecycle?.state === 'error') return 'text-red-600';
    return 'text-gray-600';
  };

  const getStatusIcon = (plugin: Plugin) => {
    if (plugin.enabled) return <CheckCircle size={16} className="text-green-600" />;
    if (plugin.lifecycle?.state === 'loading') return <Clock size={16} className="text-blue-600" />;
    if (plugin.lifecycle?.state === 'error') return <AlertCircle size={16} className="text-red-600" />;
    return <Plug size={16} className="text-gray-600" />;
  };

  if (state.plugins.loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ink-secondary">Loading plugins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border-subtle">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Plug size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink-primary">Plugin Manager</h2>
              <p className="text-sm text-ink-secondary">
                Manage {state.plugins.installedPlugins.length} installed plugins
              </p>
            </div>
          </div>
          <Button onClick={onClose} variant="outline" size="sm">
            Close
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex bg-subtle rounded-lg p-1">
            <button
              onClick={() => setViewMode('installed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'installed'
                  ? 'bg-white text-ink-primary shadow-sm'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              Installed ({state.plugins.installedPlugins.length})
            </button>
            <button
              onClick={() => setViewMode('available')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'available'
                  ? 'bg-white text-ink-primary shadow-sm'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              Available ({state.plugins.availablePlugins.length})
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex-1 relative">
            <Search sizeName="absolute left={16} class-3 top-1/2 transform -translate-y-1/2 text-ink-secondary" />
            <input
              type="text"
              placeholder="Search plugins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-subtle border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-subtle border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Plugin List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredPlugins.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-subtle rounded-xl flex items-center justify-center mx-auto mb-4">
              <Plug size={24} className="text-ink-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-ink-primary mb-2">No plugins found</h3>
            <p className="text-ink-secondary">
              {searchQuery ? 'Try adjusting your search or filters' : 'No plugins available in this category'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPlugins.map((plugin) => (
              <div
                key={plugin.id}
                className="bg-white rounded-xl border border-border-subtle p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <Zap size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-ink-primary">{plugin.name}</h3>
                        {getStatusIcon(plugin)}
                        <span className={`text-sm ${getStatusColor(plugin)}`}>
                          {plugin.enabled ? 'Active' : plugin.lifecycle?.state || 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-ink-secondary mb-2">{plugin.description}</p>
                      <div className="flex items-center gap-4 text-xs text-ink-tertiary">
                        <span>v{plugin.version}</span>
                        <span>by {plugin.author}</span>
                        {plugin.metadata?.rating && (
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-500" />
                            <span>{plugin.metadata.rating}</span>
                          </div>
                        )}
                        {plugin.metadata?.downloads && (
                          <div className="flex items-center gap-1">
                            <Download size={12} />
                            <span>{plugin.metadata.downloads.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {viewMode === 'installed' ? (
                      <>
                        <Button
                          onClick={() => plugin.enabled ? disablePlugin(plugin.id) : enablePlugin(plugin.id)}
                          size="sm"
                          variant={plugin.enabled ? "outline" : "default"}
                        >
                          {plugin.enabled ? <Pause size={16} /> : <Play size={16} />}
                          {plugin.enabled ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          onClick={() => uninstallPlugin(plugin.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => installPlugin(plugin)}
                        size="sm"
                        disabled={plugin.installed}
                      >
                        <Download size={16} />
                        {plugin.installed ? 'Installed' : 'Install'}
                      </Button>
                    )}
                    <Button
                      onClick={() => setShowDetails(showDetails === plugin.id ? null : plugin.id)}
                      size="sm"
                      variant="outline"
                    >
                      <Settings size={16} />
                    </Button>
                  </div>
                </div>

                {/* Plugin Details */}
                {showDetails === plugin.id && (
                  <div className="mt-4 pt-4 border-t border-border-subtle">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-ink-primary mb-2">Information</h4>
                        <div className="space-y-1 text-ink-secondary">
                          <p><span className="font-medium">Category:</span> {plugin.category}</p>
                          <p><span className="font-medium">Version:</span> {plugin.version}</p>
                          <p><span className="font-medium">Size:</span> {plugin.metadata?.size ? `${(plugin.metadata.size / 1024).toFixed(1)} KB` : 'N/A'}</p>
                          {plugin.metadata?.installationDate && (
                            <p><span className="font-medium">Installed:</span> {new Date(plugin.metadata.installationDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-ink-primary mb-2">Permissions</h4>
                        <div className="space-y-1">
                          {plugin.permissions.map((permission, index) => (
                            <div key={index} className="flex items-center gap-2 text-ink-secondary">
                              <Shield size={12} className={permission.granted ? 'text-green-500' : 'text-red-500'} />
                              <span className="text-xs">{permission.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {plugin.metadata?.tags && (
                      <div className="mt-3">
                        <h4 className="font-medium text-ink-primary mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {plugin.metadata.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-subtle text-ink-secondary text-xs rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Display */}
      {state.plugins.error && (
        <div className="p-4 bg-red-50 border-t border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={16} />
            <span className="text-sm font-medium">Error:</span>
            <span className="text-sm">{state.plugins.error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PluginManagerUI;
