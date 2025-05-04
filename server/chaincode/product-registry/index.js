'use strict';

const { Contract } = require('fabric-contract-api');

class ProductRegistry extends Contract {
    // Initialize the ledger with sample data
    async InitLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');

        // Sample bureau
        const bureau = {
            docType: 'bureau',
            id: 'BUR001',
            name: 'National Agricultural Bureau',
            approvedFarmers: ['FAR001'],
            region: 'Central',
            registrationDate: '2025-01-01'
        };

        // Sample farmer
        const farmer = {
            docType: 'stakeholder',
            id: 'FAR001',
            name: 'John Smith',
            role: 'Farmer',
            location: 'Central Valley',
            registrationDate: '2025-01-15',
            approvedBy: 'BUR001'
        };

        // Sample product
        const product = {
            docType: 'product',
            id: 'PROD001',
            name: 'Organic Tomatoes',
            description: 'Fresh organic tomatoes',
            owner: 'FAR001',
            currentStage: 'Planted',
            history: [
                {
                    stage: 'Registered',
                    timestamp: ctx.stub.getTxTimestamp(),
                    stakeholderId: 'BUR001',
                    notes: 'Product registered in the system'
                },
                {
                    stage: 'Planted',
                    timestamp: ctx.stub.getTxTimestamp(),
                    stakeholderId: 'FAR001',
                    notes: 'Seeds planted'
                }
            ],
            plantingDate: '2025-03-01',
            harvestDate: '',
            quantity: '100kg',
            cropDetails: {
                variety: 'Roma',
                organic: true,
                fertilizers: ['Compost', 'Fish emulsion']
            },
            batchId: '',
            qualityChecks: [],
            distributionInfo: {},
            retailInfo: {},
            qrCode: '',
            createdAt: new Date().toISOString()
        };

        // Store on the ledger
        await ctx.stub.putState(bureau.id, Buffer.from(JSON.stringify(bureau)));
        await ctx.stub.putState(farmer.id, Buffer.from(JSON.stringify(farmer)));
        await ctx.stub.putState(product.id, Buffer.from(JSON.stringify(product)));

