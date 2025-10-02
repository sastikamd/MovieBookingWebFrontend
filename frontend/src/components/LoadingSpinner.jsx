import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  return (
    <div 
      className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
    />
  );
};

export const LoadingMovieCard = () => (
  <div className="movie-card">
    <div className="skeleton aspect-poster"></div>
    <div className="p-4 space-y-3">
      <div className="skeleton h-6 w-3/4"></div>
      <div className="skeleton h-4 w-1/2"></div>
      <div className="skeleton h-4 w-2/3"></div>
      <div className="flex justify-between items-center">
        <div className="skeleton h-5 w-20"></div>
        <div className="skeleton h-8 w-24"></div>
      </div>
    </div>
  </div>
);

export const LoadingPage = ({ message = "Loading..." }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-lg text-gray-600">{message}</p>
    </div>
  </div>
);

export default LoadingSpinner;