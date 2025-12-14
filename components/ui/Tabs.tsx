import React, { createContext, ReactNode, useContext, useState } from 'react';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

interface TabsProps {
  /** Default active tab */
  defaultValue?: string;
  /** Active tab value (controlled) */
  value?: string;
  /** On value change callback */
  onValueChange?: (value: string) => void;
  /** Tabs children */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const isControlled = value !== undefined;
  const activeTab = isControlled ? value : internalValue;

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  /** Tabs list children */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

const TabsList: React.FC<TabsListProps> = ({
  children,
  className = '',
}) => {
  const tabsListStyles = `
    flex items-center gap-1 p-1
    bg-subtle rounded-xl
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={tabsListStyles} role="tablist">
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  /** Trigger value */
  value: string;
  /** Trigger content */
  children: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  disabled = false,
  className = '',
}) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  const triggerStyles = `
    px-4 py-2 text-sm font-medium rounded-lg
    transition-all duration-200
    ${isActive 
      ? 'bg-white text-ink-primary shadow-sm' 
      : 'text-ink-secondary hover:text-ink-primary hover:bg-white/50'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(value);
    }
  };

  return (
    <button
      type="button"
      className={triggerStyles}
      onClick={handleClick}
      disabled={disabled}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tab-panel-${value}`}
      id={`tab-trigger-${value}`}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  /** Content value */
  value: string;
  /** Content children */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className = '',
}) => {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) {
    return null;
  }

  const contentStyles = `
    mt-4
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div
      className={contentStyles}
      role="tabpanel"
      aria-labelledby={`tab-trigger-${value}`}
      id={`tab-panel-${value}`}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsContent, TabsList, TabsTrigger };
export default Tabs;
