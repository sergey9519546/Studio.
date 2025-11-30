import React from 'react';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded' | 'card' | 'tableRow' | 'avatar' | 'overlay';
    count?: number; // For rendering multiple skeletons
}

/**
 * Skeleton component with multiple variants for different loading states
 * - text: inline text skeleton
 * - circular: rounded circle (avatar)
 * - rectangular: hard-edge rectangle
 * - rounded: rounded rectangle
 * - card: full card skeleton (header + content)
 * - tableRow: table row skeleton
 * - avatar: large circular avatar skeleton
 * - overlay: fullscreen loading overlay
 */
const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    width,
    height,
    variant = 'text',
    count = 1,
}) => {
    const baseStyles = "animate-pulse bg-subtle";

    const variants = {
        text: "rounded",
        circular: "rounded-full",
        rectangular: "rounded-md",
        rounded: "rounded-xl",
    };

    const style = {
        width: width,
        height: height,
    };

    // Simple skeleton element
    if (variant !== 'card' && variant !== 'tableRow' && variant !== 'avatar' && variant !== 'overlay') {
        return (
            <div
                className={`${baseStyles} ${variants[variant as keyof typeof variants]} ${className}`}
                style={style}
            />
        );
    }

    // Card skeleton: header + lines of content
    if (variant === 'card') {
        return (
            <div className={`p-6 bg-surface rounded-2xl border border-border-subtle ${className}`}>
                <div className="space-y-4">
                    <div className={`${baseStyles} h-6 w-2/3 rounded-lg`} />
                    <div className="space-y-2">
                        <div className={`${baseStyles} h-4 w-full rounded-lg`} />
                        <div className={`${baseStyles} h-4 w-5/6 rounded-lg`} />
                        <div className={`${baseStyles} h-4 w-4/6 rounded-lg`} />
                    </div>
                </div>
            </div>
        );
    }

    // Table row skeleton
    if (variant === 'tableRow') {
        return (
            <tr className={`animate-pulse ${className}`}>
                <td className="px-6 py-5">
                    <div className={`${baseStyles} h-4 w-20 rounded-lg`} />
                </td>
                <td className="px-6 py-5">
                    <div className="space-y-2">
                        <div className={`${baseStyles} h-4 w-40 rounded-lg`} />
                        <div className={`${baseStyles} h-3 w-24 rounded-lg`} />
                    </div>
                </td>
                <td className="px-6 py-5">
                    <div className={`${baseStyles} h-6 w-20 rounded-lg`} />
                </td>
                <td className="px-6 py-5">
                    <div className={`${baseStyles} h-4 w-32 rounded-lg`} />
                </td>
                <td className="px-6 py-5">
                    <div className={`${baseStyles} h-4 w-16 rounded-lg`} />
                </td>
            </tr>
        );
    }

    // Avatar skeleton: large circular
    if (variant === 'avatar') {
        return (
            <div
                className={`${baseStyles} rounded-full ${className}`}
                style={{ width: width || 64, height: height || 64 }}
            />
        );
    }

    // Overlay skeleton: fullscreen loading indicator
    if (variant === 'overlay') {
        return (
            <div className={`fixed inset-0 z-40 flex items-center justify-center bg-black/10 backdrop-blur-sm ${className}`}>
                <div className="bg-surface rounded-2xl p-8 shadow-lg border border-border-subtle">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-12 h-12">
                            <div className={`${baseStyles} w-full h-full rounded-full`} />
                            <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                        <div className={`${baseStyles} h-4 w-32 rounded-lg`} />
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default Skeleton;
