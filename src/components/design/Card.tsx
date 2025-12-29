import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
  hoverable?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  noPadding = false,
  hoverable = false,
  glass = false,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={`
        bg-surface
        border border-border-subtle
        rounded-[24px]
        shadow-ambient
        overflow-hidden
        transition-all duration-200
        ${glass ? 'glass' : ''}
        ${hoverable ? 'hover:-translate-y-0.5 hover:shadow-float cursor-pointer' : ''}
        ${className}
      `}
    >
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};

export default Card;
