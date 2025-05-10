import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { logger } from './logger';

/**
 * Centralized HTTP client for making API requests
 */
export const httpClient = {
  /**
   * Make a GET request to the specified URL
   * @param url URL to make the request to
   * @param config Axios request configuration
   * @returns Promise with the response data
   */
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      logger.debug(`Making GET request to: ${url}`);
      const response: AxiosResponse<T> = await axios.get(url, config);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError, url);
      throw error;
    }
  },

  /**
   * Make a POST request to the specified URL
   * @param url URL to make the request to
   * @param data Data to send in the request body
   * @param config Axios request configuration
   * @returns Promise with the response data
   */
  post: async <T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> => {
    try {
      logger.debug(`Making POST request to: ${url}`);
      const response: AxiosResponse<T> = await axios.post(url, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error as AxiosError, url);
      throw error;
    }
  }
};

/**
 * Handle and log API errors
 * @param error Axios error
 * @param url URL that caused the error
 */
const handleApiError = (error: AxiosError, url: string): void => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    logger.error(`API Error ${error.response.status} for ${url}:`, {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    });
  } else if (error.request) {
    // The request was made but no response was received
    logger.error(`No response received for ${url}:`, error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    logger.error(`Request setup error for ${url}:`, error.message);
  }
}; 