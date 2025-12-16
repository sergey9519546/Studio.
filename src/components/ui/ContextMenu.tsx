import { AnimatePresence, motion } from 'framer-motion';
import {
    Check,
    ChevronRight,
    Copy,
    Download,
    Edit,
    ExternalLink,
    FileText,
    Folder,
    Image,
    Plus,
    Search,
    Settings,
    Share,
    Star,
    Trash2,
    User
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  submenu?: ContextMenuItem[];
  action?: () => void;
  danger?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  className?: string;
  theme?: 'light' | 'dark';
}

interface ContextMenuState {
  activeSubmenu: string | null;
  activeIndex: number;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  isOpen,
  position,
  onClose,
  className,
  theme = 'dark'
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ContextMenuState>({
    activeSubmenu: null,
    activeIndex: -1
  });

  // Handle clicks outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Handle keyboard navigation
  const getVisibleItems = useCallback(() => items.filter(item => !item.separator), [items]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      const visibleItems = getVisibleItems();
      const currentItems = state.activeSubmenu 
        ? items.find(item => item.id === state.activeSubmenu)?.submenu || []
        : visibleItems;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setState(prev => ({
            ...prev,
            activeIndex: Math.min(prev.activeIndex + 1, currentItems.length - 1)
          }));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setState(prev => ({
            ...prev,
            activeIndex: Math.max(prev.activeIndex - 1, 0)
          }));
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (state.activeIndex >= 0 && currentItems[state.activeIndex]?.submenu) {
            setState(prev => ({
              ...prev,
              activeSubmenu: currentItems[state.activeIndex].id
            }));
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (state.activeSubmenu) {
            setState(prev => ({
              ...prev,
              activeSubmenu: null,
              activeIndex: -1
            }));
          } else {
            onClose();
          }
          break;
        case 'Enter':
          event.preventDefault();
          if (state.activeIndex >= 0) {
            const item = currentItems[state.activeIndex];
            if (item?.submenu) {
              setState(prev => ({
                ...prev,
                activeSubmenu: item.id
              }));
            } else if (item?.action) {
              item.action();
              onClose();
            }
          }
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [getVisibleItems, isOpen, items, onClose, state]);

  // Reset state when menu closes
  useEffect(() => {
    if (!isOpen) {
      setState({ activeSubmenu: null, activeIndex: -1 });
    }
  }, [isOpen]);

  const handleItemClick = (item: ContextMenuItem, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (item.submenu) {
      setState(prev => ({
        ...prev,
        activeSubmenu: item.id,
        activeIndex: 0
      }));
    } else if (item.action) {
      item.action();
      onClose();
    }
  };

  const renderMenuItem = (item: ContextMenuItem, index: number, isSubmenu = false) => {
    if (item.separator) {
      return (
        <div
          key={item.id}
          className={cn(
            "h-px bg-white/10 mx-2 my-1",
            theme === 'light' && "bg-gray-300"
          )}
        />
      );
    }

    const isActive = state.activeIndex === index && !state.activeSubmenu;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const Icon = item.icon;

    return (
      <motion.button
        key={item.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.02 }}
        onClick={(e) => handleItemClick(item, e)}
        onMouseEnter={() => {
          if (!item.submenu) {
            setState(prev => ({ ...prev, activeIndex: index }));
          }
        }}
        disabled={item.disabled}
        className={cn(
          "w-full px-3 py-2 text-left flex items-center space-x-3 text-sm",
          "transition-colors duration-150 relative group",
          item.disabled 
            ? "opacity-50 cursor-not-allowed" 
            : "hover:bg-white/10 cursor-pointer",
          isActive && "bg-white/10",
          item.danger && "hover:bg-red-500/20",
          isSubmenu && "px-2 py-1.5 text-xs"
        )}
      >
        {/* Icon */}
        {Icon && (
          <Icon className={cn(
            "w-4 h-4 flex-shrink-0",
            item.danger ? "text-red-400" : "text-white/70",
            theme === 'light' && item.danger ? "text-red-600" : "text-gray-600"
          )} />
        )}

        {/* Label */}
        <span className={cn(
          "flex-1 font-medium truncate",
          item.danger ? "text-red-400" : "text-white",
          theme === 'light' && item.danger ? "text-red-600" : "text-gray-800"
        )}>
          {item.label}
        </span>

        {/* Shortcut */}
        {item.shortcut && (
          <span className={cn(
            "text-xs font-mono opacity-60",
            theme === 'light' && "text-gray-500"
          )}>
            {item.shortcut}
          </span>
        )}

        {/* Submenu indicator */}
        {hasSubmenu && (
          <ChevronRight className="w-3 h-3 opacity-60" />
        )}

        {/* Active indicator */}
        {isActive && !hasSubmenu && (
          <Check className="w-3 h-3 text-white/80" />
        )}
      </motion.button>
    );
  };

