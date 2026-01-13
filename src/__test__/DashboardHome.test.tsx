import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Artifact } from "../components/dashboard/RecentArtifactsCard";
import { DashboardCounts } from "../hooks/useDashboardData";
import { useDashboardData } from "../hooks/useDashboardData";
import { useToast } from "../hooks/useToast";
import DashboardHome from "../views/DashboardHome";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the hooks
vi.mock("../hooks/useDashboardData");
vi.mock("../hooks/useToast");

interface MockDashboardHeaderProps {
  onNewProjectClick: () => void;
  projectCount: number;
  freelancerCount: number;
  moodboardCount: number;
}

interface MockHeroProjectCardProps {
  title: string;
  description: string;
}

interface MockLuminaAICardProps {
  onSubmitPrompt: (prompt: string) => void;
}

interface MockVibePaletteCardProps {
  onColorSelect: (color: string) => void;
  selectedColor?: string;
}

interface MockRecentArtifactsCardProps {
  artifacts: Artifact[];
  loading?: boolean;
  onViewGallery?: () => void;
  onArtifactClick?: (artifact: Artifact) => void;
}

// Mock the child components
vi.mock("../components/dashboard/DashboardHeader", () => ({
  default: ({
    onNewProjectClick,
    projectCount,
    freelancerCount,
    moodboardCount,
  }: MockDashboardHeaderProps) => (
    <div data-testid="dashboard-header">
      <div data-testid="counts">
        {projectCount}-{freelancerCount}-{moodboardCount}
      </div>
      <button
        onClick={onNewProjectClick}
        data-testid="new-project-btn"
        aria-label="Create a new project"
      >
        New Project
      </button>
    </div>
  ),
}));

vi.mock("../components/dashboard/HeroProjectCard", () => ({
  default: ({ title, description }: MockHeroProjectCardProps) => (
    <div data-testid="hero-project-card">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
}));

vi.mock("@/components/dashboard/LuminaAICard", () => ({
  default: ({ onSubmitPrompt }: MockLuminaAICardProps) => (
    <div data-testid="spark-ai-card">
      <button
        onClick={() => onSubmitPrompt("Test prompt")}
        data-testid="submit-prompt-btn"
        aria-label="Submit prompt"
      >
        Submit
      </button>
    </div>
  ),
}));

vi.mock("../components/dashboard/VibePaletteCard", () => ({
  default: ({ onColorSelect }: MockVibePaletteCardProps) => (
    <div data-testid="vibe-palette-card">
      <button
        onClick={() => onColorSelect("#FF0000")}
        data-testid="color-select-btn"
      >
        Select Red
      </button>
    </div>
  ),
}));

vi.mock("../components/dashboard/RecentArtifactsCard", () => ({
  default: ({ artifacts }: MockRecentArtifactsCardProps) => (
    <div data-testid="recent-artifacts-card">
      {artifacts.map((artifact: Artifact) => (
        <div key={artifact.id} data-testid={`artifact-${artifact.id}`}>
          {artifact.name}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../components/dashboard/RecentActivityWidget", () => ({
  default: () => <div data-testid="recent-activity-widget" />,
}));

vi.mock("../components/dashboard/ResourceUsageWidget", () => ({
  default: ({ counts }: { counts: DashboardCounts }) => (
    <div data-testid="resource-usage-widget">
      {counts.projects}
    </div>
  ),
}));

vi.mock("../components/projects/CreateProjectModal", () => ({
  default: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="create-project-modal">{isOpen ? "open" : "closed"}</div>
  ),
}));

describe("DashboardHome", () => {
  const mockAddToast = vi.fn();
  const mockRefetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useDashboardData as Mock).mockReturnValue({
      heroProject: {
        id: "hero-1",
        title: "Nebula Phase II",
        description: "Comprehensive rebrand focusing on kinetic typography",
        status: "IN_PROGRESS",
        client: "Studio",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
      },
      heroImage: "https://example.com/image.jpg",
      artifacts: [
        {
          id: "art-1",
          name: "Nebula_Launch.png",
          imageSrc: "https://example.com/art1.jpg",
        },
      ],
      activities: [],
      counts: {
        projects: 1,
        freelancers: 2,
        moodboardItems: 3,
      },
      loadingHero: false,
      loadingArtifacts: false,
      errorHero: null,
      errorArtifacts: null,
      refetch: mockRefetch,
    });

    (useToast as Mock).mockReturnValue({
      toasts: [],
      addToast: mockAddToast,
    });
  });

  it("renders the dashboard with hero project", async () => {
    render(
      <MemoryRouter>
        <DashboardHome />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("dashboard-header")).toBeInTheDocument();
      expect(screen.getByTestId("hero-project-card")).toBeInTheDocument();
      expect(screen.getByTestId("spark-ai-card")).toBeInTheDocument();
      expect(screen.getByTestId("vibe-palette-card")).toBeInTheDocument();
      expect(screen.getByTestId("recent-artifacts-card")).toBeInTheDocument();
    });

    expect(screen.getByText("Nebula Phase II")).toBeInTheDocument();
    expect(
      screen.getByText("Comprehensive rebrand focusing on kinetic typography")
    ).toBeInTheDocument();
  });

  it("opens create project modal when clicking new project button", async () => {
    render(
      <MemoryRouter>
        <DashboardHome />
      </MemoryRouter>
    );

    const newProjectBtn = screen.getByTestId("new-project-btn");
    fireEvent.click(newProjectBtn);

    expect(screen.getByTestId("create-project-modal")).toHaveTextContent(
      "open"
    );
  });

  it("navigates to writers room on prompt submission", async () => {
    render(
      <MemoryRouter>
        <DashboardHome />
      </MemoryRouter>
    );

    const submitBtn = screen.getByTestId("submit-prompt-btn");
    fireEvent.click(submitBtn);

    const expectedParams = new URLSearchParams({
      project: "hero-1",
      prompt: "Test prompt",
    }).toString();

    expect(mockNavigate).toHaveBeenCalledWith(
      `/writers-room?${expectedParams}`
    );
  });

  it("handles color selection", async () => {
    render(
      <MemoryRouter>
        <DashboardHome />
      </MemoryRouter>
    );

    const colorBtn = screen.getByTestId("color-select-btn");
    fireEvent.click(colorBtn);

    expect(mockAddToast).toHaveBeenCalledWith("Accent updated to #FF0000", "info");
  });
});
