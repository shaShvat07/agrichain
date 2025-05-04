// app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import routes
import { productRoutes } from './routes/productRoutes.js';
import { stakeholderRoutes } from './routes/stakeholderRoutes.js';
import { supplyChainRoutes } from './routes/supplyChainRoutes.js';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(cors()); // CORS
app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // URL-encoded body parser

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/products', productRoutes);
app.use('/api/stakeholders', stakeholderRoutes);
app.use('/api/supply-chain', supplyChainRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Something went wrong!',
  });
});

// 404 route
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

export { app };