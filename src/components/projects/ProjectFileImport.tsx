import { Upload, File, X } from "lucide-react";
import React, { useCallback, useState } from "react";
import { ProjectsAPI } from "../../services/api/projects";

interface ProjectFileImportProps {
  onImportSuccess: () => void;
  onClose: () => void;
}

const ProjectFileImport: React.FC<ProjectFileImportProps> = ({
  onImportSuccess,
  onClose,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setError(null);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setError(null);
    }
  }, []);

  const handleImport = async () => {
    if (!selectedFile) {
      setError("Please select a file to import");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      await ProjectsAPI.importFromFile(formData);
      
      // Success!
      onImportSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to import project"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-2xl mx-4 p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-ink-tertiary hover:text-ink-primary transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-ink-primary mb-2">
            Import Project
          </h2>
          <p className="text-ink-secondary text-sm">
            Upload an Excel, CSV, or document file to automatically create a project
          </p>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-2xl p-12 transition-all
            ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border-subtle hover:border-ink-primary/30 bg-subtle/50"
            }
            ${selectedFile ? "border-primary bg-primary/5" : ""}
          `}
        >
          {selectedFile ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <File className="text-primary" size={24} />
                </div>
                <div>
                  <p className="font-medium text-ink-primary">{selectedFile.name}</p>
                  <p className="text-sm text-ink-tertiary">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-ink-tertiary hover:text-ink-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="text-primary" size={32} />
              </div>
              <p className="text-ink-primary font-medium mb-2">
                Drop your file here, or{" "}
                <label className="text-primary cursor-pointer hover:underline">
                  browse
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv,.json,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-sm text-ink-tertiary">
                Supports Excel, CSV, JSON, and document files
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-state-danger-bg border border-state-danger rounded-xl">
            <p className="text-sm text-state-danger">{error}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-border-subtle text-ink-primary hover:border-ink-primary transition-colors"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!selectedFile || isUploading}
            className={`
              px-6 py-3 rounded-xl font-medium transition-all
              ${
                !selectedFile || isUploading
                  ? "bg-subtle text-ink-tertiary cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-hover shadow-lg"
              }
            `}
          >
            {isUploading ? "Importing..." : "Import Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFileImport;
