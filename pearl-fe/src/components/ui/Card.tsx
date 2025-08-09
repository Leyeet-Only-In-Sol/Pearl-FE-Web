import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false 
}) => {
  const cardClass = hover ? 'card-hover' : 'card';
  
  return (
    <div className={`${cardClass} ${className}`}>
      {children}
    </div>
  );
};