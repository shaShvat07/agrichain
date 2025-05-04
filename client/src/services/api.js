// src/services/api.js
import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product services
export const productService = {
  // Register a new product
  registerProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Trace product
  traceProduct: async (id) => {
    try {
      const response = await api.get(`/products/trace/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get products by farmer
  getProductsByFarmer: async (farmerId) => {
    try {
      const response = await api.get(`/products/by-farmer/${farmerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get products by stage
  getProductsByStage: async (stage) => {
    try {
      const response = await api.get(`/products/by-stage/${stage}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Add or update in src/services/api.js

// Stakeholder services
export const stakeholderService = {
  // Register a new stakeholder
  registerStakeholder: async (stakeholderData) => {
    try {
      console.log('Registering stakeholder:', stakeholderData);
      const response = await api.post('/stakeholders', stakeholderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all stakeholders
  getAllStakeholders: async () => {
    try {
      const response = await api.get('/stakeholders');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get stakeholder by ID
  getStakeholderById: async (id) => {
    try {
      const response = await api.get(`/stakeholders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get stakeholders by role
  getStakeholdersByRole: async (role) => {
    try {
      const response = await api.get(`/stakeholders/role/${role}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Register a new bureau
  registerBureau: async (bureauData) => {
    try {
      const response = await api.post('/stakeholders/bureau', bureauData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Approve a farmer
  approveFarmer: async (approvalData) => {
    try {
      const response = await api.post('/stakeholders/bureau/approve-farmer', approvalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Supply chain services
export const supplyChainService = {
  // === FARMER OPERATIONS ===

  // Record planting
  recordPlanting: async (productId, farmerId, plantingDate, additionalInfo) => {
    try {
      // Match fabricService.js parameter structure
      const response = await api.post('/supply-chain/farmer/planting', {
        productId,
        farmerId,
        plantingDate,
        additionalInfo: typeof additionalInfo === 'object'
          ? JSON.stringify(additionalInfo)
          : additionalInfo || ''
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to record planting: ${error}`);
      throw error.response?.data || error.message;
    }
  },

  // Record growth
  recordGrowth: async (productId, farmerId, growthDetails) => {
    try {
      // Match fabricService.js parameter structure
      const response = await api.post('/supply-chain/farmer/growth', {
        productId,
        farmerId,
        growthDetails: typeof growthDetails === 'object'
          ? JSON.stringify(growthDetails)
          : growthDetails
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to record growth: ${error}`);
      throw error.response?.data || error.message;
    }
  },

  // Record harvest
  recordHarvest: async (productId, farmerId, harvestDate, harvestQuantity) => {
    try {
      // Match fabricService.js parameter structure 
      console.log(harvestDate, harvestQuantity);
      const response = await api.post('/supply-chain/farmer/harvest', {
        productId,
        farmerId,
        harvestDate,
        harvestQuantity: harvestQuantity.toString()
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to record harvest: ${error}`);
      throw error.response?.data || error.message;
    }
  },

  // === PROCESSOR OPERATIONS ===

  // Record processing
  recordProcessing: async (productId, processorId, batchId, processingDetails) => {
    try {
      // Match fabricService.js parameter structure
      const response = await api.post('/supply-chain/processor/processing', {
        productId,
        processorId,
        batchId,
        processingDetails: typeof processingDetails === 'object'
          ? JSON.stringify(processingDetails)
          : processingDetails || ''
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to record processing: ${error}`);
      throw error.response?.data || error.message;
    }
  },

  // === QUALITY OPERATIONS ===

  // Record quality check
  recordQualityCheck: async (productId, inspectorId, status, checkDetails) => {
    try {
      // Match fabricService.js parameter structure
      const response = await api.post('/supply-chain/quality/check', {
        productId,
        inspectorId,
        status,
        checkDetails: typeof checkDetails === 'object'
          ? JSON.stringify(checkDetails)
          : checkDetails || ''
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to record quality check: ${error}`);
      throw error.response?.data || error.message;
    }
  },

  // === DISTRIBUTOR OPERATIONS ===

  // Record distribution
  recordDistribution: async (productId, distributorId, destinationId, distributionDetails) => {
    try {
      // Match fabricService.js parameter structure
      const response = await api.post('/supply-chain/distributor/distribute', {
        productId,
        distributorId,
        destinationId,
        distributionDetails: typeof distributionDetails === 'object'
          ? JSON.stringify(distributionDetails)
          : distributionDetails || ''
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to record distribution: ${error}`);
      throw error.response?.data || error.message;
    }
  },

  // === RETAILER OPERATIONS ===

  // Record retail sale
  recordRetailSale: async (productId, retailerId, quantity, saleDetails) => {
    try {
      // Match fabricService.js parameter structure
      const response = await api.post('/supply-chain/retailer/sale', {
        productId,
        retailerId,
        quantity: quantity.toString(),
        saleDetails: typeof saleDetails === 'object'
          ? JSON.stringify(saleDetails)
          : saleDetails || ''
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to record retail sale: ${error}`);
      throw error.response?.data || error.message;
    }
  },

  // === QR CODE OPERATIONS ===

  // Generate QR code
  generateQRCode: async (productId) => {
    try {
      // Match fabricService.js parameter structure
      const response = await api.post('/supply-chain/qrcode/generate', {
        productId
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to generate QR code: ${error}`);
      throw error.response?.data || error.message;
    }
  },

  // Get product history (new function not in fabricService.js)
  getProductHistory: async (productId) => {
    try {
      const response = await api.get(`/supply-chain/product/history/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get product history: ${error}`);
      throw error.response?.data || error.message;
    }
  }
};



export default api;