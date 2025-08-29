import { useEffect, useState } from 'react';
import { ImagePreloader, CRITICAL_IMAGES, HERO_IMAGES, SECONDARY_IMAGES } from '@/utils/imagePreloader';

export const useImagePreloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const preloadImages = async () => {
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
        
        // Small delay to show completion
        setTimeout(() => setIsLoading(false), 200);
      } catch (error) {
        console.warn('Image preloading completed with some errors:', error);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, []);

  return { isLoading, progress };
};
