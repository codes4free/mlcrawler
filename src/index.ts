import express from 'express';
import dotenv from 'dotenv';
import { apiRoutes } from './routes/api-routes';
import { errorHandler } from './middlewares/error-middleware';
import { checkApiCredentials } from './middlewares/auth-middleware';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

// Create Express application
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(checkApiCredentials);

// Routes
app.use('/', apiRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
}); 