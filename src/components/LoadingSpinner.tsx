import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className = "", 
  text = "Loading..." 
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="text-gray-600">{text}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner; 