import React, { useState, useEffect } from 'react';

const QuickLoader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide loader after a very short time to show content quickly
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 100); // Only 100ms delay

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 relative">
          <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
          <div 
            className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"
            style={{ animationDuration: '0.8s' }}
          ></div>
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-white">
          FUTEURCREDX
        </h1>
      </div>
    </div>
  );
};

export default QuickLoader;

