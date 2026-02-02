/**
 * useSessionTimeout Hook
 * Monitors session activity and warns before timeout
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { logger } from '@/utils/logger';

interface UseSessionTimeoutOptions {
  warningMinutes?: number;  // Minutes before timeout to show warning (default 5)
  timeoutMinutes?: number;  // Total session timeout in minutes (default 30)
  onWarning?: () => void;
  onTimeout?: () => void;
}

interface UseSessionTimeoutResult {
  isWarning: boolean;
  minutesRemaining: number;
  resetTimer: () => void;
  extendSession: () => Promise<void>;
}

export function useSessionTimeout(
  options: UseSessionTimeoutOptions = {}
): UseSessionTimeoutResult {
  const {
    warningMinutes = 5,
    timeoutMinutes = 30,
    onWarning,
    onTimeout,
  } = options;

  const [isWarning, setIsWarning] = useState(false);
  const [minutesRemaining, setMinutesRemaining] = useState(timeoutMinutes);

  const lastActivityRef = useRef<number>(Date.now());
  const warningShownRef = useRef(false);

  // Reset timer on user activity
  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownRef.current = false;
    setIsWarning(false);
    setMinutesRemaining(timeoutMinutes);
  }, [timeoutMinutes]);

  // Extend session — Clerk handles token refresh automatically,
  // so we just reset the activity timer
  const extendSession = useCallback(async () => {
    try {
      resetTimer();
    } catch (err) {
      logger.error('Failed to extend session:', err);
    }
  }, [resetTimer]);

  // Track user activity
  useEffect(() => {
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    const handleActivity = () => {
      resetTimer();
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer]);

  // Check timeout status every minute
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const elapsed = (Date.now() - lastActivityRef.current) / 1000 / 60; // minutes
      const remaining = Math.max(0, timeoutMinutes - elapsed);

      setMinutesRemaining(Math.ceil(remaining));

      // Show warning
      if (remaining <= warningMinutes && remaining > 0 && !warningShownRef.current) {
        warningShownRef.current = true;
        setIsWarning(true);
        onWarning?.();
      }

      // Trigger timeout
      if (remaining <= 0) {
        setIsWarning(false);
        onTimeout?.();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkInterval);
  }, [timeoutMinutes, warningMinutes, onWarning, onTimeout]);

  return {
    isWarning,
    minutesRemaining,
    resetTimer,
    extendSession,
  };
}
