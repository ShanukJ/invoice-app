import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-50 p-5 rounded-xl border-2 border-gray-200 ${className}`}>
      {children}
    </div>
  );
};
