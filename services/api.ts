

import {
  ApiResponse,
  Asset,
  Assignment,
  AuthResult,
  Freelancer,
  KnowledgeSource,
  MoodboardItem,
  Project,
  QueryParams,
  Script,
} from "../types";

// const _appId = 'studio-roster-v1';

// --- API CONFIGURATION ---

/**
 * Base path for all API requests
 * Aligned with NestJS versioning: @Controller({ version: '1' })
 */
const API_BASE = '/api/v1';

// --- HELPERS ---

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    size: number;
    url: string;
    modifiedTime: string;
    logic: unknown[];
    synced?: boolean;
}

export interface BatchImportResponse {
    created: number;
    updated: number;
    errors?: { item: Record<string, unknown>; error: string }[];
}

const STORAGE_PREFIX = "studio_roster_v1_";

// --- PERSISTENCE LAYER ---

export const loadFromStorage = <T>(key: string, defaultData: T): T => {
    try {
        const stored = localStorage.getItem(STORAGE_PREFIX + key);
        return stored ? JSON.parse(stored) : defaultData;
    } catch (e) {
        console.error(`Failed to load ${key}`, e);
        return defaultData;
    }
};

const saveToStorage = (key: string, data: unknown) => {
    try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
    } catch (e) {
        console.error(`Failed to save ${key}`, e);
    }
};

// Initialize State from Storage or Empty (Strict No-Mock Policy)
let localFreelancers: Freelancer[] = loadFromStorage('freelancers', []);
let localProjects: Project[] = loadFromStorage('projects', []);
let localAssignments: Assignment[] = loadFromStorage('assignments', []);
let localScripts: Script[] = loadFromStorage('scripts', []);
let localAssets: Asset[] = loadFromStorage('assets', []);

// --- BACKEND INTEGRATION ---

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 15000) => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchPromise = fetch(url, { ...options, signal });

    const timeoutPromise = new Promise<Response>((_, reject) => {
        setTimeout(() => {
            controller.abort();
            reject(new Error('Request timed out'));
        }, timeout);
    });

    return Promise.race([fetchPromise, timeoutPromise]);
};

// Allow custom timeout in options
async function fetchApi<T>(path: string, options?: RequestInit & { timeout?: number }): Promise<ApiResponse<T>> {
    // Get auth token from localStorage
    const token = localStorage.getItem('studio_roster_v1_auth_token');

    // Prevent browser caching of API responses to ensure we get fresh data from server
    const headers = {
        ...(options?.headers || {}),
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        ...(token && { 'Authorization': `Bearer ${token}` }) // Add JWT token
    };

    const timeout = options?.timeout || 30000; // Default 30s
    const res = await fetchWithTimeout(`${API_BASE}${path}`, { ...options, headers }, timeout);

    // Security: Handle Unauthorized Access
    if (res.status === 401) {
        console.warn('Session expired or unauthorized. Redirecting...');
        // Optional: Dispatch a global event or clear storage
        // window.location.href = '/login'; // Or handle via React State in App.tsx
        throw new Error('Unauthorized');
    }

    // Check for Proxy Errors (Vite returning index.html instead of API response)
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
        throw new Error('Backend unavailable (Received HTML fallback)');
    }

    if (res.status === 404) {
        throw new Error(`Endpoint not found: ${path}`);
    }

    if (res.status === 502 || res.status === 503 || res.status === 504) {
        throw new Error('Backend unavailable (Gateway Error)');
    }

    let body: unknown = null;
    try {
        body = await res.json();
    } catch {
        if (res.ok && res.status === 204) return { success: true } as ApiResponse<T>;
        if (res.ok) return { success: true, data: {} as T };
        throw new Error('Invalid JSON response');
    }

    if (!res.ok) {
        const errorObj = (body as { error?: { message?: string } })?.error;
        const message = errorObj?.message || res.statusText || 'Unknown Error';
        throw new Error(message);
    }

    if (
        body &&
        typeof body === 'object' &&
        'data' in body &&
        (Array.isArray(body) || ('id' in body || 'email' in body || 'name' in body || 'bucket' in body))
    ) {
        return { data: body as T, success: true };
    }

    return body as ApiResponse<T>;
}

