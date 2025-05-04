// services/fabricService.js
import { Gateway, Wallets } from 'fabric-network';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { fabricConfig } from '../config/fabric-config.js';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to get connection profile path
const getConnectionProfilePath = () => {
  return path.resolve(__dirname, '..', '..', 'fabric-samples', 'test-network', 'organizations', 
    'peerOrganizations', 'org1.example.com',
    'connection-org1.json');
};

// Helper function to connect to the fabric network
async function connectToNetwork() {
  try {
    // Load the connection profile
    const ccpPath = getConnectionProfilePath();
    if (!fs.existsSync(ccpPath)) {
      throw new Error('Connection profile not found. Make sure the Fabric network is running.');
    }
    
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities
    const walletPath = path.join(__dirname, '..', 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check if user identity exists
    const identity = await wallet.get(fabricConfig.appUser);
    if (!identity) {
      throw new Error(`An identity for the user "${fabricConfig.appUser}" does not exist in the wallet. Run registerUser.js first.`);
    }

    // Create a new gateway for connecting to the peer node
    const gateway = new Gateway();
    await gateway.connect(ccp, { 
      wallet, 
      identity: fabricConfig.appUser, 
      discovery: { enabled: true, asLocalhost: true } 
    });

    // Get the network (channel) our contract is deployed to
    const network = await gateway.getNetwork(fabricConfig.channelName);

    // Get the contract from the network
    const contract = network.getContract(fabricConfig.contractName);

    return { gateway, contract };
  } catch (error) {
    console.error(`Failed to connect to network: ${error}`);
    throw error;
  }
}

// ======= STAKEHOLDER MANAGEMENT FUNCTIONS =======
// Modified registerStakeholder function for fabricService.js
export const registerStakeholder = async (id, name, role, location, approvedBy = '') => {
  try {
    const { gateway, contract } = await connectToNetwork();

    try {
      // Only pass the 4 required parameters, without the approvedBy parameter
      const result = await contract.submitTransaction('RegisterStakeholder', id, name, role, location);
      return JSON.parse(result.toString());
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to register stakeholder: ${error}`);
    throw error;
  }
};

// Modified registerBureau function for fabricService.js
export const registerBureau = async (bureauData) => {
  try {
    const { gateway, contract } = await connectToNetwork();

    try {
      // Extract only the required fields and use location as region
      const { id, name, location } = bureauData;
      
      // Pass exactly the parameters expected by the chaincode: id, name, region
      const result = await contract.submitTransaction('RegisterBureau', id, name, location);
      return JSON.parse(result.toString());
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to register bureau: ${error}`);
    throw error;
  }
};

// Get stakeholder by ID
export const getStakeholder = async (id) => {
  try {
    const { gateway, contract } = await connectToNetwork();

    try {
      const result = await contract.evaluateTransaction('GetStakeholder', id);
      return JSON.parse(result.toString());
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to get stakeholder: ${error}`);
    throw error;
  }
};

// Get stakeholders by role
export const getStakeholdersByRole = async (role) => {
  try {
    const { gateway, contract } = await connectToNetwork();

    try {
      const result = await contract.evaluateTransaction('GetStakeholdersByRole', role);
      return JSON.parse(result.toString());
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to get stakeholders by role: ${error}`);
    throw error;
  }
};


// Approve farmer by bureau
export const approveFarmer = async (bureauId, farmerId) => {
  try {
    const { gateway, contract } = await connectToNetwork();

    try {
      const result = await contract.submitTransaction('ApproveFarmer', bureauId, farmerId);
      return JSON.parse(result.toString());
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to approve farmer: ${error}`);
    throw error;
  }
};

// ======= PRODUCT FUNCTIONS =======

// Register a product
export const registerProduct = async (id, name, description, farmerId, quantity, cropDetails) => {
  try {
    const { gateway, contract } = await connectToNetwork();

    try {
      // Convert cropDetails to string if it's an object
      const cropDetailsStr = typeof cropDetails === 'object' 
        ? JSON.stringify(cropDetails) 
        : cropDetails;
      
      const result = await contract.submitTransaction(
        'RegisterProduct', 
        id, 
        name, 
        description, 
        farmerId, 
        quantity,
        cropDetailsStr
      );
      return JSON.parse(result.toString());
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to register product: ${error}`);
    throw error;
  }
};

// Get a product by ID
export const getProduct = async (id) => {
  try {
    const { gateway, contract } = await connectToNetwork();

    try {
      const result = await contract.evaluateTransaction('GetProduct', id);
      return JSON.parse(result.toString());
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to get product: ${error}`);
    throw error;
  }
};

// Get product history
export const getProductHistory = async (id) => {
  try {
    const { gateway, contract } = await connectToNetwork();

    try {
      const result = await contract.evaluateTransaction('GetProductHistory', id);
      return JSON.parse(result.toString());
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to get product history: ${error}`);
    throw error;
  }
};

// Get all products
export const getAllProducts = async () => {
  try {
    const { gateway, contract } = await connectToNetwork();

    try {
      const result = await contract.evaluateTransaction('GetAllProducts');
      return JSON.parse(result.toString());
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to get all products: ${error}`);
    throw error;
  }
};

// Filter products - utility function to filter products by different criteria
const filterProducts = async (filterFunction) => {
  try {
    const allProducts = await getAllProducts();
    const products = JSON.parse(allProducts);
    return products.filter(filterFunction);
  } catch (error) {
    console.error(`Failed to filter products: ${error}`);
    throw error;
  }
};

// Get products by farmer
export const getProductsByFarmer = async (farmerId) => {
  try {
    return await filterProducts(product => product.Record.owner === farmerId);
  } catch (error) {
    console.error(`Failed to get products by farmer: ${error}`);
    throw error;
  }
};

// Get products by stage
export const getProductsByStage = async (stage) => {
  try {
    return await filterProducts(product => product.Record.currentStage === stage);
  } catch (error) {
    console.error(`Failed to get products by stage: ${error}`);
    throw error;
  }
};

//fabricService.js
// ======= SUPPLY CHAIN FUNCTIONS =======

// Record planting
export const recordPlanting = async (productId, farmerId, plantingDate, additionalInfo) => {
  try {
    const { gateway, contract } = await connectToNetwork();

    try {
      // Convert additionalInfo to string if it's an object
      const additionalInfoStr = typeof additionalInfo === 'object' 
        ? JSON.stringify(additionalInfo) 
        : additionalInfo || '';
      
      const result = await contract.submitTransaction(
        'RecordPlanting', 
        productId, 
        farmerId, 
        plantingDate, 
        additionalInfoStr
      );
      return JSON.parse(result.toString());
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to record planting: ${error}`);
    throw error;
  }
};

// Record growth
export const recordGrowth = async (productId, farmerId, growthDetails) => {
  try {
    const { gateway, contract } = await connectToNetwork();

    try {
      // Convert growthDetails to string if it's an object
      const growthDetailsStr = typeof growthDetails === 'object' 
        ? JSON.stringify(growthDetails) 
        : growthDetails;
      
      const result = await contract.submitTransaction(
        'RecordGrowth', 
        productId, 
        farmerId, 
        growthDetailsStr
      );
      return JSON.parse(result.toString());
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to record growth: ${error}`);
    throw error;
  }
};

// Record harvest
export const recordHarvest = async (productId, farmerId, harvestDate, harvestQuantity) => {
  try {
    const { gateway, contract } = await connectToNetwork();

    try {
      const result = await contract.submitTransaction(
        'RecordHarvest', 
        productId, 
        farmerId, 
        harvestDate, 
        harvestQuantity.toString()
      );
      return JSON.parse(result.toString());
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to record harvest: ${error}`);
    throw error;
  }
};

// Record processing
export const recordProcessing = async (productId, processorId, batchId, processingDetails) => {
  try {
    const { gateway, contract } = await connectToNetwork();

    try {
      // Convert processingDetails to string if it's an object
      const processingDetailsStr = typeof processingDetails === 'object' 
        ? JSON.stringify(processingDetails) 
        : processingDetails || '';
      
      const result = await contract.submitTransaction(
        'RecordProcessing', 
        productId, 
        processorId, 
        batchId, 
        processingDetailsStr
      );
      return JSON.parse(result.toString());
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to record processing: ${error}`);
    throw error;
  }
};

// Record quality check
export const recordQualityCheck = async (productId, inspectorId, status, checkDetails) => {
  try {
    const { gateway, contract } = await connectToNetwork();

    try {
      // Convert checkDetails to string if it's an object
      const checkDetailsStr = typeof checkDetails === 'object' 
        ? JSON.stringify(checkDetails) 
        : checkDetails || '';
      
      const result = await contract.submitTransaction(
        'RecordQualityCheck', 
        productId, 
        inspectorId, 
        status, 
        checkDetailsStr
      );
      return JSON.parse(result.toString());
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to record quality check: ${error}`);
    throw error;
  }
};

// Record distribution
export const recordDistribution = async (productId, distributorId, destinationId, distributionDetails) => {
  try {
    const { gateway, contract } = await connectToNetwork();

    try {
      // Convert distributionDetails to string if it's an object
      const distributionDetailsStr = typeof distributionDetails === 'object' 
        ? JSON.stringify(distributionDetails) 
        : distributionDetails || '';
      
      const result = await contract.submitTransaction(
        'RecordDistribution', 
        productId, 
        distributorId, 
        destinationId, 
        distributionDetailsStr
      );
      return JSON.parse(result.toString());
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to record distribution: ${error}`);
    throw error;
  }
};

// Record retail sale
export const recordRetailSale = async (productId, retailerId, quantity, saleDetails) => {
  try {
    const { gateway, contract } = await connectToNetwork();

    try {
      // Convert saleDetails to string if it's an object
      const saleDetailsStr = typeof saleDetails === 'object' 
        ? JSON.stringify(saleDetails) 
        : saleDetails || '';
      
      const result = await contract.submitTransaction(
        'RecordRetailSale', 
        productId, 
        retailerId, 
        quantity.toString(), 
        saleDetailsStr
      );
      return JSON.parse(result.toString());
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to record retail sale: ${error}`);
    throw error;
  }
};

// Generate QR code
export const generateQRCode = async (productId) => {
  try {
    const { gateway, contract } = await connectToNetwork();

    try {
      const result = await contract.submitTransaction('GenerateQRCode', productId);
      return result.toString();
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to generate QR code: ${error}`);
    throw error;
  }
};


// Get all stakeholders
export const getAllStakeholders = async () => {
  try {
    const { gateway, contract } = await connectToNetwork();

    try {
      // We'll use a custom function in the chaincode to get all stakeholders
      // If your chaincode doesn't have this function, you need to add one similar to GetAllProducts
      const result = await contract.evaluateTransaction('GetAllStakeholders');
      return JSON.parse(result.toString());
    } catch (error) {
      // If the specific GetAllStakeholders function doesn't exist, we can filter from all states
      console.log('Falling back to filtering all state entries for stakeholders');
      const allEntries = await contract.evaluateTransaction('GetAllProducts'); // This gets all states
      const entries = JSON.parse(allEntries.toString());
      return entries.filter(entry => entry.Record.docType === 'stakeholder');
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`Failed to get all stakeholders: ${error}`);
    throw error;
  }
};