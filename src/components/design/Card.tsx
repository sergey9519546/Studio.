
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  noPadding = false,
  hoverable = false
}) => {
  return (
    <div 
      className={`
        bg-surface 
        border border-border-subtle 
        rounded-2xl 
        shadow-card
        overflow-hidden
        transition-all duration-200
        ${hoverable ? 'hover:-translate-y-[2px] hover:shadow-lg cursor-pointer' : ''}
        ${className}
      `}
    >
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};
