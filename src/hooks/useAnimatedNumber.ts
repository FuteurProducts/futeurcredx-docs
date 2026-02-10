import { useState, useEffect, useRef } from 'react';

/**
 * Animates a number from 0 to target using requestAnimationFrame.
 * Uses ease-out cubic for a satisfying deceleration.
 *
 * @param target - The final value to animate to
 * @param duration - Animation duration in ms (default 800)
 * @returns The current animated value (integer)
 */
export const useAnimatedNumber = (target: number, duration = 800): number => {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(target);

  useEffect(() => {
    const startValue = prevTarget.current === target ? 0 : prevTarget.current;
    prevTarget.current = target;

    if (target === 0) {
      setValue(0);
      return;
    }

    let animationId: number;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (target - startValue) * eased);
      setValue(current);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [target, duration]);

  return value;
};
