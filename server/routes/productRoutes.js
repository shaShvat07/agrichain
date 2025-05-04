// routes/productRoutes.js
import express from 'express';
import { body } from 'express-validator';
import * as productController from '../controllers/productController.js';

const router = express.Router();

// Validation middleware
const validateProduct = [
  body('id').notEmpty().withMessage('Product ID is required'),
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('farmerId').notEmpty().withMessage('Farmer ID is required'),
  body('quantity').notEmpty().withMessage('Quantity is required')
];

// Routes
router.post('/', validateProduct, productController.registerProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/trace/:id', productController.traceProduct);
router.get('/by-farmer/:farmerId', productController.getProductsByFarmer);
router.get('/by-stage/:stage', productController.getProductsByStage);

export { router as productRoutes };