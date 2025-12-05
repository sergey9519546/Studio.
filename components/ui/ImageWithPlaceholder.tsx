import React, { useState } from 'react';

interface ImageWithPlaceholderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  aspectRatio?: 'square' | 'video' | 'portrait' | string;
  placeholderClassName?: string;
}

/**
 * Image component with placeholder to prevent CLS (Cumulative Layout Shift)
 * Reserves space before image loads and provides loading state
 */
const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({
  src,
  alt,
  width,
  height,
  aspectRatio = 'square',
  placeholderClassName = 'bg-gray-100',
  className = '',
  loading = 'lazy',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Calculate aspect ratio style
  const getAspectRatioStyle = () => {
    if (aspectRatio === 'square') return { aspectRatio: '1 / 1' };
    if (aspectRatio === 'video') return { aspectRatio: '16 / 9' };
    if (aspectRatio === 'portrait') return { aspectRatio: '3 / 4' };
    if (aspectRatio.includes('/')) return { aspectRatio };
    return {};
  };

  return (
    <div
      className={`relative overflow-hidden ${placeholderClassName}`}
      style={{
        width: width || '100%',
        height: height || 'auto',
        ...getAspectRatioStyle(),
      }}
    >
      {/* Placeholder/Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-xs text-gray-400">Failed to load</span>
        </div>
      )}

      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        {...props}
      />
    </div>
  );
};

export default ImageWithPlaceholder;