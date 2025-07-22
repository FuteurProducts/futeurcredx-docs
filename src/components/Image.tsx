import React from 'react';

type ImageProps = {
  className?: string;
  src: string;
  width: number;
  height: number;
  alt: string;
};

const Image = ({ className = "", src, width, height, alt }: ImageProps) => {
  return (
    <img 
      className={className} 
      src={src} 
      width={width} 
      height={height} 
      alt={alt}
    />
  );
};

export default Image;