  const renderSubmenu = (submenuItems: ContextMenuItem[]) => {
    const visibleSubmenuItems = submenuItems.filter(item => !item.separator);
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className={cn(
          "absolute left-full top-0 ml-1 min-w-48",
          "bg-white/10 backdrop-blur-xl border border-white/20",
          "rounded-lg shadow-2xl shadow-black/20",
          "py-1 z-50",
          theme === 'light' && "bg-white/95 border-gray-200 shadow-lg"
        )}
      >
        {visibleSubmenuItems.map((item, index) => renderMenuItem(item, index, true))}
      </motion.div>
    );
  };

  if (!isOpen) return null;

  const visibleItems = getVisibleItems();

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95, y: -5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -5 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "fixed z-50 min-w-56",
          "bg-white/10 backdrop-blur-xl border border-white/20",
          "rounded-lg shadow-2xl shadow-black/20",
          "py-1 overflow-hidden",
          theme === 'light' && "bg-white/95 border-gray-200 shadow-lg",
          className
        )}
        style={{
          left: position.x,
          top: position.y,
          maxHeight: 'calc(100vh - 20px)',
          overflowY: 'auto'
        }}
      >
        {/* Menu Items */}
        <div className="py-1">
          {visibleItems.map((item, index) => renderMenuItem(item, index))}
        </div>

        {/* Submenu Overlay */}
        <AnimatePresence>
          {state.activeSubmenu && (
            <div className="absolute inset-0">
              {(() => {
                const submenuItem = items.find(item => item.id === state.activeSubmenu);
                return submenuItem?.submenu 
                  ? renderSubmenu(submenuItem.submenu)
                  : null;
              })()}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

// Predefined menu templates for common use cases
export const createProjectContextMenu = (
  projectId: string,
  onAction: (action: string, data?: Record<string, unknown>) => void
): ContextMenuItem[] => [
  {
    id: 'view',
    label: 'View Project',
    icon: Folder,
    action: () => onAction('view', { projectId })
  },
  {
    id: 'edit',
    label: 'Edit Project',
    icon: Edit,
    shortcut: 'E',
    action: () => onAction('edit', { projectId })
  },
  {
    id: 'duplicate',
    label: 'Duplicate',
    icon: Copy,
    shortcut: 'D',
    action: () => onAction('duplicate', { projectId })
  },
  {
    id: 'separator-1',
    label: '',
    separator: true
  },
  {
    id: 'add-freelancer',
    label: 'Add Freelancer',
    icon: User,
    action: () => onAction('add-freelancer', { projectId })
  },
  {
    id: 'create-task',
    label: 'Create Task',
    icon: Plus,
    action: () => onAction('create-task', { projectId })
  },
  {
    id: 'separator-2',
    label: '',
    separator: true
  },
  {
    id: 'share',
    label: 'Share',
    icon: Share,
    action: () => onAction('share', { projectId })
  },
  {
    id: 'download',
    label: 'Export',
    icon: Download,
    action: () => onAction('download', { projectId })
  },
  {
    id: 'separator-3',
    label: '',
    separator: true
  },
  {
    id: 'favorite',
    label: 'Add to Favorites',
    icon: Star,
    action: () => onAction('favorite', { projectId })
  },
  {
    id: 'settings',
    label: 'Project Settings',
    icon: Settings,
    action: () => onAction('settings', { projectId })
  },
  {
    id: 'separator-4',
    label: '',
    separator: true
  },
  {
    id: 'delete',
    label: 'Delete Project',
    icon: Trash2,
    shortcut: 'Del',
    danger: true,
    action: () => onAction('delete', { projectId })
  }
];

export const createFileContextMenu = (
  fileId: string,
  fileType: string,
  onAction: (action: string, data?: Record<string, unknown>) => void
): ContextMenuItem[] => [
  {
    id: 'open',
    label: 'Open',
    icon: ExternalLink,
    action: () => onAction('open', { fileId, fileType })
  },
  {
    id: 'preview',
    label: 'Preview',
    icon: Image,
    action: () => onAction('preview', { fileId, fileType })
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: Edit,
    shortcut: 'E',
    action: () => onAction('edit', { fileId, fileType })
  },
  {
    id: 'separator-1',
    label: '',
    separator: true
  },
  {
    id: 'rename',
    label: 'Rename',
    icon: FileText,
    shortcut: 'F2',
    action: () => onAction('rename', { fileId, fileType })
  },
  {
    id: 'duplicate',
    label: 'Duplicate',
    icon: Copy,
    shortcut: 'D',
    action: () => onAction('duplicate', { fileId, fileType })
  },
  {
    id: 'separator-2',
    label: '',
    separator: true
  },
  {
    id: 'download',
    label: 'Download',
    icon: Download,
    action: () => onAction('download', { fileId, fileType })
  },
  {
    id: 'share',
    label: 'Share',
    icon: Share,
    action: () => onAction('share', { fileId, fileType })
  },
  {
    id: 'separator-3',
    label: '',
    separator: true
  },
  {
    id: 'properties',
    label: 'Properties',
    icon: Settings,
    action: () => onAction('properties', { fileId, fileType })
  },
  {
    id: 'separator-4',
    label: '',
    separator: true
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: Trash2,
    shortcut: 'Del',
    danger: true,
    action: () => onAction('delete', { fileId, fileType })
  }
];

export const createTextContextMenu = (
  onAction: (action: string, data?: Record<string, unknown>) => void
): ContextMenuItem[] => [
  {
    id: 'cut',
    label: 'Cut',
    icon: FileText,
    shortcut: 'Ctrl+X',
    action: () => onAction('cut')
  },
  {
    id: 'copy',
    label: 'Copy',
    icon: Copy,
    shortcut: 'Ctrl+C',
    action: () => onAction('copy')
  },
  {
    id: 'paste',
    label: 'Paste',
    icon: Plus,
    shortcut: 'Ctrl+V',
    action: () => onAction('paste')
  },
  {
    id: 'separator-1',
    label: '',
    separator: true
  },
  {
    id: 'select-all',
    label: 'Select All',
    icon: Search,
    shortcut: 'Ctrl+A',
    action: () => onAction('select-all')
  },
  {
    id: 'separator-2',
    label: '',
    separator: true
  },
  {
    id: 'translate',
    label: 'Translate',
    icon: ExternalLink,
    action: () => onAction('translate')
  },
  {
    id: 'search',
    label: 'Search',
    icon: Search,
    shortcut: 'Ctrl+F',
    action: () => onAction('search')
  }
];

export default ContextMenu;
