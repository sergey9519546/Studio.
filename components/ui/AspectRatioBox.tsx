import React from 'react';

interface AspectRatioBoxProps {
  ratio?: 'square' | 'video' | 'portrait' | '4/3' | '21/9' | string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Container that maintains aspect ratio to prevent CLS
 * Useful for wrapping dynamic content like images, videos, or iframes
 */
const AspectRatioBox: React.FC<AspectRatioBoxProps> = ({
  ratio = 'square',
  children,
  className = '',
}) => {
  const getAspectRatio = () => {
    switch (ratio) {
      case 'square':
        return '1 / 1';
      case 'video':
        return '16 / 9';
      case 'portrait':
        return '3 / 4';
      case '4/3':
        return '4 / 3';
      case '21/9':
        return '21 / 9';
      default:
        return ratio;
    }
  };

  return (
    <div
      className={`relative w-full ${className}`}
      style={{ aspectRatio: getAspectRatio() }}
    >
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
};

export default AspectRatioBox;