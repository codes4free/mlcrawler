import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Middleware to check if Mercado Livre credentials are set
 */
export const checkApiCredentials = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  const token = process.env.MERCADO_LIVRE_ACCESS_TOKEN;
  
  if (!token || token === 'your_access_token_here') {
    logger.warn('API credentials not properly configured');
    res.set('X-API-Warning', 'Using Mercado Livre API without authentication');
  }
  
  next();
}; 