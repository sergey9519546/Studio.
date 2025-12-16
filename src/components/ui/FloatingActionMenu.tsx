import { AnimatePresence, motion } from 'framer-motion';
import {
    Bookmark,
    Camera,
    FileText,
    FolderOpen,
    Image,
    MessageSquare,
    Palette,
    Plus,
    Settings,
    Share,
    Upload,
    Users,
    X,
    Zap
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

interface FloatingActionItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  action: () => void;
  disabled?: boolean;
  description?: string;
}

interface FloatingActionMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  items: FloatingActionItem[];
  mainAction?: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    action: () => void;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
}

export const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({
  isOpen,
  onToggle,
  position = 'bottom-right',
  items,
  mainAction,
  className,
  size = 'md',
  theme = 'dark'
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Handle clicks outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onToggle]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onToggle();
          break;
        case 'Enter':
          event.preventDefault();
          if (activeItem) {
            const item = items.find(i => i.id === activeItem);
            if (item?.action) {
              item.action();
              onToggle();
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeItem, items, onToggle]);

  const getPositionClasses = () => {
    const baseClasses = "fixed z-50";
    
    switch (position) {
      case 'bottom-right':
        return `${baseClasses} bottom-6 right-6`;
      case 'bottom-left':
        return `${baseClasses} bottom-6 left-6`;
      case 'top-right':
        return `${baseClasses} top-6 right-6`;
      case 'top-left':
        return `${baseClasses} top-6 left-6`;
      case 'center':
        return `${baseClasses} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`;
      default:
        return `${baseClasses} bottom-6 right-6`;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          mainButton: "w-12 h-12",
          actionButton: "w-10 h-10",
          iconSize: "w-5 h-5",
          spacing: "space-y-2"
        };
      case 'lg':
        return {
          mainButton: "w-16 h-16",
          actionButton: "w-14 h-14",
          iconSize: "w-7 h-7",
          spacing: "space-y-4"
        };
      default: // md
        return {
          mainButton: "w-14 h-14",
          actionButton: "w-12 h-12",
          iconSize: "w-6 h-6",
          spacing: "space-y-3"
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const calculateRadialPosition = (index: number, total: number) => {
    const angleStep = (2 * Math.PI) / total;
    const angle = angleStep * index - Math.PI / 2; // Start from top
    const radius = size === 'sm' ? 80 : size === 'lg' ? 120 : 100;
    
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    return { x, y };
  };

  const handleItemClick = (item: FloatingActionItem, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!item.disabled) {
      item.action();
      onToggle();
    }
  };

  const renderActionItem = (item: FloatingActionItem, index: number) => {
    const position = calculateRadialPosition(index, items.length);
    const isActive = activeItem === item.id;

    return (
      <motion.div
        key={item.id}
        initial={{ 
          opacity: 0, 
          scale: 0,
          x: 0,
          y: 0
        }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          scale: isOpen ? 1 : 0,
          x: isOpen ? position.x : 0,
          y: isOpen ? position.y : 0
        }}
        exit={{ 
          opacity: 0, 
          scale: 0,
          x: 0,
          y: 0
        }}
        transition={{ 
          duration: 0.3,
          delay: index * 0.05,
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          marginLeft: '-50%',
          marginTop: '-50%'
        }}
      >
        <motion.button
          onClick={(e) => handleItemClick(item, e)}
          onMouseEnter={() => setActiveItem(item.id)}
          onMouseLeave={() => setActiveItem(null)}
          disabled={item.disabled}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "relative flex items-center justify-center rounded-full",
            "bg-white/10 backdrop-blur-xl border border-white/20",
            "shadow-lg shadow-black/20",
            "transition-all duration-200 hover:bg-white/20",
            "focus:outline-none focus:ring-2 focus:ring-white/30",
            item.disabled && "opacity-50 cursor-not-allowed",
            sizeClasses.actionButton,
            item.color && `hover:bg-${item.color}/20 border-${item.color}/30`,
            theme === 'light' && "bg-white/95 border-gray-200 shadow-md hover:bg-gray-50"
          )}
        >
          {/* Icon */}
          <item.icon className={cn(
            sizeClasses.iconSize,
            item.color ? `text-${item.color}` : "text-white",
            theme === 'light' && (item.color ? `text-${item.color}` : "text-gray-700")
          )} />

          {/* Tooltip */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                className={cn(
                  "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2",
                  "px-3 py-2 bg-black/80 backdrop-blur-sm",
                  "text-white text-sm font-medium rounded-lg",
                  "whitespace-nowrap z-10",
                  theme === 'light' && "bg-gray-900 text-white"
                )}
              >
                {item.label}
                {item.description && (
                  <div className="text-xs text-white/70 mt-1">
                    {item.description}
                  </div>
                )}
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                  <div className={cn(
                    "w-0 h-0 border-l-4 border-r-4 border-t-4",
                    "border-transparent border-t-black/80",
                    theme === 'light' && "border-t-gray-900"
                  )} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ripple Effect */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className={cn(
                  "absolute inset-0 rounded-full",
                  item.color ? `bg-${item.color}` : "bg-white",
                  "opacity-20"
                )}
              />
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    );
  };

  const MainIcon = mainAction?.icon || Plus;

  return (
    <div ref={menuRef} className={cn("relative", getPositionClasses(), className)}>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 -m-20 bg-black/20 backdrop-blur-sm rounded-full"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Action Items */}
      <AnimatePresence>
        {isOpen && items.map((item, index) => renderActionItem(item, index))}
      </AnimatePresence>

      {/* Main Action Button */}
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative flex items-center justify-center rounded-full",
          "bg-gradient-to-br from-blue-500 to-purple-600",
          "hover:from-blue-600 hover:to-purple-700",
          "shadow-lg shadow-blue-500/25",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
          sizeClasses.mainButton,
          theme === 'light' && "from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800"
        )}
      >
        {/* Main Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X className={cn(sizeClasses.iconSize, "text-white")} />
          ) : (
            <MainIcon className={cn(sizeClasses.iconSize, "text-white")} />
          )}
        </motion.div>

        {/* Pulse Effect */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.4, opacity: 0 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-blue-500"
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Label for main action */}
      {!isOpen && mainAction?.label && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "absolute left-full top-1/2 transform -translate-y-1/2 ml-3",
            "px-3 py-2 bg-black/80 backdrop-blur-sm",
            "text-white text-sm font-medium rounded-lg",
            "whitespace-nowrap",
            theme === 'light' && "bg-gray-900 text-white"
          )}
        >
          {mainAction.label}
        </motion.div>
      )}
    </div>
  );
};

