import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = "", noPadding = false, ...rest }) => (
  <div
    {...rest}
    className={`bg-surface border border-subtle-alpha rounded-xl ${noPadding ? '' : 'p-8'} transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-[2px] ${className}`}
  >
    {children}
  </div>
);

export default Card;
