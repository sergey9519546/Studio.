import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
  hoverable?: boolean;
  glass?: boolean;
}

const CardComponent: React.FC<CardProps> = ({
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
        outline-none
        ${glass ? 'glass' : ''}
        ${hoverable ? 'hover:-translate-y-0.5 hover:shadow-float cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2' : ''}
        ${className}
      `}
    >
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};

// Using React.memo to prevent unnecessary re-renders of the card component
// when its props do not change. This is a performance optimization.
export const Card = React.memo(CardComponent);

export default Card;
