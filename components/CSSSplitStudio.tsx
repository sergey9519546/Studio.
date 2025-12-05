/**
 * CSS-Based Split-Pane Studio (No Dependencies Required)
 * Phase 4: Professional 3-Column Layout
 */

import React, { useState, useRef, useEffect } from 'react';
import ProseMirrorEditor from './editor/ProseMirrorEditor';
import AIChat from './AIChat';
import { Project, Freelancer, Assignment } from '../types';
import { FileText, Sparkles, Users, Database, LayoutList, GripVertical } from 'lucide-react';

interface CSSplitStudioProps {
  projects: Project[];
  freelancers: Freelancer[];
  assignments: Assignment[];
 selectedProjectId?: string;
  onSelectProject: (id: string) => void;
  scriptContent: string;
  onContentChange: (content: string) => void;
  onSave: () => Promise<void>;
  onEnhance: (content: string) => Promise<string>;
}

export const CSSSplitStudio: React.FC<CSSplitStudioProps> = ({
  projects,
  freelancers,
  assignments,
  selectedProjectId,
  onSelectProject,
  scriptContent,
  onContentChange,
  onSave,
  onEnhance
}) => {
  const [leftWidth, setLeftWidth] = useState(20); // 20%
  const [rightWidth, setRightWidth] = useState(25); // 25%
  const isDraggingLeft = useRef(false);
  const isDraggingRight = useRef(false);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Resizable pane logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingLeft.current) {
        const newWidth = (e.clientX / window.innerWidth) * 100;
        setLeftWidth(Math.max(15, Math.min(35, newWidth)));
      }
      if (isDraggingRight.current) {
        const newWidth = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
        setRightWidth(Math.max(20, Math.min(40, newWidth)));
      }
    };

    const handleMouseUp = () => {
      isDraggingLeft.current = false;
      isDraggingRight.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const centerWidth = 100 - leftWidth - rightWidth;

  return (
    <div className="h-full flex flex-col bg-app">
      {/* Header */}
      <div className="h-14 border-b border-border-subtle bg-white flex items-center px-6 justify-between shrink-0">
        <h1 className="text-lg font-bold text-ink-primary">Writer's Room</h1>
        
        <select
          value={selectedProjectId || ''}
          onChange={(e) => onSelectProject(e.target.value)}
          className="px-4 py-2 border border-border-subtle rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
        >
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* 3-Pane Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane */}
        <div
          className="h-full overflow-y-auto bg-subtle/30 border-r border-border-subtle"
          style={{ width: `${leftWidth}%` }}
        >
          <ProjectContextPanel project={selectedProject} />
        </div>

        {/* Left Resizer */}
        <div
          className="w-2 cursor-col-resize hover:bg-primary/20 transition-colors flex items-center justify-center group"
          onMouseDown={() => {
            isDraggingLeft.current = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
          }}
        >
          <GripVertical size={16} className="text-border-subtle group-hover:text-primary" />
        </div>

        {/* Center Pane */}
        <div
          className="h-full overflow-hidden bg-white"
          style={{ width: `${centerWidth}%` }}
        >
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

        {/* Right Resizer */}
        <div
          className="w-2 cursor-col-resize hover:bg-primary/20 transition-colors flex items-center justify-center group"
          onMouseDown={() => {
            isDraggingRight.current = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
          }}
        >
          <GripVertical size={16} className="text-border-subtle group-hover:text-primary" />
        </div>

        {/* Right Pane */}
        <div
          className="h-full overflow-hidden border-l border-border-subtle bg-white"
          style={{ width: `${rightWidth}%` }}
        >
          <AIChat freelancers={freelancers} projects={projects} assignments={assignments} />
        </div>
      </div>
    </div>
  );
};

/**
 * Project Context Panel
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
            Intelligence
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
                <div className="text-ink-tertiary">{kb.category}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-ink-tertiary italic">No sources</p>
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
          {project.clientName || 'No client'}
        </p>
      </section>

      {/* AI Context */}
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

export default CSSSplitStudio;
