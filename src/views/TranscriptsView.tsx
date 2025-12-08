import { Loader2, Play, RefreshCcw, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  TranscriptMode,
  TranscriptRequest,
  TranscriptResponse,
  createTranscript,
  pollTranscript,
} from "../services/transcriptsApi";

const modes: TranscriptMode[] = ["native", "auto", "generate"];

export default function TranscriptsView() {
  const [form, setForm] = useState<TranscriptRequest>({
    url: "",
    lang: "en",
    text: true,
    mode: "auto",
  });
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [result, setResult] = useState<TranscriptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (jobId) {
      setPolling(true);
      interval = setInterval(async () => {
        try {
          const res = await pollTranscript(jobId);
          setResult(res);
          if (res.status === "done" || res.content) {
            clearInterval(interval);
            setPolling(false);
            setJobId(null);
          }
        } catch (e) {
          setError((e as Error).message);
          clearInterval(interval);
          setPolling(false);
          setJobId(null);
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await createTranscript(form);
      setResult(res);
      if (res.jobId && !res.content) {
        setJobId(res.jobId);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = useMemo(() => {
    if (polling) return "Polling supadata…";
    if (!result) return null;
    if (result.status === "done") return "Ready";
    return result.status;
  }, [polling, result]);

  return (
    <div className="p-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-ink-tertiary mb-2">
            Transcripts
          </p>
          <h1 className="text-3xl font-bold text-ink-primary tracking-tight">
            Pull transcripts from social, video, or files
          </h1>
          <p className="text-sm text-ink-secondary mt-2 max-w-3xl">
            Paste any supported URL (YouTube, TikTok, Instagram, X, file links) and let Supadata
            return structured transcripts. Jobs that need more time are polled automatically.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border-subtle bg-surface shadow-card p-6 space-y-6"
      >
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-12 md:col-span-6">
            <label className="block text-xs font-semibold text-ink-tertiary mb-2">
              Source URL
            </label>
            <input
              type="url"
              required
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              placeholder="https://x.com/SpaceX/status/1481651037291225113"
              className="input"
            />
          </div>
          <div className="col-span-6 md:col-span-2">
            <label className="block text-xs font-semibold text-ink-tertiary mb-2">
              Language
            </label>
            <input
              type="text"
              value={form.lang || ""}
              onChange={(e) => setForm((f) => ({ ...f, lang: e.target.value }))}
              placeholder="en"
              className="input"
            />
          </div>
          <div className="col-span-6 md:col-span-2">
            <label className="block text-xs font-semibold text-ink-tertiary mb-2">
              Mode
            </label>
            <select
              className="input"
              value={form.mode}
              onChange={(e) =>
                setForm((f) => ({ ...f, mode: e.target.value as TranscriptMode }))
              }
            >
              {modes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-6 md:col-span-1 flex items-center gap-2">
            <input
              id="text"
              type="checkbox"
              checked={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.checked }))}
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor="text" className="text-sm text-ink-secondary">
              Plain text
            </label>
          </div>
          <div className="col-span-6 md:col-span-1">
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
              Fetch
            </button>
          </div>
        </div>

        {statusBadge && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-tint text-xs font-semibold text-primary">
            {polling ? <RefreshCcw className="animate-spin" size={14} /> : null}
            {statusBadge}
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-state-danger-bg text-state-danger px-4 py-3 text-sm">
            {error}
          </div>
        )}
      </form>

      <div className="rounded-2xl border border-border-subtle bg-surface shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-[0.24em]">
              Output
            </p>
            <h3 className="text-lg font-bold text-ink-primary">
              {result?.lang ? `Transcript (${result.lang})` : "Awaiting transcript"}
            </h3>
          </div>
          {jobId && (
            <span className="text-xs text-ink-tertiary flex items-center gap-2">
              <Loader2 className="animate-spin" size={14} />
              Job {jobId}
            </span>
          )}
        </div>

        {result?.content ? (
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-ink-secondary bg-subtle p-4 rounded-xl border border-border-subtle max-h-[480px] overflow-y-auto custom-scrollbar">
            {result.content}
          </pre>
        ) : (
          <div className="flex items-center justify-center flex-col text-ink-tertiary gap-3 py-12">
            <div className="w-12 h-12 rounded-full bg-subtle flex items-center justify-center border border-border-subtle">
              <Upload size={22} />
            </div>
            <div className="text-sm text-center">
              No transcript yet. Submit a URL to fetch from Supadata.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
