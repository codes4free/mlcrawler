import axios from 'axios';
import { mercadoLivreService } from './mercado-livre-service';

// Mock axios module
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MercadoLivreService', () => {
  // Mock environment variables
  process.env.MERCADO_LIVRE_ACCESS_TOKEN = 'mock-token';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('searchProducts', () => {
    it('should return formatted search results with up to 3 items', async () => {
      // Arrange
      const mockQuery = 'smartphone';
      const mockApiResponse = {
        data: {
          results: [
            {
              id: '123',
              title: 'Smartphone XYZ',
              price: 999.99,
              permalink: 'https://example.com/product/123',
              category_id: 'MLB1055',
              condition: 'new',
              seller: { id: 456 }
            },
            {
              id: '124',
              title: 'Smartphone ABC',
              price: 799.99,
              permalink: 'https://example.com/product/124',
              category_id: 'MLB1055',
              condition: 'used',
              seller: { id: 789 }
            },
            {
              id: '125',
              title: 'Smartphone DEF',
              price: 1099.99,
              permalink: 'https://example.com/product/125',
              category_id: 'MLB1055',
              condition: 'new',
              seller: { id: 101 }
            },
            {
              id: '126',
              title: 'Smartphone Extra',
              price: 599.99,
              permalink: 'https://example.com/product/126',
              category_id: 'MLB1055',
              condition: 'used',
              seller: { id: 102 }
            }
          ]
        }
      };
      
      mockedAxios.get.mockResolvedValueOnce(mockApiResponse);
      
      // Act
      const result = await mercadoLivreService.searchProducts(mockQuery);
      
      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.mercadolibre.com/sites/MLB/search',
        {
          params: { q: mockQuery },
          headers: { 'Authorization': 'Bearer mock-token' }
        }
      );
      
      expect(result).toEqual({
        results: [
          {
            title: 'Smartphone XYZ',
            price: 999.99,
            link: 'https://example.com/product/123',
            categoryId: 'MLB1055',
            condition: 'new',
            sellerId: '456'
          },
          {
            title: 'Smartphone ABC',
            price: 799.99,
            link: 'https://example.com/product/124',
            categoryId: 'MLB1055',
            condition: 'used',
            sellerId: '789'
          },
          {
            title: 'Smartphone DEF',
            price: 1099.99,
            link: 'https://example.com/product/125',
            categoryId: 'MLB1055',
            condition: 'new',
            sellerId: '101'
          }
        ],
        query: mockQuery,
        count: 3
      });
      
      // Should only return 3 results, not 4
      expect(result.results.length).toBe(3);
    });
    
    it('should handle API errors', async () => {
      // Arrange
      const mockQuery = 'smartphone';
      const mockError = new Error('API Error');
      
      mockedAxios.get.mockRejectedValueOnce(mockError);
      
      // Act & Assert
      await expect(
        mercadoLivreService.searchProducts(mockQuery)
      ).rejects.toThrow('API Error');
    });
  });
}); 