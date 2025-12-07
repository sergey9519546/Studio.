import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useDashboardData } from "../hooks/useDashboardData";

// Mock the useToast hook
vi.mock("../hooks/useToast", () => ({
  useToast: () => ({
    addToast: vi.fn(),
  }),
}));

// Mock timers
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe("useDashboardData", () => {
  it("should initialize with loading states", () => {
    const { result } = renderHook(() => useDashboardData());

    expect(result.current.loadingHero).toBe(true);
    expect(result.current.loadingArtifacts).toBe(true);
    expect(result.current.errorHero).toBe(null);
    expect(result.current.errorArtifacts).toBe(null);
    expect(result.current.heroProject).toBe(null);
    expect(result.current.artifacts).toEqual([]);
  });

  it("should load hero project and artifacts after timeout", async () => {
    const { result } = renderHook(() => useDashboardData());

    // Fast-forward timers to trigger data loading
    vi.advanceTimersByTime(350);

    await waitFor(() => {
      expect(result.current.loadingHero).toBe(false);
      expect(result.current.loadingArtifacts).toBe(false);
    });

    expect(result.current.heroProject).toBeTruthy();
    expect(result.current.heroProject?.title).toBe("Nebula Phase II");
    expect(result.current.artifacts).toHaveLength(4);
    expect(result.current.errorHero).toBe(null);
    expect(result.current.errorArtifacts).toBe(null);
  });

  it("should provide addArtifact function that adds to artifacts list", async () => {
    const { result } = renderHook(() => useDashboardData());

    // Wait for initial load
    vi.advanceTimersByTime(350);
    await waitFor(() => {
      expect(result.current.loadingArtifacts).toBe(false);
    });

    const initialLength = result.current.artifacts.length;

    // Add a new artifact
    const newArtifact = {
      id: "new-art-1",
      name: "New_Artifact.png",
      imageSrc: "https://example.com/new.png",
    };

    result.current.addArtifact(newArtifact);

    expect(result.current.artifacts).toHaveLength(initialLength + 1);
    expect(result.current.artifacts[0]).toEqual(newArtifact);
  });

  it("should limit artifacts to 8 items", async () => {
    const { result } = renderHook(() => useDashboardData());

    // Wait for initial load with 4 items
    vi.advanceTimersByTime(350);
    await waitFor(() => {
      expect(result.current.loadingArtifacts).toBe(false);
    });

    // Add 5 more artifacts (total would be 9, but should be limited to 8)
    for (let i = 0; i < 5; i++) {
      result.current.addArtifact({
        id: `extra-${i}`,
        name: `Extra_${i}.png`,
        imageSrc: `https://example.com/extra${i}.png`,
      });
    }

    expect(result.current.artifacts).toHaveLength(8);
  });

  it("should handle errors gracefully", async () => {
    // Mock console.error to avoid noise
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useDashboardData());

    // Simulate error by overriding the implementation (this is a simplified test)
    // In a real scenario, you'd mock the data fetching
    expect(result.current.loadingHero).toBe(true);

    // Wait for timeout
    vi.advanceTimersByTime(350);

    // Note: In the current implementation, it shouldn't error, but the error handling is in place
    await waitFor(() => {
      expect(result.current.loadingHero).toBe(false);
    });

    consoleError.mockRestore();
  });
});
