import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import RecentArtifactsCard, { Artifact } from "./RecentArtifactsCard";

const sampleArtifacts: Artifact[] = [
  { id: "1", name: "Vega_Logo.png" },
  { id: "2", name: "Nebula_Grid.png" },
  { id: "3", name: "Kinetic_Title.png" },
];

describe("RecentArtifactsCard", () => {
  it("renders artifacts with grid semantics", () => {
    render(<RecentArtifactsCard artifacts={sampleArtifacts} />);

    const grid = screen.getByRole("grid", { name: /recent artifacts/i });
    const cells = within(grid).getAllByRole("gridcell");

    expect(cells).toHaveLength(sampleArtifacts.length);
    expect(
      screen.getByLabelText(/open artifact Vega_Logo.png/i),
    ).toBeInTheDocument();
  });

  it("invokes artifact click handler", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<RecentArtifactsCard artifacts={sampleArtifacts} onArtifactClick={handleClick} />);

    await user.click(screen.getByLabelText(/vega_logo\.png/i));
    expect(handleClick).toHaveBeenCalledWith(sampleArtifacts[0]);
  });

  it("exposes loading state with busy grid", () => {
    render(<RecentArtifactsCard loading />);

    const loadingGrid = screen.getByRole("grid", { name: /loading artifacts/i });
    expect(loadingGrid).toHaveAttribute("aria-busy", "true");
    expect(loadingGrid.querySelectorAll("[aria-hidden='true']").length).toBeGreaterThan(0);
  });

  it("routes to gallery action", async () => {
    const user = userEvent.setup();
    const onViewGallery = vi.fn();

    render(<RecentArtifactsCard onViewGallery={onViewGallery} />);

    await user.click(screen.getByRole("button", { name: /view gallery/i }));
    expect(onViewGallery).toHaveBeenCalled();
  });
});
