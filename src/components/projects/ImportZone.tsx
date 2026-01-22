import { AlertCircle, CheckCircle2, File, Loader2, Upload, X } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { ProjectsAPI } from "../../services/api/projects";

interface ImportZoneProps {
  onImportSuccess?: () => void;
}

type StatusTone = "info" | "success";

const ImportZone: React.FC<ImportZoneProps> = ({ onImportSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [progressTone, setProgressTone] = useState<StatusTone>("info");

  const dropZoneClasses = useMemo(
    () =>
      [
        "border-2",
        "border-dashed",
        "rounded-2xl",
        "p-6",
        "transition-all",
        "flex",
        "flex-col",
        "gap-4",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border-subtle hover:border-ink-primary/30 bg-subtle/40",
        selectedFile ? "border-primary/70 bg-primary/5" : "",
      ]
        .filter(Boolean)
        .join(" "),
    [isDragging, selectedFile]
  );

  const resetStatus = () => {
    setError(null);
    setProgressMessage(null);
  };

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      resetStatus();
    }
  }, []);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        setSelectedFile(files[0]);
        resetStatus();
      }
    },
    []
  );

  const handleImport = async () => {
    if (!selectedFile) {
      setError("Please select a file to import.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setProgressTone("info");
    setProgressMessage("Uploading file and preparing your project...");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await ProjectsAPI.importFromFile(formData);

      setProgressTone("success");
      setProgressMessage(response.message || "Import complete.");
      setSelectedFile(null);
      onImportSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to import project.";
      setError(message);
      setProgressMessage(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="bg-surface rounded-3xl border border-border-subtle p-6 md:p-8 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-tertiary">
            Import data
          </p>
          <h2 className="text-2xl font-semibold text-ink-primary">
            Drag & drop a project file
          </h2>
          <p className="text-sm text-ink-secondary mt-2 max-w-xl">
            Bring in Excel, CSV, JSON, or document exports to spin up a new
            project instantly.
          </p>
        </div>
        <button
          type="button"
          onClick={handleImport}
          disabled={!selectedFile || isUploading}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all
            ${
              !selectedFile || isUploading
                ? "bg-subtle text-ink-tertiary cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary-hover shadow-lg"
            }`}
        >
          {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {isUploading ? "Importing..." : "Import project"}
        </button>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mt-6 ${dropZoneClasses}`}
      >
        {selectedFile ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <File className="text-primary" size={22} />
              </div>
              <div>
                <p className="font-medium text-ink-primary">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-ink-tertiary">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="inline-flex items-center gap-2 text-xs text-ink-tertiary hover:text-ink-primary"
            >
              <X size={14} />
              Remove file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Upload className="text-primary" size={24} />
            </div>
            <p className="text-sm text-ink-primary font-medium">
              Drop a file here, or{" "}
              <label className="text-primary hover:underline cursor-pointer">
                browse files
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv,.json,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-xs text-ink-tertiary">
              Supported: Excel, CSV, JSON, DOCX, TXT
            </p>
          </div>
        )}
      </div>

      {(progressMessage || error) && (
        <div
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm flex items-start gap-2
            ${
              error
                ? "border-state-danger bg-state-danger-bg text-state-danger"
                : progressTone === "success"
                ? "border-state-success bg-state-success-bg text-state-success"
                : "border-border-subtle bg-subtle/60 text-ink-secondary"
            }`}
        >
          {error ? (
            <AlertCircle size={18} className="mt-0.5" />
          ) : progressTone === "success" ? (
            <CheckCircle2 size={18} className="mt-0.5" />
          ) : (
            <Loader2 size={18} className="mt-0.5 animate-spin" />
          )}
          <span>{error ?? progressMessage}</span>
        </div>
      )}
    </section>
  );
};

export default ImportZone;
