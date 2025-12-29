import { X } from "lucide-react";
import React from "react";

import { Button } from "../design/Button";
import { Input } from "../design/Input";
import { Select } from "../design/Select";
import { Textarea } from "../design/Textarea";
import { ProjectsAPI } from "../../services/api/projects";
import type { CreateProjectData, Project } from "../../services/types";
import { PROJECT_STATUS_OPTIONS } from "../../utils/status";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (project: Project) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = React.useState("");
  const [clientName, setClientName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [status, setStatus] = React.useState("PLANNED");
  const [budget, setBudget] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setClientName("");
      setDescription("");
      setStatus("PLANNED");
      setBudget("");
      setStartDate("");
      setEndDate("");
      setError(null);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Project title is required.");
      return;
    }

    setSaving(true);
    setError(null);

    const payload: CreateProjectData = {
      title: trimmedTitle,
      clientName: clientName.trim() || undefined,
      description: description.trim() || undefined,
      status: status || "PLANNED",
      budget: budget ? Number(budget) : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    try {
      const created = await ProjectsAPI.createProject(payload);
      onCreated?.(created);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create project";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 py-10">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-2xl rounded-[28px] bg-surface shadow-2xl border border-border-subtle overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-border-subtle bg-surface/80">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink-tertiary">
              New Project
            </p>
            <h2 className="text-2xl font-semibold text-ink-primary mt-2">
              Create a project brief
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full border border-border-subtle text-ink-secondary hover:text-ink-primary hover:border-ink-primary transition"
            aria-label="Close project creation"
          >
            <X size={18} />
          </button>
        </div>

        <form className="px-8 py-6 space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Project title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Nebula Launch Campaign"
              required
            />
            <Input
              label="Client"
              value={clientName}
              onChange={(event) => setClientName(event.target.value)}
              placeholder="Studio partner"
            />
          </div>
          <Textarea
            label="Brief"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Summarize the creative intent and deliverables."
            rows={4}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              options={PROJECT_STATUS_OPTIONS}
            />
            <Input
              label="Budget (USD)"
              type="number"
              min={0}
              step="100"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              placeholder="15000"
            />
            <Input
              label="Start date"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>
          <Input
            label="Target delivery"
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />

          {error && (
            <div className="rounded-2xl border border-state-danger/30 bg-state-danger-bg px-4 py-3 text-sm text-state-danger">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={saving}>
              Create project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
