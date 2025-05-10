import { Request, Response } from 'express';
import { searchController } from './search-controller';
import { mercadoLivreService } from '../services/mercado-livre-service';

// Mock mercadoLivreService
jest.mock('../services/mercado-livre-service');
const mockedService = mercadoLivreService as jest.Mocked<typeof mercadoLivreService>;

describe('SearchController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  
  beforeEach(() => {
    mockRequest = {
      query: {}
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    jest.clearAllMocks();
  });
  
  describe('search', () => {
    it('should return 400 if q parameter is missing', async () => {
      // Arrange
      mockRequest.query = {};
      
      // Act
      await searchController.search(
        mockRequest as Request,
        mockResponse as Response
      );
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Missing search query parameter (q)'
      });
    });
    
    it('should return search results when query is provided', async () => {
      // Arrange
      const mockQuery = 'smartphone';
      const mockResults = {
        results: [
          {
            title: 'Smartphone XYZ',
            price: 999.99,
            link: 'https://example.com/product/123',
            categoryId: 'MLB1055',
            condition: 'new',
            sellerId: '456'
          }
        ],
        query: mockQuery,
        count: 1
      };
      
      mockRequest.query = { q: mockQuery };
      mockedService.searchProducts.mockResolvedValueOnce(mockResults);
      
      // Act
      await searchController.search(
        mockRequest as Request,
        mockResponse as Response
      );
      
      // Assert
      expect(mockedService.searchProducts).toHaveBeenCalledWith(mockQuery);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResults);
    });
    
    it('should return 500 when service throws an error', async () => {
      // Arrange
      const mockQuery = 'smartphone';
      const mockError = new Error('Service Error');
      
      mockRequest.query = { q: mockQuery };
      mockedService.searchProducts.mockRejectedValueOnce(mockError);
      
      // Act
      await searchController.search(
        mockRequest as Request,
        mockResponse as Response
      );
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'An error occurred while processing your request'
      });
    });
  });
}); 