const uploadToBackend = async (file: File, projectId?: string): Promise<Asset> => {
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) formData.append('projectId', projectId);

    // Set 10 minute timeout for uploads to prevent "Request timed out" on large files
    const res = await fetchApi<Asset>(`${API_BASE}/assets/upload`, {
      method: "POST",
      body: formData,
      timeout: 600000,
    });

    const asset = res.data!;

    if (!asset.url && !asset.publicUrl) {
      try {
        const urlRes = await fetchApi<{ url: string }>(
          `${API_BASE}/assets/${asset.id}/url`
        );
        asset.url = urlRes.data?.url;
      } catch {
        console.warn("Could not sign URL for asset", asset.id);
      }
    } else if (asset.publicUrl) {
      asset.url = asset.publicUrl;
    }

    return asset;
};

export const api = {
    auth: {
        login: async (email: string, password: string): Promise<ApiResponse<AuthResult>> => {
            try {
                // Real Backend Auth
                const res = await fetchApi<AuthResult>(
                  `${API_BASE}/auth/login`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                  }
                );

                if (res.success && res.data) {
                    localStorage.setItem('studio_roster_v1_auth_token', res.data.accessToken);
                    localStorage.setItem('studio_roster_v1_auth_user', JSON.stringify(res.data.user));
                }
                return res;
            } catch (e) {
                console.error("Auth failed:", e);
                throw e;
            }
        },
    },



    assets: {
        list: async (): Promise<ApiResponse<Asset[]>> => {
            try {
                const res = await fetchApi<Asset[]>(`${API_BASE}/assets`);
                // Implicit Cache
                localAssets = res.data || [];
                saveToStorage('assets', localAssets);
                return res;
            } catch (e) {
                console.error("Assets API Error:", e); // Log specific error for debugging
                return { data: localAssets, success: true, message: 'Offline Mode (Cached)' };
            }
        },
        upload: async (file: File, projectId?: string): Promise<ApiResponse<Asset>> => {
            // STRICT MODE: No mock fallback for uploads.
            // If backend/storage is down, the upload MUST fail.
            try {
                const asset = await uploadToBackend(file, projectId);
                // Optimistic update
                localAssets = [asset, ...localAssets];
                saveToStorage('assets', localAssets);
                return { data: asset, success: true };
            } catch (e) {
                const message = e instanceof Error ? e.message : String(e);
                console.error("Upload failed:", message);
                throw e; // Propagate error to UI
            }
        },
        delete: async (id: string): Promise<ApiResponse<boolean>> => {
            try {
                await fetchApi<unknown>(`${API_BASE}/assets/${id}`, {
                  method: "DELETE",
                });
            } catch {
                console.warn("Delete failed online, removing locally");
            }
            localAssets = localAssets.filter(a => a.id !== id);
            saveToStorage('assets', localAssets);
            return { data: true, success: true };
        }
    },

    storage: {
        getInfo: async (): Promise<ApiResponse<{ bucket: string; configured: boolean; projectId: string }>> => {
            try {
                return await fetchApi<{
                  bucket: string;
                  configured: boolean;
                  projectId: string;
                }>(`${API_BASE}/storage/info`);
            } catch {
                return { data: { bucket: 'Unknown', configured: false, projectId: '' }, success: false };
            }
        }
    },

    freelancers: {
        list: async (_params?: QueryParams): Promise<ApiResponse<Freelancer[]>> => {
            try {
                const res = await fetchApi<Freelancer[]>(
                  `${API_BASE}/freelancers`
                );
                // Implicit Cache
                localFreelancers = res.data || [];
                saveToStorage('freelancers', localFreelancers);
                return res;
            } catch {
                return { data: localFreelancers, success: true, message: 'Offline Mode (Cached)' };
            }
        },
        create: async (f: Freelancer) => {
            try {
                const res = await fetchApi<Freelancer>(
                  `${API_BASE}/freelancers`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(f),
                  }
                );
                const createdFreelancer = res.data ?? f;
                localFreelancers = [...localFreelancers, createdFreelancer];
                saveToStorage('freelancers', localFreelancers);
                return { ...res, data: createdFreelancer };
            } catch {
                localFreelancers.push(f);
                saveToStorage('freelancers', localFreelancers);
                return { data: f, success: true };
            }
        },
        update: async (f: Freelancer) => {
            try {
                const res = await fetchApi<Freelancer>(
                  `${API_BASE}/freelancers/${f.id}`,
                  {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(f),
                  }
                );
                const updatedFreelancer = res.data ?? f;
                localFreelancers = localFreelancers.map(lf => lf.id === f.id ? updatedFreelancer : lf);
                saveToStorage('freelancers', localFreelancers);
                return res;
            } catch {
                localFreelancers = localFreelancers.map(lf => lf.id === f.id ? f : lf);
                saveToStorage('freelancers', localFreelancers);
                return { data: f, success: true };
            }
        },
        delete: async (id: string) => {
            try {
                await fetchApi(`${API_BASE}/freelancers/${id}`, {
                  method: "DELETE",
                });
            } catch { /* ignore */ }
            localFreelancers = localFreelancers.filter(f => f.id !== id);
            saveToStorage('freelancers', localFreelancers);
            return { data: true, success: true };
        },
        importBatch: async (items: Freelancer[]): Promise<ApiResponse<BatchImportResponse>> => {
            try {
                const res = await fetchApi<BatchImportResponse>(
                  `${API_BASE}/freelancers/batch`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(items),
                  }
                );
                // Re-fetch to sync
                return res;
            } catch {
                return { data: { created: 0, updated: 0, errors: [] }, success: false };
            }
        },
    },

    projects: {
        list: async (params?: QueryParams): Promise<ApiResponse<Project[]>> => {
            try {
                const query = new URLSearchParams();
                if (params?.page) query.append('page', params.page.toString());
                if (params?.limit) query.append('limit', params.limit.toString());
                if (params?.search) query.append('search', params.search);

                const res = await fetchApi<Project[]>(
                  `${API_BASE}/projects?${query.toString()}`
                );
                localProjects = res.data || [];
                saveToStorage('projects', localProjects);
                return res;
            } catch {
                return { data: localProjects, success: true, message: 'Offline Mode (Cached)' };
            }
        },
        create: async (p: Project) => {
            try {
                const res = await fetchApi<Project>('/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
                const createdProject = res.data ?? p;
                localProjects = [...localProjects, createdProject];
                saveToStorage('projects', localProjects);
                return { ...res, data: createdProject };
            } catch {
                localProjects.push(p);
                saveToStorage('projects', localProjects);
                return { data: p, success: true };
            }
        },
        update: async (p: Project) => {
            try {
                const res = await fetchApi<Project>(`/projects/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
                const updatedProject = res.data ?? p;
                localProjects = localProjects.map(lp => lp.id === p.id ? updatedProject : lp);
                saveToStorage('projects', localProjects);
                return res;
            } catch {
                localProjects = localProjects.map(lp => lp.id === p.id ? p : lp);
                saveToStorage('projects', localProjects);
                return { data: p, success: true };
            }
        },
        delete: async (id: string) => {
            try { await fetchApi(`/projects/${id}`, { method: 'DELETE' }); } catch { /* ignore */ }
            localProjects = localProjects.filter(p => p.id !== id);
            saveToStorage('projects', localProjects);
            return { data: true, success: true };
        },
        deleteBatch: async (ids: string[]) => {
            try { await fetchApi('/projects/batch-delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ids) }); } catch { /* ignore */ }
            localProjects = localProjects.filter(p => !ids.includes(p.id));
            saveToStorage('projects', localProjects);
            return { data: true, success: true };
        },
        importBatch: async (items: Project[]): Promise<ApiResponse<BatchImportResponse>> => {
            try {
                return await fetchApi<BatchImportResponse>('/projects/batch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) });
            } catch {
                return { data: { created: 0, updated: 0 }, success: false };
            }
        },
    },

    assignments: {
        list: async (_params?: QueryParams): Promise<ApiResponse<Assignment[]>> => {
            try {
                const res = await fetchApi<Assignment[]>('/assignments');
                localAssignments = res.data || [];
                saveToStorage('assignments', localAssignments);
                return res;
            } catch {
                return { data: localAssignments, success: true };
            }
        },
        create: async (a: Assignment) => {
            try {
                const res = await fetchApi<Assignment>('/assignments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(a) });
                const createdAssignment = res.data ?? a;
                localAssignments = [...localAssignments, createdAssignment];
                saveToStorage('assignments', localAssignments);
                return { ...res, data: createdAssignment };
            } catch {
                localAssignments.push(a);
                saveToStorage('assignments', localAssignments);
                return { data: a, success: true };
            }
        },
        update: async (a: Assignment) => {
            try {
                const res = await fetchApi<Assignment>(`/assignments/${a.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(a) });
                const updatedAssignment = res.data ?? a;
                localAssignments = localAssignments.map(la => la.id === a.id ? updatedAssignment : la);
                saveToStorage('assignments', localAssignments);
                return res;
            } catch {
                localAssignments = localAssignments.map(la => la.id === a.id ? a : la);
                saveToStorage('assignments', localAssignments);
                return { data: a, success: true };
            }
        },
    },

    scripts: {
        list: async (_params?: unknown) => {
            try {
                const res = await fetchApi<Script[]>('/scripts');
                localScripts = res.data || [];
                saveToStorage('scripts', localScripts);
                return res;
            } catch { return { data: localScripts, success: true }; }
        },
        create: async (s: Script) => {
            try {
                const res = await fetchApi<Script>('/scripts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) });
                const createdScript = res.data ?? s;
                localScripts = [...localScripts, createdScript];
                saveToStorage('scripts', localScripts);
                return { ...res, data: createdScript };
            } catch {
                localScripts.push(s);
                saveToStorage('scripts', localScripts);
                return { data: s, success: true };
            }
        },
        findByProject: async (projectId: string) => {
            try { return await fetchApi<Script[]>(`/scripts/project/${projectId}`); } catch { return { data: [], success: true }; }
        },
    },

    drive: {
        listTeamAssets: async (): Promise<ApiResponse<DriveFile[]>> => {
            try {
                return await fetchApi<DriveFile[]>('/google/drive/team-assets');
            } catch { /* ignore */ }
            return { data: [], success: true };
        },
    },

    moodboard: {
        list: async (projectId?: string): Promise<ApiResponse<MoodboardItem[]>> => {
            try {
                if (projectId) {
                    return await fetchApi<MoodboardItem[]>(`/moodboard/${projectId}`);
                }
            } catch { /* ignore */ }
            return { data: [], success: true };
        },

        linkAsset: async (projectId: string, assetId: string): Promise<ApiResponse<MoodboardItem>> => {
            return await fetchApi<MoodboardItem>(`/moodboard/${projectId}/link-asset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assetId })
            });
        },

        create: async (item: Partial<MoodboardItem>): Promise<ApiResponse<MoodboardItem>> => {
            return await fetchApi<MoodboardItem>(`/moodboard/${item.projectId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
        },

        update: async (item: MoodboardItem): Promise<ApiResponse<MoodboardItem>> => {
            try { return await fetchApi<MoodboardItem>(`/moodboard/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }); } catch { return { data: item, success: true }; }
        },

        delete: async (id: string): Promise<ApiResponse<boolean>> => {
            try { await fetchApi(`/moodboard/${id}`, { method: 'DELETE' }); } catch { /* ignore */ }
            return { data: true, success: true };
        }
    },

    knowledge: {
        createFromAsset: async (projectId: string, assetId: string, _mockAsset?: Asset): Promise<ApiResponse<KnowledgeSource>> => {
            return await fetchApi<KnowledgeSource>('/knowledge/create-from-asset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, assetId })
            });
        },

        delete: async (id: string) => {
            try { await fetchApi(`/knowledge/${id}`, { method: 'DELETE' }); } catch { /* ignore */ }
            return { data: true, success: true };
        }
    },

    ai: {
        chat: async (payload: Record<string, unknown>): Promise<ApiResponse<unknown>> => {
            return await fetchApi<unknown>('/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        },
        extract: async (payload: Record<string, unknown>): Promise<ApiResponse<unknown>> => {
            return await fetchApi<unknown>('/ai/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }
    },

    suggestions: {
        get: async () => []
    }
};