        console.info('Added: ', bureau, farmer, product);
        console.info('============= END : Initialize Ledger ===========');
    }

    // ======= STAKEHOLDER MANAGEMENT FUNCTIONS =======

    // Register a new stakeholder (any role)
    async RegisterStakeholder(ctx, id, name, role, location, approvedBy = '') {
        console.info('============= START : Register Stakeholder ===========');

        // Check if stakeholder already exists
        const existingStakeholderBytes = await ctx.stub.getState(id);
        if (existingStakeholderBytes && existingStakeholderBytes.length > 0) {
            throw new Error(`Stakeholder ${id} already exists`);
        }

        // Create the stakeholder object
        const stakeholder = {
            docType: 'stakeholder',
            id,
            name,
            role,
            location,
            registrationDate: new Date().toISOString(),
            approvedBy: approvedBy
        };

        // Add specific properties based on role
        if (role === 'Farmer') {
            stakeholder.farms = [];
            stakeholder.products = [];
        } else if (role === 'Processor') {
            stakeholder.batches = [];
        } else if (role === 'Distributor') {
            stakeholder.distributedBatches = [];
        } else if (role === 'Retailer') {
            stakeholder.inventory = [];
            stakeholder.sales = [];
        }

        // Write to the ledger
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(stakeholder)));
        console.info('============= END : Register Stakeholder ===========');
        return JSON.stringify(stakeholder);
    }

    // Get stakeholder by ID
    async GetStakeholder(ctx, id) {
        console.info(`============= START : Get Stakeholder ${id} ===========`);
        const stakeholderBytes = await ctx.stub.getState(id);
        if (!stakeholderBytes || stakeholderBytes.length === 0) {
            throw new Error(`Stakeholder ${id} does not exist`);
        }
        console.info('============= END : Get Stakeholder ===========');
        return stakeholderBytes.toString();
    }

    // ======= BUREAU FUNCTIONS =======

    // Register a new agricultural bureau
    async RegisterBureau(ctx, id, name, region) {
        console.info('============= START : Register Bureau ===========');

        // Check if bureau already exists
        const existingBureauBytes = await ctx.stub.getState(id);
        if (existingBureauBytes && existingBureauBytes.length > 0) {
            throw new Error(`Bureau ${id} already exists`);
        }

        // Create the bureau object
        const bureau = {
            docType: 'bureau',
            id,
            name,
            region,
            approvedFarmers: [],
            registrationDate: new Date().toISOString()
        };

        // Write to the ledger
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(bureau)));
        console.info('============= END : Register Bureau ===========');
        return JSON.stringify(bureau);
    }

    async ApproveFarmer(ctx, bureauId, farmerId) {
        console.info('============= START : Approve Farmer ===========');

        // Get the bureau
        const bureauBytes = await ctx.stub.getState(bureauId);

        if (!bureauBytes || bureauBytes.length === 0) {
            throw new Error(`Bureau ${bureauId} does not exist`);
        }
        const bureau = JSON.parse(bureauBytes.toString());

        // Check if this is a valid bureau object
        if (bureau.docType !== 'bureau' && 
            !(bureau.docType === 'stakeholder' && bureau.role === 'Agricultural Bureau')) {
            throw new Error(`Object with ID ${bureauId} is not recognized as a bureau authority`);
        }
    
        // Ensure approvedFarmers array exists
        if (!bureau.approvedFarmers) {
            bureau.approvedFarmers = [];
        }
    
        // Get the farmer
        const farmerBytes = await ctx.stub.getState(farmerId);
        if (!farmerBytes || farmerBytes.length === 0) {
            throw new Error(`Farmer ${farmerId} does not exist`);
        }
        const farmer = JSON.parse(farmerBytes.toString());
    
        // Check if this is a valid stakeholder object
        if (farmer.docType !== 'stakeholder') {
            throw new Error(`Object with ID ${farmerId} is not a stakeholder`);
        }
    
        // Check if farmer role is actually 'Farmer'
        if (farmer.role !== 'Farmer') {
            throw new Error(`Stakeholder ${farmerId} is not a farmer`);
        }
    
        // Add farmer to approved list if not already approved
        if (!bureau.approvedFarmers.includes(farmerId)) {
            bureau.approvedFarmers.push(farmerId);
    
            // Update farmer's approvedBy field
            farmer.approvedBy = bureauId;
    
            // Write back to the ledger
            await ctx.stub.putState(bureauId, Buffer.from(JSON.stringify(bureau)));
            await ctx.stub.putState(farmerId, Buffer.from(JSON.stringify(farmer)));
        }
    
        console.info('============= END : Approve Farmer ===========');
        return JSON.stringify({
            bureau: bureau,
            farmer: farmer
        });
    }

    // ======= FARMER FUNCTIONS =======

    // Register a new product (by farmer)
    async RegisterProduct(ctx, id, name, description, farmerId, quantity, cropDetails) {
        console.info('============= START : Register New Product ===========');

        // Check if farmer exists and is approved
        const farmerBytes = await ctx.stub.getState(farmerId);
        if (!farmerBytes || farmerBytes.length === 0) {
            throw new Error(`Farmer ${farmerId} does not exist`);
        }
        const farmer = JSON.parse(farmerBytes.toString());

        if (farmer.role !== 'Farmer') {
            throw new Error(`Stakeholder ${farmerId} is not a farmer`);
        }

        if (!farmer.approvedBy) {
            throw new Error(`Farmer ${farmerId} is not approved by any bureau`);
        }

        // Parse crop details if provided as a string
        let parsedCropDetails = cropDetails;
        if (typeof cropDetails === 'string') {
            parsedCropDetails = JSON.parse(cropDetails);
        }

        // Create the product
        const product = {
            docType: 'product',
            id,
            name,
            description,
            owner: farmerId,
            currentStage: 'Registered',
            history: [
                {
                    stage: 'Registered',
                    timestamp: ctx.stub.getTxTimestamp(),
                    stakeholderId: farmerId,
                    notes: 'Product registered in the system'
                }
            ],
            plantingDate: '',
            harvestDate: '',
            quantity,
            cropDetails: parsedCropDetails,
            batchId: '',
            qualityChecks: [],
            distributionInfo: {},
            retailInfo: {},
            qrCode: `https://agrichain.example.com/product/${id}`,
            createdAt: new Date().toISOString()
        };

        // Update farmer's products array
        farmer.products.push(id);
        await ctx.stub.putState(farmerId, Buffer.from(JSON.stringify(farmer)));

        // Write product to the ledger
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(product)));
        console.info('============= END : Register New Product ===========');
        return JSON.stringify(product);
    }

    // Record planting event
    async RecordPlanting(ctx, productId, farmerId, plantingDate, additionalInfo) {
        return await this.UpdateProductStage(ctx, productId, farmerId, 'Planted',
            `Planted on ${plantingDate}`, { plantingDate, additionalInfo });
    }

    // Record growth event
    async RecordGrowth(ctx, productId, farmerId, growthDetails) {
        return await this.UpdateProductStage(ctx, productId, farmerId, 'Growing',
            'Growth stage recorded', { growthDetails });
    }

    // Record harvest event
    async RecordHarvest(ctx, productId, farmerId, harvestDate, harvestQuantity) {
        return await this.UpdateProductStage(ctx, productId, farmerId, 'Harvested',
            `Harvested on ${harvestDate}`, { harvestDate, harvestQuantity });
    }

    // ======= PROCESSOR FUNCTIONS =======

    // Record processing event
    async RecordProcessing(ctx, productId, processorId, batchId, processingDetails) {
        // Get processor information
        const processorBytes = await ctx.stub.getState(processorId);
        if (!processorBytes || processorBytes.length === 0) {
            throw new Error(`Processor ${processorId} does not exist`);
        }
        const processor = JSON.parse(processorBytes.toString());

        if (processor.role !== 'Processor') {
            throw new Error(`Stakeholder ${processorId} is not a processor`);
        }

        // Add batch to processor's records
        if (!processor.batches.includes(batchId)) {
            processor.batches.push(batchId);
            await ctx.stub.putState(processorId, Buffer.from(JSON.stringify(processor)));
        }

        // Update product stage
        return await this.UpdateProductStage(ctx, productId, processorId, 'Processed',
            `Processed into batch ${batchId}`, {
            batchId,
            processingDetails: typeof processingDetails === 'string'
                ? JSON.parse(processingDetails)
                : processingDetails
        });
    }

    // ======= QUALITY SUPERVISION BUREAU FUNCTIONS =======

    // Record quality check
    async RecordQualityCheck(ctx, productId, inspectorId, status, checkDetails) {
        // Get inspector information
        const inspectorBytes = await ctx.stub.getState(inspectorId);
        if (!inspectorBytes || inspectorBytes.length === 0) {
            throw new Error(`Inspector ${inspectorId} does not exist`);
        }
        const inspector = JSON.parse(inspectorBytes.toString());

        if (inspector.role !== 'Quality Inspector') {
            throw new Error(`Stakeholder ${inspectorId} is not a quality inspector`);
        }

        // Parse details if provided as string
        let parsedDetails = checkDetails;
        if (typeof checkDetails === 'string') {
            parsedDetails = JSON.parse(checkDetails);
        }

        const checkResult = {
            inspector: inspectorId,
            timestamp: ctx.stub.getTxTimestamp(),
            status: status,
            details: parsedDetails
        };

        // Update product with quality check
        return await this.UpdateProductStage(ctx, productId, inspectorId,
            status === 'Passed' ? 'QualityVerified' : 'QualityRejected',
            `Quality check ${status}`, { qualityCheck: checkResult });
    }

    // ======= DISTRIBUTOR FUNCTIONS =======

    // Record distribution event
    async RecordDistribution(ctx, productId, distributorId, destinationId, distributionDetails) {
        // Get distributor information
        const distributorBytes = await ctx.stub.getState(distributorId);
        if (!distributorBytes || distributorBytes.length === 0) {
            throw new Error(`Distributor ${distributorId} does not exist`);
        }
        const distributor = JSON.parse(distributorBytes.toString());

        if (distributor.role !== 'Distributor') {
            throw new Error(`Stakeholder ${distributorId} is not a distributor`);
        }

        // Get destination (retailer) information
        const destinationBytes = await ctx.stub.getState(destinationId);
        if (!destinationBytes || destinationBytes.length === 0) {
            throw new Error(`Destination ${destinationId} does not exist`);
        }
        const destination = JSON.parse(destinationBytes.toString());

        // Parse details if provided as string
        let parsedDetails = distributionDetails;
        if (typeof distributionDetails === 'string') {
            parsedDetails = JSON.parse(distributionDetails);
        }

        // Add product to distributor's records
        if (!distributor.distributedBatches.includes(productId)) {
            distributor.distributedBatches.push(productId);
            await ctx.stub.putState(distributorId, Buffer.from(JSON.stringify(distributor)));
        }

        // Add product to retailer's inventory
        if (!destination.inventory.includes(productId)) {
            destination.inventory.push(productId);
            await ctx.stub.putState(destinationId, Buffer.from(JSON.stringify(destination)));
        }

        // Update product ownership and stage
        const distInfo = {
            distributorId,
            destinationId,
            timestamp: ctx.stub.getTxTimestamp(),
            details: parsedDetails
        };

        return await this.UpdateProductStage(ctx, productId, distributorId, 'Distributed',
            `Distributed to ${destination.name}`, { distributionInfo: distInfo });
    }

    // ======= RETAILER FUNCTIONS =======

    // Record retail sale
    async RecordRetailSale(ctx, productId, retailerId, quantity, saleDetails) {
        // Get retailer information
        const retailerBytes = await ctx.stub.getState(retailerId);
        if (!retailerBytes || retailerBytes.length === 0) {
            throw new Error(`Retailer ${retailerId} does not exist`);
        }
        const retailer = JSON.parse(retailerBytes.toString());

        if (retailer.role !== 'Retailer') {
            throw new Error(`Stakeholder ${retailerId} is not a retailer`);
        }

        // Parse details if provided as string
        let parsedDetails = saleDetails;
        if (typeof saleDetails === 'string') {
            parsedDetails = JSON.parse(saleDetails);
        }

        // Record the sale in retailer's records
        const saleRecord = {
            productId,
            quantity,
            timestamp: ctx.stub.getTxTimestamp(),
            details: parsedDetails
        };

        retailer.sales.push(saleRecord);
        await ctx.stub.putState(retailerId, Buffer.from(JSON.stringify(retailer)));

        // Update product stage
        return await this.UpdateProductStage(ctx, productId, retailerId, 'Sold',
            `Sold ${quantity} units at retail`, { retailInfo: saleRecord });
    }

    // Generate QR code for a product
    async GenerateQRCode(ctx, productId) {
        // Get the product
        const productBytes = await ctx.stub.getState(productId);
        if (!productBytes || productBytes.length === 0) {
            throw new Error(`Product ${productId} does not exist`);
        }
        const product = JSON.parse(productBytes.toString());

        // Generate QR code URL (in a real implementation, this would create an actual QR code)
        product.qrCode = `https://agrichain.example.com/trace/${productId}?t=${Date.now()}`;

        // Write back to ledger
        await ctx.stub.putState(productId, Buffer.from(JSON.stringify(product)));

        return product.qrCode;
    }

    // ======= GENERAL PRODUCT FUNCTIONS =======

    // Helper function to update product stage and add to history
    async UpdateProductStage(ctx, productId, stakeholderId, newStage, notes, additionalData = {}) {
        console.info(`============= START : Update Product Stage to ${newStage} ===========`);

        // Get the product
        const productBytes = await ctx.stub.getState(productId);
        if (!productBytes || productBytes.length === 0) {
            throw new Error(`Product ${productId} does not exist`);
        }
        const product = JSON.parse(productBytes.toString());

        // If there's a new owner, update it
        if (additionalData.newOwner) {
            product.owner = additionalData.newOwner;
        }

        // Update special fields
        if (newStage === 'Planted' && additionalData.plantingDate) {
            product.plantingDate = additionalData.plantingDate;
        }

        if (newStage === 'Harvested' && additionalData.harvestDate) {
            product.harvestDate = additionalData.harvestDate;
            if (additionalData.harvestQuantity) {
                product.quantity = additionalData.harvestQuantity;
            }
        }

        if (newStage === 'Processed' && additionalData.batchId) {
            product.batchId = additionalData.batchId;
        }

        if (newStage === 'QualityVerified' || newStage === 'QualityRejected') {
            product.qualityChecks.push(additionalData.qualityCheck);
        }

        if (newStage === 'Distributed') {
            product.distributionInfo = additionalData.distributionInfo;
        }

        if (newStage === 'Sold') {
            product.retailInfo = additionalData.retailInfo;
        }

        // Record stage change in history
        const historyEntry = {
            stage: newStage,
            timestamp: ctx.stub.getTxTimestamp(),
            stakeholderId: stakeholderId,
            notes: notes
        };

        product.history.push(historyEntry);
        product.currentStage = newStage;

        // Write the updated product back to the ledger
        await ctx.stub.putState(productId, Buffer.from(JSON.stringify(product)));
        console.info('============= END : Update Product Stage ===========');

        return JSON.stringify(product);
    }

    // Query product information by ID
    async GetProduct(ctx, id) {
        console.info('============= START : Get Product ===========');
        const productAsBytes = await ctx.stub.getState(id);
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`Product ${id} does not exist`);
        }
        console.info('============= END : Get Product ===========');
        return productAsBytes.toString();
    }

    // Get product history from the ledger
    async GetProductHistory(ctx, id) {
        console.info('============= START : Get Product History ===========');
        const productAsBytes = await ctx.stub.getState(id);
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`Product ${id} does not exist`);
        }

        const product = JSON.parse(productAsBytes.toString());

        console.info('============= END : Get Product History ===========');
        return JSON.stringify(product.history);
    }

    // Get all products on the ledger
    async GetAllProducts(ctx) {
        console.info('============= START : Get All Products ===========');
        const startKey = '';
        const endKey = '';
        const allResults = [];

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                    // Only include product documents
                    if (Record.docType === 'product') {
                        allResults.push({ Key, Record });
                    }
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info('============= END : Get All Products ===========');
                return JSON.stringify(allResults);
            }
        }
    }

    // Get all stakeholders by role
    async GetStakeholdersByRole(ctx, role) {
        console.info(`============= START : Get Stakeholders by Role: ${role} ===========`);
        const startKey = '';
        const endKey = '';
        const allResults = [];

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                    // Only include stakeholders with matching role
                    if (Record.docType === 'stakeholder' && Record.role === role) {
                        allResults.push({ Key, Record });
                    }
                } catch (err) {
                    console.log(err);
                }
            }
            if (res.done) {
                await iterator.close();
                console.info(`============= END : Get Stakeholders by Role: ${role} ===========`);
                return JSON.stringify(allResults);
            }
        }
    }

    // Get all stakeholders from the ledger
    async GetAllStakeholders(ctx) {
        console.info('============= START : Get All Stakeholders ===========');
        const startKey = '';
        const endKey = '';
        const allResults = [];

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                    // Only include stakeholder documents
                    if (Record.docType === 'stakeholder' || Record.docType === 'bureau') {
                        allResults.push({ Key, Record });
                    }
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info('============= END : Get All Stakeholders ===========');
                return JSON.stringify(allResults);
            }
        }
    }
}

module.exports = ProductRegistry;