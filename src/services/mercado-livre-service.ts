import axios from 'axios';
import { Product, MercadoLivreResponse, SearchResult } from '../models/product';
import { logger } from '../utils/logger';
import { httpClient } from '../utils/http-client';

// Base URL for Mercado Livre API
const ML_API_BASE_URL = 'https://api.mercadolibre.com';

// Flag to skip authentication for testing
const SKIP_AUTH_CHECK = true;

/**
 * Get mock products based on the search query
 * @param query Search query
 * @returns Array of mock products
 */
const getMockProducts = (query: string): Product[] => {
  // Convert query to lowercase for easier comparison
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('smartphone') || lowerQuery.includes('celular')) {
    return [
      {
        title: '[MOCK] Smartphone XYZ Pro Max',
        price: 1299.99,
        link: 'https://example.com/product/123',
        categoryId: 'MLB1055',
        condition: 'new',
        sellerId: '456'
      },
      {
        title: '[MOCK] Smartphone ABC Plus',
        price: 899.99,
        link: 'https://example.com/product/124',
        categoryId: 'MLB1055',
        condition: 'used',
        sellerId: '789'
      },
      {
        title: '[MOCK] Smartphone DEF Ultra',
        price: 1499.99,
        link: 'https://example.com/product/125',
        categoryId: 'MLB1055',
        condition: 'new',
        sellerId: '101'
      }
    ];
  } else if (lowerQuery.includes('laptop') || lowerQuery.includes('notebook')) {
    return [
      {
        title: '[MOCK] Laptop ThinkPower X1',
        price: 3499.99,
        link: 'https://example.com/product/323',
        categoryId: 'MLB1648',
        condition: 'new',
        sellerId: '222'
      },
      {
        title: '[MOCK] Notebook UltraSlim S7',
        price: 2799.99,
        link: 'https://example.com/product/324',
        categoryId: 'MLB1648',
        condition: 'new',
        sellerId: '333'
      },
      {
        title: '[MOCK] Laptop GamerPro RTX',
        price: 5999.99,
        link: 'https://example.com/product/325',
        categoryId: 'MLB1648',
        condition: 'new',
        sellerId: '444'
      }
    ];
  } else {
    // Default products for any other query
    return [
      {
        title: `[MOCK] Product related to "${query}"`,
        price: 499.99,
        link: 'https://example.com/product/991',
        categoryId: 'MLB1234',
        condition: 'new',
        sellerId: '555'
      },
      {
        title: `[MOCK] Another item matching "${query}"`,
        price: 299.99,
        link: 'https://example.com/product/992',
        categoryId: 'MLB1234',
        condition: 'used',
        sellerId: '666'
      },
      {
        title: `[MOCK] Best selling "${query}" product`,
        price: 799.99,
        link: 'https://example.com/product/993',
        categoryId: 'MLB1234',
        condition: 'new',
        sellerId: '777'
      }
    ];
  }
};

/**
 * Service for interacting with the Mercado Livre API
 */
export const mercadoLivreService = {
  /**
   * Search for products in Mercado Livre
   * @param query The search query string
   * @returns Formatted search results with the first 3 items
   */
  searchProducts: async (query: string): Promise<SearchResult> => {
    try {
      logger.info(`Searching Mercado Livre for: "${query}"`);
      
      // Base configuration for the request
      const config = {
        params: { q: query }
      };
      
      // Add authorization header only if token is available and not testing
      const headers: Record<string, string> = {};
      if (!SKIP_AUTH_CHECK && process.env.MERCADO_LIVRE_ACCESS_TOKEN && 
          process.env.MERCADO_LIVRE_ACCESS_TOKEN !== 'your_access_token_here') {
        headers['Authorization'] = `Bearer ${process.env.MERCADO_LIVRE_ACCESS_TOKEN}`;
        logger.info('Using Mercado Livre authorization token');
      } else {
        logger.warn('No valid Mercado Livre token found or skipping auth for testing');
      }
      
      // Only add headers to config if we have any
      if (Object.keys(headers).length > 0) {
        Object.assign(config, { headers });
      }
      
      const response = await httpClient.get<MercadoLivreResponse>(
        `${ML_API_BASE_URL}/sites/MLB/search`,
        config
      );
      
      logger.debug('API response received', { 
        totalResults: response.results.length 
      });
      
      // Map only the first 3 results to our Product model
      const products: Product[] = response.results
        .slice(0, 3)
        .map(item => ({
          title: item.title,
          price: item.price,
          link: item.permalink,
          categoryId: item.category_id,
          condition: item.condition,
          sellerId: item.seller.id.toString()
        }));
      
      const result = {
        results: products,
        query,
        count: products.length
      };
      
      logger.info(`Found ${result.count} products for "${query}"`);
      return result;
    } catch (error) {
      logger.error('Error fetching from Mercado Livre API:', error);
      
      // Skip throwing authentication errors when in test mode
      if (SKIP_AUTH_CHECK && axios.isAxiosError(error) && error.response?.status === 401) {
        // Get mock data based on the query
        const mockProducts = getMockProducts(query);
        
        logger.info(`Returning ${mockProducts.length} mock products for "${query}"`);
        
        return {
          results: mockProducts,
          query,
          count: mockProducts.length
        };
      }
      
      // Check for specific API errors
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        
        if (status === 401) {
          throw new Error('Unauthorized: Invalid or missing Mercado Livre access token');
        } else if (status === 403) {
          throw new Error('Forbidden: Insufficient permissions for this request');
        } else if (status === 404) {
          throw new Error('Not found: The requested resource does not exist');
        } else if (status >= 500) {
          throw new Error('Mercado Livre API server error');
        }
      }
      
      throw error;
    }
  }
}; 