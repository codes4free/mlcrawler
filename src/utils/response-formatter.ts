/**
 * Formats error responses consistently
 * @param message Error message
 * @param code Error code
 * @param details Additional error details
 * @returns Formatted error object
 */
export const formatErrorResponse = (
  message: string,
  code: string = 'internal_error',
  details?: unknown
): Record<string, unknown> => {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {})
    }
  };
};

/**
 * Formats success responses consistently
 * @param data Response data
 * @param metadata Additional metadata
 * @returns Formatted success object
 */
export const formatSuccessResponse = <T>(
  data: T,
  metadata?: Record<string, unknown>
): Record<string, unknown> => {
  return {
    success: true,
    data,
    ...(metadata ? { metadata } : {})
  };
}; 