// controllers/supplyChainController.js
import { validationResult } from 'express-validator';
import * as fabricService from '../services/fabricService.js';

// === FARMER OPERATIONS ===

// Record planting event
export const recordPlanting = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, farmerId, plantingDate, additionalInfo } = req.body;
    
    // Call fabric service to record planting
    const result = await fabricService.recordPlanting(productId, farmerId, plantingDate, additionalInfo);
    
    res.status(200).json({
      status: 'success',
      message: `Planting event recorded for product ${productId}`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Record growth event
export const recordGrowth = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, farmerId, growthDetails } = req.body;
    
    // Call fabric service to record growth
    const result = await fabricService.recordGrowth(productId, farmerId, growthDetails);
    
    res.status(200).json({
      status: 'success',
      message: `Growth event recorded for product ${productId}`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Record harvest event
export const recordHarvest = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, farmerId, harvestDate, harvestQuantity } = req.body;
    
    // Call fabric service to record harvest
    const result = await fabricService.recordHarvest(productId, farmerId, harvestDate, harvestQuantity);
    
    res.status(200).json({
      status: 'success',
      message: `Harvest event recorded for product ${productId}`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// === PROCESSOR OPERATIONS ===

// Record processing event
export const recordProcessing = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, processorId, batchId, processingDetails } = req.body;
    
    // Call fabric service to record processing
    const result = await fabricService.recordProcessing(productId, processorId, batchId, processingDetails);
    
    res.status(200).json({
      status: 'success',
      message: `Processing event recorded for product ${productId}`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// === QUALITY SUPERVISOR OPERATIONS ===

// Record quality check
export const recordQualityCheck = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, inspectorId, status, checkDetails } = req.body;
    
    // Call fabric service to record quality check
    const result = await fabricService.recordQualityCheck(productId, inspectorId, status, checkDetails);
    
    res.status(200).json({
      status: 'success',
      message: `Quality check recorded for product ${productId}`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// === DISTRIBUTOR OPERATIONS ===

// Record distribution
export const recordDistribution = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, distributorId, destinationId, distributionDetails } = req.body;
    
    // Call fabric service to record distribution
    const result = await fabricService.recordDistribution(productId, distributorId, destinationId, distributionDetails);
    
    res.status(200).json({
      status: 'success',
      message: `Distribution recorded for product ${productId}`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// === RETAILER OPERATIONS ===

// Record retail sale
export const recordRetailSale = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, retailerId, quantity, saleDetails } = req.body;
    
    // Call fabric service to record retail sale
    const result = await fabricService.recordRetailSale(productId, retailerId, quantity, saleDetails);
    
    res.status(200).json({
      status: 'success',
      message: `Retail sale recorded for product ${productId}`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Generate QR code
export const generateQRCode = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId } = req.body;
    
    // Call fabric service to generate QR code
    const result = await fabricService.generateQRCode(productId);
    
    res.status(200).json({
      status: 'success',
      message: `QR code generated for product ${productId}`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Get product history
export const getProductHistory = async (req, res, next) => {
  try {
    const productId = req.params.id;
    
    // Call fabric service to get product history
    const history = await fabricService.getProductHistory(productId);
    
    res.json({
      status: 'success',
      data: history
    });
  } catch (error) {
    next(error);
  }
};