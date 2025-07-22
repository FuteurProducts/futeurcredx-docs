import React from 'react';

type SectionProps = {
  children: React.ReactNode;
  className?: string;
};

const Section = ({ children, className = "" }: SectionProps) => {
  return (
    <section className={`py-16 px-6 ${className}`}>
      {children}
    </section>
  );
};

export default Section;
