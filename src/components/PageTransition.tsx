interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  // Simply return children without any transition effects
  return <>{children}</>;
}

