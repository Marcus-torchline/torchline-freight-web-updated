import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="relative w-12 h-12">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="torchGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#60D5E8', stopOpacity: 1 }} />
              <stop offset="25%" style={{ stopColor: '#4CAF50', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#FFC107', stopOpacity: 1 }} />
              <stop offset="75%" style={{ stopColor: '#FF9800', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#F44336', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            d="M100 40 Q85 60 85 80 Q85 95 95 105 L95 140 L105 140 L105 105 Q115 95 115 80 Q115 60 100 40 Z"
            fill="url(#torchGradient)"
          />
          <ellipse cx="100" cy="145" rx="15" ry="8" fill="#D84315" />
          <path
            d="M90 145 L85 160 Q85 165 100 165 Q115 165 115 160 L110 145 Z"
            fill="#BF360C"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-wider">TORCHLINE</span>
        <span className="text-xs tracking-widest text-gray-400">GROUP</span>
      </div>
    </div>
  );
};

export default Logo;