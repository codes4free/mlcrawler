import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { formatErrorResponse } from '../utils/response-formatter';

/**
 * Error handler middleware
 * @param err Error object
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Unhandled application error:', err);
  
  res.status(500).json(formatErrorResponse(
    'Internal server error',
    'internal_error',
    process.env.NODE_ENV === 'development' ? {
      message: err.message,
      stack: err.stack
    } : undefined
  ));
}; 