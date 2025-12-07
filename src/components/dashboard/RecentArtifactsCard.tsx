import { ImageIcon } from "lucide-react";
import React, { useState } from "react";
import Card from "../../components/ui/Card";

export interface Artifact {
  id: string | number;
  name: string;
  imageSrc?: string; // If actual images are available
}

interface RecentArtifactsCardProps {
  artifacts?: Artifact[];
  onViewGallery?: () => void;
  onArtifactClick?: (artifact: Artifact) => void;
  className?: string;
  loading?: boolean;
}

const DEFAULT_ARTIFACTS: Artifact[] = [1, 2, 3, 4].map((i) => ({
  id: i,
  name: `Render_${i}.png`,
}));

interface ArtifactItemProps {
  artifact: Artifact;
  onClick?: (artifact: Artifact) => void;
}

const ArtifactItem: React.FC<ArtifactItemProps> = ({ artifact, onClick }) => {
  const [imageError, setImageError] = useState(false);

  const handleClick = () => onClick?.(artifact);

  const hasImage = artifact.imageSrc && !imageError;

  return (
    <button
      type="button"
      className="rounded-2xl bg-subtle border border-border-subtle relative group overflow-hidden cursor-pointer aspect-[4/3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary w-full h-full text-left"
      onClick={handleClick}
      aria-label={`Open artifact ${artifact.name}`}
    >
      {hasImage ? (
        <img
          src={artifact.imageSrc}
          alt={artifact.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-ink-tertiary group-hover:scale-110 transition-transform duration-500">
          <ImageIcon size={24} />
        </div>
      )}
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-2 left-2 right-2 bg-surface/90 backdrop-blur-md px-3 py-2 rounded-xl translate-y-full group-hover:translate-y-0 transition-transform duration-300 border border-border-subtle shadow-sm">
        <div className="text-[10px] font-bold truncate text-ink-primary">
          {artifact.name}
        </div>
      </div>
    </button>
  );
};

const RecentArtifactsCard: React.FC<RecentArtifactsCardProps> = ({
  artifacts = DEFAULT_ARTIFACTS,
  onViewGallery,
  onArtifactClick,
  className = "",
  loading = false,
}) => {
  const hasArtifacts = artifacts.length > 0;
  const srLabel = loading
    ? "Loading recent artifacts"
    : hasArtifacts
    ? `Showing ${artifacts.length} recent artifact${artifacts.length === 1 ? "" : "s"}`
    : "No artifacts yet";

  return (
    <Card
      className={`flex flex-col shadow-md border-border-subtle bg-surface h-full ${className}`}
      aria-busy={loading}
      aria-live="polite"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-ink-secondary">
          Recent Artifacts
        </h3>
        <button
          className="text-xs font-bold text-ink-primary hover:opacity-70 transition-opacity"
          onClick={onViewGallery}
        >
          View Gallery
        </button>
      </div>
      <span className="sr-only">{srLabel}</span>
      {loading ? (
        <div
          className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          aria-label="Loading artifacts"
          aria-busy="true"
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-subtle border border-border-subtle aspect-[4/3] animate-pulse"
              aria-hidden="true"
            />
          ))}
        </div>
      ) : hasArtifacts ? (
        <div
          className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          aria-label="Recent artifacts"
        >
          {artifacts.map((artifact) => (
            <ArtifactItem
              key={artifact.id.toString()}
              artifact={artifact}
              onClick={onArtifactClick}
            />
          ))}
        </div>
      ) : (
        <div
          className="flex-1 rounded-xl bg-subtle border border-border-subtle p-6 flex flex-col items-start justify-center gap-3"
          role="status"
          aria-live="polite"
        >
          <div className="text-sm font-medium text-ink-primary">No artifacts yet</div>
          <p className="text-xs text-ink-secondary">
            Generate with Spark or upload a render to populate this space.
          </p>
          <button
            className="text-xs font-bold text-ink-primary hover:opacity-70 transition-opacity underline-offset-2 underline"
            onClick={onViewGallery}
          >
            Open Gallery
          </button>
        </div>
      )}
    </Card>
  );
};

export default RecentArtifactsCard;
