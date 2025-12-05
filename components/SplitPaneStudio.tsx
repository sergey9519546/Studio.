/**
 * Split-Pane Writer's Room - 3-Column Layout
 * Phase 4: Professional Creative Workspace
 */

import { Database, FileText, LayoutList, Sparkles, Users } from 'lucide-react';
import React from 'react';
import Split from 'react-split';
import { Project } from '../types';
import AIChat from './AIChat';
import ProseMirrorEditor from './editor/ProseMirrorEditor';

interface SplitPaneStudioProps {
  projects: Project[];
  selectedProjectId?: string;
  onSelectProject: (id: string) => void;
  scriptContent: string;
  onContentChange: (content: string) => void;
  onSave: () => Promise<void>;
  onEnhance: (content: string) => Promise<string>;
}

export const SplitPaneStudio: React.FC<SplitPaneStudioProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  scriptContent,
  onContentChange,
  onSave,
  onEnhance
}) => {
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="h-full flex flex-col bg-app">
      {/* Header */}
      <div className="h-14 border-b border-border-subtle bg-white flex items-center px-6 justify-between">
        <h1 className="text-lg font-bold text-ink-primary">Writer's Room</h1>
        
        {/* Project Selector */}
        <select
          value={selectedProjectId || ''}
          onChange={(e) => onSelectProject(e.target.value)}
          className="px-4 py-2 border border-border-subtle rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
        >
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>

      {/* 3-Pane Split Layout */}
      <div className="flex-1 overflow-hidden">
        <Split
          sizes={[20, 55, 25]}
          minSize={[200, 400, 250]}
          gutterSize={8}
          className="flex h-full"
          style={{ display: 'flex' }}
        >
          {/* Left Pane: Project Context */}
          <div className="h-full overflow-y-auto bg-subtle/30 border-r border-border-subtle">
            <ProjectContextPanel project={selectedProject} />
          </div>

          {/* Center Pane: ProseMirror Editor */}
          <div className="h-full overflow-hidden bg-white">
            <ProseMirrorEditor
              initialContent={scriptContent}
              onContentChange={onContentChange}
              onSave={onSave}
              onEnhance={onEnhance}
              placeholder="Start writing your script..."
              brandValidationEnabled={!!selectedProjectId}
              readOnly={!selectedProjectId}
            />
          </div>

          {/* Right Pane: AI Assistant */}
          <div className="h-full overflow-hidden border-l border-border-subtle bg-white">
            <AIChat projectId={selectedProjectId} />
          </div>
        </Split>
      </div>
    </div>
  );
};

/**
 * Project Context Panel - Left Pane
 * Displays all relevant project information for AI context
 */
const ProjectContextPanel: React.FC<{ project?: Project }> = ({ project }) => {
  if (!project) {
    return (
      <div className="flex items-center justify-center h-full text-ink-tertiary">
        <div className="text-center p-8">
          <LayoutList size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-sm">Select a project to view context</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Project Brief */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wide text-ink-secondary">
            Brief
          </h3>
        </div>
        <p className="text-sm text-ink-primary leading-relaxed">
          {project.description || 'No brief available'}
        </p>
      </section>

      {/* Project Intelligence */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Database size={16} className="text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wide text-ink-secondary">
            Intelligence Sources
          </h3>
        </div>
        {project.knowledgeBase && project.knowledgeBase.length > 0 ? (
          <div className="space-y-2">
            {project.knowledgeBase.map((kb) => (
              <div
                key={kb.id}
                className="p-3 bg-white rounded-lg border border-border-subtle text-xs"
              >
                <div className="font-semibold text-ink-primary mb-1">{kb.title}</div>
                <div className="text-ink-tertiary">{kb.type}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-ink-tertiary italic">No intelligence sources</p>
        )}
      </section>

      {/* Team */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Users size={16} className="text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wide text-ink-secondary">
            Team
          </h3>
        </div>
        <p className="text-xs text-ink-tertiary">
          {project.client || 'No client assigned'}
        </p>
      </section>

      {/* AI Context Indicator */}
      <div className="pt-4 border-t border-border-subtle">
        <div className="flex items-center gap-2 px-3 py-2 bg-primary-tint rounded-lg">
          <Sparkles size={14} className="text-primary" />
          <span className="text-xs font-semibold text-primary">
            AI Context Active
          </span>
        </div>
      </div>
    </div>
  );
};

export default SplitPaneStudio;
