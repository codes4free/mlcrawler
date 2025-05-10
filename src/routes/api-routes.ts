import { Router } from 'express';
import { searchController } from '../controllers/search-controller';
import { healthController } from '../controllers/health-controller';

const router = Router();

/**
 * @route GET /status
 * @desc Get API health status
 * @returns {Object} Health status information
 */
router.get('/status', healthController.getStatus);

/**
 * @route GET /buscar
 * @desc Search products in Mercado Livre
 * @param {string} q - Search query
 * @returns {Object} JSON with search results
 */
router.get('/buscar', searchController.search);

export const apiRoutes = router; 