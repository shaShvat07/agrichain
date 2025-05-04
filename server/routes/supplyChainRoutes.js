// routes/supplyChainRoutes.js
import express from 'express';
import { body } from 'express-validator';
import * as supplyChainController from '../controllers/supplyChainController.js';

const router = express.Router();

// Farmer routes
router.post('/farmer/planting', [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('farmerId').notEmpty().withMessage('Farmer ID is required'),
  body('plantingDate').notEmpty().withMessage('Planting date is required')
], supplyChainController.recordPlanting);

router.post('/farmer/growth', [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('farmerId').notEmpty().withMessage('Farmer ID is required'),
  body('growthDetails').notEmpty().withMessage('Growth details are required')
], supplyChainController.recordGrowth);

router.post('/farmer/harvest', [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('farmerId').notEmpty().withMessage('Farmer ID is required'),
  body('harvestDate').notEmpty().withMessage('Harvest date is required'),
  body('harvestQuantity').notEmpty().withMessage('Harvest quantity is required')
], supplyChainController.recordHarvest);

// Processor routes
router.post('/processor/processing', [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('processorId').notEmpty().withMessage('Processor ID is required'),
  body('batchId').notEmpty().withMessage('Batch ID is required')
], supplyChainController.recordProcessing);

// Quality supervisor routes
router.post('/quality/check', [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('inspectorId').notEmpty().withMessage('Inspector ID is required'),
  body('status').notEmpty().withMessage('Status is required')
], supplyChainController.recordQualityCheck);

// Distributor routes
router.post('/distributor/distribute', [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('distributorId').notEmpty().withMessage('Distributor ID is required'),
  body('destinationId').notEmpty().withMessage('Destination ID is required')
], supplyChainController.recordDistribution);

// Retailer routes
router.post('/retailer/sale', [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('retailerId').notEmpty().withMessage('Retailer ID is required'),
  body('quantity').notEmpty().withMessage('Quantity is required')
], supplyChainController.recordRetailSale);

// QR code generation
router.post('/qrcode/generate', [
  body('productId').notEmpty().withMessage('Product ID is required')
], supplyChainController.generateQRCode);

// Common routes
router.get('/product/history/:id', supplyChainController.getProductHistory);

export { router as supplyChainRoutes };