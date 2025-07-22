import React from 'react';

type HeadingProps = {
  textAlignClassName?: string;
  titleLarge?: string;
  textLarge?: string;
  className?: string;
};

const Heading = ({ 
  textAlignClassName = "", 
  titleLarge = "", 
  textLarge = "", 
  className = "" 
}: HeadingProps) => {
  return (
    <div className={`mb-12 ${textAlignClassName} ${className}`}>
      {titleLarge && (
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
          {titleLarge}
        </h1>
      )}
      {textLarge && (
        <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
          {textLarge}
        </p>
      )}
    </div>
  );
};

export default Heading;
