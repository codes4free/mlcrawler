import { Request, Response } from 'express';
import { mercadoLivreService } from '../services/mercado-livre-service';
import { logger } from '../utils/logger';
import { formatErrorResponse, formatSuccessResponse } from '../utils/response-formatter';

/**
 * Controller for handling product search requests
 */
export const searchController = {
  /**
   * Search for products in Mercado Livre based on query parameter
   * @param req Express request object
   * @param res Express response object
   * @returns Response with search results or error
   */
  search: async (req: Request, res: Response): Promise<Response> => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        logger.warn('Search request missing query parameter');
        return res.status(400).json(formatErrorResponse(
          'Missing search query parameter (q)',
          'missing_parameter'
        ));
      }
      
      logger.info(`Processing search request for: "${query}"`);
      const results = await mercadoLivreService.searchProducts(query);
      
      logger.info(`Sending ${results.count} results to client`);
      return res.json(formatSuccessResponse(results, {
        timestamp: new Date().toISOString(),
        source: 'Mercado Livre API'
      }));
    } catch (error) {
      logger.error('Error during search:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Unauthorized')) {
          return res.status(401).json(formatErrorResponse(
            error.message,
            'unauthorized'
          ));
        } else if (error.message.includes('Forbidden')) {
          return res.status(403).json(formatErrorResponse(
            error.message,
            'forbidden'
          ));
        }
      }
      
      return res.status(500).json(formatErrorResponse(
        'An error occurred while processing your request',
        'internal_error',
        process.env.NODE_ENV === 'development' ? error : undefined
      ));
    }
  }
}; 