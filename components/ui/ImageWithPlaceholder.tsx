import { ImageOff, Loader2 } from 'lucide-react';
import React, { useId, useState } from 'react';

interface ImageWithPlaceholderProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  /** Image source URL - required */
  src: string;
  /** Alt text for accessibility - required and enforced */
  alt: string;
  /** Width of the image container */
  width?: string | number;
  /** Height of the image container */
  height?: string | number;
  /** Predefined or custom aspect ratio */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | 'auto' | string;
  /** Custom placeholder background class */
  placeholderClassName?: string;
  /** Fallback image source if main image fails */
  fallbackSrc?: string;
  /** Custom fallback content when image fails */
  fallbackContent?: React.ReactNode;
  /** Object fit style for the image */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Rounded corners variant */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Show loading skeleton */
  showSkeleton?: boolean;
  /** Caption for the image */
  caption?: string;
  /** Role for the image - defaults to 'img' */
  role?: string;
  /** Callback when image loads successfully */
  onLoadSuccess?: () => void;
  /** Callback when image fails to load */
  onLoadError?: () => void;
}

const aspectRatioMap: Record<string, string> = {
  square: '1 / 1',
  video: '16 / 9',
  portrait: '3 / 4',
  wide: '21 / 9',
  auto: 'auto',
};

const roundedMap: Record<string, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

/**
 * Accessible Image component with placeholder to prevent CLS (Cumulative Layout Shift)
 * 
 * Features:
 * - Required alt text for accessibility
 * - Loading state with spinner
 * - Error state with fallback
 * - Prevents layout shift
 * - Supports lazy loading
 * - Optional figure/caption support
 */
const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({
  src,
  alt,
  width,
  height,
  aspectRatio = 'square',
  placeholderClassName = 'bg-subtle',
  fallbackSrc,
  fallbackContent,
  objectFit = 'cover',
  rounded = 'lg',
  showSkeleton = true,
  caption,
  role = 'img',
  className = '',
  loading = 'lazy',
  onLoadSuccess,
  onLoadError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const captionId = useId();

  // Warn in development if alt text is empty (decorative images should use alt="")
  if (process.env.NODE_ENV === 'development' && alt === undefined) {
    console.warn('ImageWithPlaceholder: alt prop is required for accessibility. Use alt="" for decorative images.');
  }

  // Calculate aspect ratio style
  const getAspectRatioStyle = (): React.CSSProperties => {
    if (aspectRatio === 'auto') return {};
    const ratio = aspectRatioMap[aspectRatio] || aspectRatio;
    return { aspectRatio: ratio };
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoadSuccess?.();
  };

  const handleError = () => {
    if (fallbackSrc && !useFallback) {
      setUseFallback(true);
      return;
    }
    setHasError(true);
    setIsLoaded(true);
    onLoadError?.();
  };

  const currentSrc = useFallback && fallbackSrc ? fallbackSrc : src;
  const roundedClass = roundedMap[rounded];

  const imageElement = (
    <div
      className={`relative overflow-hidden ${placeholderClassName} ${roundedClass}`}
      style={{
        width: width || '100%',
        height: height || 'auto',
        ...getAspectRatioStyle(),
      }}
      role="presentation"
    >
      {/* Loading State */}
      {!isLoaded && showSkeleton && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-subtle animate-pulse"
          aria-hidden="true"
        >
          <Loader2 className="w-6 h-6 text-ink-tertiary animate-spin" />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-subtle gap-2"
          role="img"
          aria-label={`Image failed to load: ${alt}`}
        >
          {fallbackContent || (
            <>
              <ImageOff className="w-8 h-8 text-ink-tertiary" aria-hidden="true" />
              <span className="text-xs text-ink-tertiary font-medium">Failed to load image</span>
            </>
          )}
        </div>
      )}

      {/* Actual Image */}
      {!hasError && (
        <img
          src={currentSrc}
          alt={alt}
          width={typeof width === 'number' ? width : undefined}
          height={typeof height === 'number' ? height : undefined}
          loading={loading}
          decoding="async"
          role={alt === '' ? 'presentation' : role}
          aria-describedby={caption ? captionId : undefined}
          className={`
            ${className} 
            ${isLoaded ? 'opacity-100' : 'opacity-0'} 
            transition-opacity duration-300 ease-out
          `.trim().replace(/\s+/g, ' ')}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit,
          }}
          {...props}
        />
      )}
    </div>
  );

  // If caption is provided, wrap in figure element
  if (caption) {
    return (
      <figure className="flex flex-col gap-2">
        {imageElement}
        <figcaption 
          id={captionId}
          className="text-sm text-ink-secondary text-center"
        >
          {caption}
        </figcaption>
      </figure>
    );
  }

  return imageElement;
};

export default ImageWithPlaceholder;

// Avatar variant for profile images
interface AvatarProps {
  src?: string;
  alt: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const avatarSizes: Record<string, { container: string; text: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-[10px]' },
  sm: { container: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-10 h-10', text: 'text-sm' },
  lg: { container: 'w-12 h-12', text: 'text-base' },
  xl: { container: 'w-16 h-16', text: 'text-lg' },
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const { container, text } = avatarSizes[size];

  // Generate initials from name
  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || '?';
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Generate a consistent color based on name
  const getBackgroundColor = (name?: string) => {
    if (!name) return 'bg-ink-tertiary';
    const colors = [
      'bg-primary',
      'bg-edge-teal',
      'bg-edge-magenta',
      'bg-state-success',
      'bg-state-warning',
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  if (!src || hasError) {
    return (
      <div
        className={`
          ${container} 
          ${getBackgroundColor(name)} 
          rounded-full 
          flex items-center justify-center 
          text-white 
          font-semibold 
          ${text}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        role="img"
        aria-label={alt || `Avatar for ${name || 'unknown user'}`}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div className={`${container} rounded-full overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
};
