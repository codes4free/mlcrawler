import { Request, Response } from 'express';
import { formatSuccessResponse } from '../utils/response-formatter';

/**
 * Controller for handling health check requests
 */
export const healthController = {
  /**
   * Get API health status
   * @param req Express request object
   * @param res Express response object
   * @returns Response with health status
   */
  getStatus: (req: Request, res: Response): Response => {
    const status = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
    
    return res.json(formatSuccessResponse(status));
  }
}; 