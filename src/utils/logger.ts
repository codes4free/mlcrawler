/**
 * Simple logger utility for the application
 */
export const logger = {
  /**
   * Log an informational message
   * @param message Message to log
   * @param data Additional data to log
   */
  info: (message: string, data?: unknown): void => {
    console.log(`[INFO] ${message}`, data ? data : '');
  },

  /**
   * Log an error message
   * @param message Error message to log
   * @param error Error object or additional data
   */
  error: (message: string, error?: unknown): void => {
    console.error(`[ERROR] ${message}`, error ? error : '');
  },

  /**
   * Log a warning message
   * @param message Warning message to log
   * @param data Additional data to log
   */
  warn: (message: string, data?: unknown): void => {
    console.warn(`[WARN] ${message}`, data ? data : '');
  },

  /**
   * Log a debug message (only in development)
   * @param message Debug message to log
   * @param data Additional data to log
   */
  debug: (message: string, data?: unknown): void => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data ? data : '');
    }
  }
}; 