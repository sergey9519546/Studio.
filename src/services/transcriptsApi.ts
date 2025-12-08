const defaultApiBase = () => {
  if (typeof window !== "undefined") {
    return "/api/v1";
  }
  return "http://localhost:3001/api/v1";
};

const API_BASE = import.meta.env.VITE_API_URL || defaultApiBase();

export type TranscriptMode = "native" | "auto" | "generate";

export interface TranscriptRequest {
  url: string;
  lang?: string;
  text?: boolean;
  mode?: TranscriptMode;
}

export interface TranscriptResponse {
  content?: string;
  lang?: string;
  jobId?: string;
  status: "done" | "processing" | string;
}

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const message = await res.text().catch(() => "");
    throw new Error(
      `Request failed (${res.status} ${res.statusText}) ${message ? `- ${message}` : ""}`
    );
  }
  return res.json();
}

export function createTranscript(payload: TranscriptRequest): Promise<TranscriptResponse> {
  return request<TranscriptResponse>("/transcripts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function pollTranscript(jobId: string): Promise<TranscriptResponse> {
  return request<TranscriptResponse>(`/transcripts/${jobId}`, {
    method: "GET",
  });
}
