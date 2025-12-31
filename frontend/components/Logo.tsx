import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showText?: boolean;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export default function Logo({ 
  className = '', 
  showText = true,
  showTagline = false,
  size = 'md',
  href 
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const LogoContent = () => (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center space-x-2">
        {/* Icon - Modern "P" in a rounded square */}
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm`}>
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-white"
            style={{ width: '60%', height: '60%' }}
          >
            <path
              d="M8 6V18M8 6H14C15.6569 6 17 7.34315 17 9C17 10.6569 15.6569 12 14 12H8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        {/* Text */}
        {showText && (
          <span className={`font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
            Promptly
          </span>
        )}
      </div>
      
      {/* Tagline */}
      {showTagline && (
        <p className="text-xs font-medium text-primary-600 mt-0.5 ml-0">
          Replies, right on time
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
}

