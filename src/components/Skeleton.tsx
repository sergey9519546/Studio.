import React from "react";
import "./Skeleton.css";

interface SkeletonProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  variant?: "text" | "rectangular" | "circular";
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width,
  height,
  borderRadius,
  variant = "rectangular"
}) => {
  const style = React.useMemo(() => ({
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
  }), [width, height, borderRadius]);

  const variantClasses = {
    text: "skeleton-text",
    rectangular: "skeleton-rectangular",
    circular: "skeleton-circular"
  };

  return (
    <div
      className={`skeleton ${variantClasses[variant]} ${className}`}
      style={style}
      role="presentation"
      aria-hidden="true"
    />
  );
};

export default Skeleton;
