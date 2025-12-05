import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = "", onClick, noPadding = false }) => (
  <div
    onClick={onClick}
    className={`bg-surface border border-subtle-alpha rounded-xl ${noPadding ? '' : 'p-8'} transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-[2px] ${className}`}
  >
    {children}
  </div>
);

export default Card;
