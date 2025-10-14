import { useEffect, useState } from 'react';
import { ImagePreloader, CRITICAL_IMAGES, HERO_IMAGES, SECONDARY_IMAGES } from '@/utils/imagePreloader';

// Global state to track if initial preload is complete
let isInitialPreloadComplete = false;
let preloadPromise: Promise<void> | null = null;

export const useImagePreloader = () => {
  const [isLoading, setIsLoading] = useState(!isInitialPreloadComplete);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // If already preloaded, don't show loading screen
    if (isInitialPreloadComplete) {
      setIsLoading(false);
      return;
    }

    // If preload is in progress, wait for it
    if (preloadPromise) {
      preloadPromise.then(() => {
        setIsLoading(false);
      });
      return;
    }

    // Start preloading
    preloadPromise = (async () => {
      try {
        // Phase 1: Critical images (logos, icons) - highest priority
        await ImagePreloader.preloadImages(CRITICAL_IMAGES, { 
          priority: 'high', 
          batchSize: 5 
        });
        setProgress(33);

        // Phase 2: Hero images - medium priority
        await ImagePreloader.preloadImages(HERO_IMAGES, { 
          priority: 'medium', 
          batchSize: 3 
        });
        setProgress(66);

        // Phase 3: Secondary images - low priority
        await ImagePreloader.preloadImages(SECONDARY_IMAGES, { 
          priority: 'low', 
          batchSize: 2 
        });
        setProgress(100);
        
        // Mark as complete
        isInitialPreloadComplete = true;
        
        // Small delay to show completion
        setTimeout(() => setIsLoading(false), 200);
      } catch (error) {
        console.warn('Image preloading completed with some errors:', error);
        isInitialPreloadComplete = true;
        setIsLoading(false);
      }
    })();

    preloadPromise.then(() => {
      setIsLoading(false);
    });
  }, []);

  return { isLoading, progress };
};

