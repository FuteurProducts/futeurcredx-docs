/**
 * DEV-gated logger — suppresses noise in production builds.
 * Replaces direct console.warn / console.error in BFF fallback paths.
 */

const isDev = import.meta.env.DEV;

export const logger = {
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    if (isDev) console.error(...args);
  },
  info: (...args: unknown[]) => {
    if (isDev) console.info(...args);
  },
};
