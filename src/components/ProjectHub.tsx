import React, { useState } from 'react';
import { Upload, FileText, MoreVertical, Trash2, Edit2, Plus } from 'lucide-react';
import { Card } from './design/Card';
import { Button } from './design/Button';
import { LiquidGlassContainer } from './design/LiquidGlassContainer';

interface Project {
  id: string;
  title: string;
  client: string;
  deliverables: string[];
  tone: string;
  status: string;
  createdAt: string;
}

interface ProjectHubProps {
  projects?: Project[];
  onProjectSelect?: (project: Project) => void;
  onProjectCreate?: (data: Partial<Project>) => void;
  onFileUpload?: (file: File, projectId?: string) => Promise<void>;
}

export const ProjectHub: React.FC<ProjectHubProps> = ({
  projects = [],
  onProjectSelect,
  onProjectCreate,
  onFileUpload,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleFiles(files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isValidType = validateFileType(file);
        
        if (isValidType) {
          await onFileUpload?.(file, selectedProject || undefined);
        }
      }
    } finally {
      setUploading(false);
    }
  };

  const validateFileType = (file: File): boolean => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
      'application/vnd.ms-excel', // xls
      'application/msword', // doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
      'application/pdf',
    ];
    return validTypes.includes(file.type) || file.name.includes('sheet');
  };

  return (
    <div className="w-full h-full bg-app">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ink-primary mb-2">Project Hub</h1>
          <p className="text-ink-secondary">Create projects and ingest creative briefs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingest Zone */}
          <div className="lg:col-span-1">
            <LiquidGlassContainer level="lg">
              <h2 className="text-lg font-bold text-ink-primary mb-4">Upload Documents</h2>
              
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                  p-8 rounded-[24px] border-2 border-dashed transition-all text-center
                  ${dragActive 
                    ? 'border-primary bg-primary-tint' 
                    : 'border-border-subtle bg-subtle'
                  }
                `}
              >
                <Upload size={32} className="mx-auto text-ink-secondary mb-3" />
                <p className="text-sm font-semibold text-ink-primary mb-1">
                  Drop documents here
                </p>
                <p className="text-xs text-ink-tertiary mb-4">
                  XLSX, DOCX, PDF, or Google Sheets
                </p>
                <label>
                  <input
                    type="file"
                    multiple
                    accept=".xlsx,.xls,.docx,.doc,.pdf"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Choose Files'}
                  </Button>
                </label>
              </div>

              <div className="mt-6 pt-6 border-t border-border-subtle">
                <h3 className="text-sm font-bold text-ink-secondary uppercase tracking-wide mb-3">
                  Pro Tips
                </h3>
                <ul className="space-y-2 text-xs text-ink-tertiary">
                  <li>• AI auto-extracts project metadata</li>
                  <li>• Supports Google Sheets URLs</li>
                  <li>• Vision analysis for mood boards</li>
                </ul>
              </div>
            </LiquidGlassContainer>
          </div>

          {/* Projects List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-ink-primary">Active Projects</h2>
              <Button 
                size="sm" 
                leftIcon={<Plus size={16} />}
                onClick={() => onProjectCreate?.({})}
              >
                New Project
              </Button>
            </div>

            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map(project => (
                  <Card
                    key={project.id}
                    hoverable
                    onClick={() => {
                      setSelectedProject(project.id);
                      onProjectSelect?.(project);
                    }}
                    className={selectedProject === project.id ? 'ring-2 ring-primary' : ''}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-ink-primary mb-1">
                          {project.title}
                        </h3>
                        <p className="text-sm text-ink-secondary mb-2">{project.client}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.deliverables.map((d, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 rounded-[12px] bg-primary-tint text-primary text-xs font-medium"
                            >
                              {d}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-ink-tertiary">
                          <span>Tone: <strong className="text-ink-secondary">{project.tone}</strong></span>
                          <span>Status: <strong className="text-ink-secondary">{project.status}</strong></span>
                        </div>
                      </div>

                      <button className="p-2 hover:bg-subtle rounded-[16px] transition-colors text-ink-tertiary hover:text-ink-secondary">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <FileText size={48} className="mx-auto text-ink-tertiary mb-4" />
                <p className="text-ink-secondary">No projects yet. Create one to get started!</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHub;
