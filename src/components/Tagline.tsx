import React from 'react';

type TaglineProps = {
  children: React.ReactNode;
  className?: string;
};

const Tagline = ({ children, className = "" }: TaglineProps) => {
  return (
    <div className={`inline-flex items-center justify-center w-12 h-12 bg-black text-white font-black text-lg rounded-full border border-gray-300 ${className}`}>
      {children}
    </div>
  );
};

export default Tagline;
