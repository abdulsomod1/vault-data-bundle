'use client';

import React from 'react';
import { CardProps } from '@/types';

const Card: React.FC<CardProps> = ({ children, title, subtitle, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
