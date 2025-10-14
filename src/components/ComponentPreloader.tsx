import { useEffect } from 'react';

export default function ComponentPreloader() {
  useEffect(() => {
    // Preload all components in the background using dynamic imports
    const preloadComponents = async () => {
      try {
        // Use Promise.allSettled to ensure all components load even if some fail
        await Promise.allSettled([
          import('@/pages/Index'),
          import('@/pages/Business'),
          import('@/pages/Enterprise'),
          import('@/pages/Fintech'),
          import('@/pages/LumiqBuild'),
          import('@/pages/CreditJourney'),
          import('@/pages/MobileApp'),
          import('@/pages/App'),
          import('@/pages/FAQ'),
          import('@/pages/FuteurCredPlus'),
          import('@/pages/About'),
          import('@/pages/PrivacyPolicy'),
          import('@/pages/TermsOfService'),
          import('@/pages/ContactUs'),
          import('@/pages/Documentation/dashboard/Dashboard'),
          import('@/pages/Documentation/DocsLayout'),
          import('@/pages/BusinessSignup'),
          import('@/pages/Login'),
          import('@/pages/Register'),
        ]);
        
        console.log('All page components preloaded successfully');
      } catch (error) {
        console.warn('Component preloading completed with some errors:', error);
      }
    };

    // Start preloading after a short delay to not interfere with initial load
    const timer = setTimeout(preloadComponents, 2000);
    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
}

