// controllers/productController.js
import { validationResult } from 'express-validator';
import * as fabricService from '../services/fabricService.js';

// Register a new product
export const registerProduct = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, name, description, farmerId, quantity, cropDetails } = req.body;
    
    // Call fabric service to register the product
    const result = await fabricService.registerProduct(id, name, description, farmerId, quantity, cropDetails);
    
    res.status(201).json({
      status: 'success',
      message: `Product ${id} has been registered`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Get product by ID
export const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    
    // Call fabric service to get the product
    const product = await fabricService.getProduct(productId);
    
    res.json({
      status: 'success',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Get all products
export const getAllProducts = async (req, res, next) => {
  try {
    // Call fabric service to get all products
    const products = await fabricService.getAllProducts();
    
    res.json({
      status: 'success',
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Trace product through supply chain
export const traceProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    
    // Call fabric service to get product and its history
    const product = await fabricService.getProduct(productId);
    const history = await fabricService.getProductHistory(productId);
    
    res.json({
      status: 'success',
      data: {
        product,
        history
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get products by farmer
export const getProductsByFarmer = async (req, res, next) => {
  try {
    const farmerId = req.params.farmerId;
    
    // Call fabric service to get products by farmer
    const products = await fabricService.getProductsByFarmer(farmerId);
    
    res.json({
      status: 'success',
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Get products by stage
export const getProductsByStage = async (req, res, next) => {
  try {
    const stage = req.params.stage;
    
    // Call fabric service to get products by stage
    const products = await fabricService.getProductsByStage(stage);
    
    res.json({
      status: 'success',
      data: products
    });
  } catch (error) {
    next(error);
  }
};