/**
 * Interface representing a Mercado Livre product search result
 */
export interface Product {
  title: string;
  price: number;
  link: string;
  categoryId: string;
  condition: string;
  sellerId: string;
}

/**
 * Interface representing the raw Mercado Livre API response structure
 */
export interface MercadoLivreResponse {
  results: {
    id: string;
    title: string;
    price: number;
    permalink: string;
    category_id: string;
    condition: string;
    seller: {
      id: number;
    };
  }[];
}

/**
 * Interface for the search results we return to the client
 */
export interface SearchResult {
  results: Product[];
  query: string;
  count: number;
} 