// Predefined action sets for common use cases
export const createProjectActions = (
  onAction: (action: string, data?: Record<string, unknown>) => void
): FloatingActionItem[] => [
  {
    id: 'new-file',
    label: 'New File',
    icon: FileText,
    color: 'blue',
    action: () => onAction('new-file')
  },
  {
    id: 'upload-asset',
    label: 'Upload Asset',
    icon: Upload,
    color: 'green',
    action: () => onAction('upload-asset')
  },
  {
    id: 'add-freelancer',
    label: 'Add Freelancer',
    icon: Users,
    color: 'purple',
    action: () => onAction('add-freelancer')
  },
  {
    id: 'create-moodboard',
    label: 'Moodboard',
    icon: Palette,
    color: 'pink',
    action: () => onAction('create-moodboard')
  },
  {
    id: 'ai-assistant',
    label: 'AI Assistant',
    icon: Zap,
    color: 'yellow',
    action: () => onAction('ai-assistant')
  },
  {
    id: 'share-project',
    label: 'Share',
    icon: Share,
    color: 'indigo',
    action: () => onAction('share-project')
  }
];

export const createContentActions = (
  onAction: (action: string, data?: Record<string, unknown>) => void
): FloatingActionItem[] => [
  {
    id: 'add-text',
    label: 'Add Text',
    icon: FileText,
    color: 'blue',
    action: () => onAction('add-text')
  },
  {
    id: 'add-image',
    label: 'Add Image',
    icon: Image,
    color: 'green',
    action: () => onAction('add-image')
  },
  {
    id: 'take-photo',
    label: 'Take Photo',
    icon: Camera,
    color: 'purple',
    action: () => onAction('take-photo')
  },
  {
    id: 'ai-generate',
    label: 'AI Generate',
    icon: Zap,
    color: 'yellow',
    action: () => onAction('ai-generate')
  },
  {
    id: 'bookmark',
    label: 'Bookmark',
    icon: Bookmark,
    color: 'pink',
    action: () => onAction('bookmark')
  }
];

export const createNavigationActions = (
  onAction: (action: string, data?: Record<string, unknown>) => void
): FloatingActionItem[] => [
  {
    id: 'go-projects',
    label: 'Projects',
    icon: FolderOpen,
    color: 'blue',
    action: () => onAction('go-projects')
  },
  {
    id: 'go-freelancers',
    label: 'Freelancers',
    icon: Users,
    color: 'green',
    action: () => onAction('go-freelancers')
  },
  {
    id: 'go-messages',
    label: 'Messages',
    icon: MessageSquare,
    color: 'purple',
    action: () => onAction('go-messages')
  },
  {
    id: 'go-settings',
    label: 'Settings',
    icon: Settings,
    color: 'gray',
    action: () => onAction('go-settings')
  }
];

export default FloatingActionMenu;
