import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useDashboardData } from "../hooks/useDashboardData";

const mockGetProjects = vi.fn();
const mockGetFreelancers = vi.fn();
const mockGetMoodboardItems = vi.fn();

vi.mock("../services/api/projects", () => ({
  ProjectsAPI: {
    getProjects: (...args: unknown[]) => mockGetProjects(...args),
  },
}));

vi.mock("../services/api/freelancers", () => ({
  FreelancersAPI: {
    getFreelancers: (...args: unknown[]) => mockGetFreelancers(...args),
  },
}));

vi.mock("../services/api/moodboard", () => ({
  MoodboardAPI: {
    getMoodboardItems: (...args: unknown[]) => mockGetMoodboardItems(...args),
  },
}));

vi.mock("../hooks/useToast", () => ({
  useToast: () => ({
    addToast: vi.fn(),
  }),
}));

describe("useDashboardData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with loading states", () => {
    const { result } = renderHook(() => useDashboardData());

    expect(result.current.loadingHero).toBe(true);
    expect(result.current.loadingArtifacts).toBe(true);
    expect(result.current.errorHero).toBe(null);
    expect(result.current.errorArtifacts).toBe(null);
    expect(result.current.heroProject).toBe(null);
    expect(result.current.artifacts).toEqual([]);
  });

  it("loads hero project and artifacts", async () => {
    mockGetProjects.mockResolvedValue({
      data: [
        {
          id: "proj-1",
          title: "Nebula Phase II",
          description: "Comprehensive rebrand focusing on kinetic typography",
          status: "IN_PROGRESS",
          client: "Studio",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-05T00:00:00Z",
        },
      ],
      pagination: { page: 1, limit: 8, total: 1, totalPages: 1 },
    });

    mockGetFreelancers.mockResolvedValue({
      data: [
        {
          id: "freelancer-1",
          name: "Alex Director",
          role: "Creative Director",
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z",
          skills: ["Direction"],
        },
      ],
      pagination: { page: 1, limit: 6, total: 1, totalPages: 1 },
    });

    mockGetMoodboardItems.mockResolvedValue({
      data: [
        {
          id: "mood-1",
          url: "https://example.com/image.jpg",
          caption: "Launch frame",
          tags: [],
          moods: [],
          colors: [],
          createdAt: "2024-01-03T00:00:00Z",
          updatedAt: "2024-01-03T00:00:00Z",
          projectId: "proj-1",
        },
      ],
      pagination: { page: 1, limit: 12, total: 1, totalPages: 1 },
    });

    const { result } = renderHook(() => useDashboardData());

    await waitFor(() => {
      expect(result.current.loadingHero).toBe(false);
      expect(result.current.loadingArtifacts).toBe(false);
    });

    expect(result.current.heroProject?.title).toBe("Nebula Phase II");
    expect(result.current.artifacts).toHaveLength(1);
    expect(result.current.counts.projects).toBe(1);
    expect(result.current.counts.freelancers).toBe(1);
    expect(result.current.counts.moodboardItems).toBe(1);
    expect(result.current.activities.length).toBeGreaterThan(0);
  });
});
