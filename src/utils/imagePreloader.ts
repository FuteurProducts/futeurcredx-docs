// Image preloading utility for optimizing large image loading
export class ImagePreloader {
  private static preloadedImages = new Set<string>();
  private static preloadPromises = new Map<string, Promise<void>>();

  /**
   * Preload a single image
   */
  static preloadImage(src: string): Promise<void> {
    // Return existing promise if already preloading
    if (this.preloadPromises.has(src)) {
      return this.preloadPromises.get(src)!;
    }

    // Return resolved promise if already preloaded
    if (this.preloadedImages.has(src)) {
      return Promise.resolve();
    }

    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.preloadedImages.add(src);
        this.preloadPromises.delete(src);
        resolve();
      };
      
      img.onerror = () => {
        this.preloadPromises.delete(src);
        reject(new Error(`Failed to preload image: ${src}`));
      };
      
      img.src = src;
    });

    this.preloadPromises.set(src, promise);
    return promise;
  }

  /**
   * Preload multiple images with optional priority
   */
  static async preloadImages(images: string[], options: { 
    priority?: 'high' | 'medium' | 'low';
    batchSize?: number;
  } = {}): Promise<void> {
    const { batchSize = 3 } = options;
    
    // Process images in batches to avoid overwhelming the browser
    for (let i = 0; i < images.length; i += batchSize) {
      const batch = images.slice(i, i + batchSize);
      const promises = batch.map(src => this.preloadImage(src).catch(console.warn));
      await Promise.all(promises);
      
      // Small delay between batches only for low priority images
      if (options.priority === 'low' && i + batchSize < images.length) {
        await new Promise(resolve => setTimeout(resolve, 50)); // Reduced delay
      }
      // No delay for high priority images
    }
  }

  /**
   * Check if an image is preloaded
   */
  static isPreloaded(src: string): boolean {
    return this.preloadedImages.has(src);
  }

  /**
   * Clear preloaded images cache
   */
  static clearCache(): void {
    this.preloadedImages.clear();
    this.preloadPromises.clear();
  }
}

// Critical images that should be preloaded immediately (essential logos and hero backgrounds)
export const CRITICAL_IMAGES = [
  '/futeur.png',
  '/logos/futeur.png',
  '/53.jpg', // Main hero background
  '/60.jpg', // Fintech page background
  '/about-bg.jpg', // About page background
  '/contact-hero.jpg', // Contact page background
  '/cover.jpg', // FuteurCredPlus background
  '/Dark-Experian.png', // Frequently used logo
  '/Dark-Equifax.png', // Frequently used logo
  '/lumiq.png' // LUMIQ logo
];

// Hero and feature images (only the most important ones)
export const HERO_IMAGES = [
  '/enterprisesubhero/1.jpg'
];

// All other images that can be preloaded with lower priority
export const SECONDARY_IMAGES = [
  '/futeursecure.png',
  '/business-logos/grainger.svg',
  '/business-logos/office-depot.svg',
  '/business-logos/staples.svg',
  '/fintech-logos/Brex.png',
  '/fintech-logos/Ramp.jpeg',
  '/fintech-logos/mercury.png',
  '/enterprisesubhero/2.png',
  '/enterprisesubhero/3.png',
  '/business-logos-white/grainger.svg',
  '/business-logos-white/office-depot.svg',
  '/business-logos-white/staples.svg'
];

