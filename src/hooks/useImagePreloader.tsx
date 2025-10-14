import { useEffect, useState } from 'react';
import { ImagePreloader, CRITICAL_IMAGES, HERO_IMAGES, SECONDARY_IMAGES } from '@/utils/imagePreloader';

// Global state to track if initial preload is complete
let isInitialPreloadComplete = false;
let preloadPromise: Promise<void> | null = null;

export const useImagePreloader = () => {
  const [isLoading, setIsLoading] = useState(false); // Never show loading screen
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start background preloading without blocking UI
    if (!isInitialPreloadComplete && !preloadPromise) {
      preloadPromise = (async () => {
        try {
          // Only preload critical images in background
          await ImagePreloader.preloadImages(CRITICAL_IMAGES, { 
            priority: 'high', 
            batchSize: 3 
          });
          setProgress(50);

          // Preload hero images in background
          await ImagePreloader.preloadImages(HERO_IMAGES, { 
            priority: 'medium', 
            batchSize: 2 
          });
          setProgress(100);
          
          // Mark as complete
          isInitialPreloadComplete = true;
        } catch (error) {
          console.warn('Background image preloading completed with some errors:', error);
          isInitialPreloadComplete = true;
        }
      })();
    }
  }, []);

  return { isLoading, progress };
};

