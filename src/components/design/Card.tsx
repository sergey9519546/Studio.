import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  hoverable?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  noPadding = false,
  hoverable = false,
  glass = false,
  onClick,
}) => {
  return (
    <div 
      className={`
        bg-surface
        rounded-[24px]
        shadow-ambient
        overflow-hidden
        transition-all duration-200
        ${glass ? 'glass' : ''}
        ${hoverable ? 'hover:-translate-y-0.5 hover:shadow-float cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};
