// src/pages/distributor/RecordDistribution.jsx
import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, stakeholderService, supplyChainService } from '../../services/api';

const RecordDistribution = () => {
  const [products, setProducts] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    productId: '',
    distributorId: '', // Should come from auth context in a real app
    destinationId: '',
    distributionDetails: {
      distributionDate: '',
      transportMethod: '',
      estimatedArrival: '',
      temperature: '',
    }
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products eligible for distribution
        const productsResponse = await productService.getAllProducts();
        
        // Filter for products in the appropriate stage
        const eligibleProducts = productsResponse.data.filter(
          product => product.Record.currentStage === 'Processed' || 
                     product.Record.currentStage === 'QualityVerified'
        );
        
        setProducts(eligibleProducts);
        
        // Fetch retailers
        const retailersResponse = await stakeholderService.getStakeholdersByRole('Retailer');
        setRetailers(retailersResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setMessage({
          text: 'Failed to load data. Please try again.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (distributionDetails)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      // Handle top-level properties
      setFormData({
        ...formData,
        [name]: value
      });
      
      // If product ID changes, load product details
      if (name === 'productId' && value) {
        const selectedProduct = products.find(p => p.Record.id === value);
        setSelectedProduct(selectedProduct?.Record || null);
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });
    
    try {
      const response = await supplyChainService.recordDistribution(formData.productId, formData.distributorId, formData.destinationId, formData.distributionDetails);
      
      setMessage({
        text: response.message || 'Distribution recorded successfully!',
        type: 'success'
      });
      
      // Reset form
      setFormData({
        productId: '',
        distributorId: formData.distributorId,
        destinationId: '',
        distributionDetails: {
          distributionDate: '',
          transportMethod: '',
          estimatedArrival: '',
          temperature: '',
        }
      });
      setSelectedProduct(null);
    } catch (error) {
      setMessage({
        text: error.message || 'Failed to record distribution.',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-green-600 hover:text-green-800">
          ← Back to Dashboard
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold text-green-800 mb-6">Record Distribution</h1>
      
      {message.text && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">Loading data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="productId">
              Select Product*
            </label>
            {products.length > 0 ? (
              <select
                id="productId"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Select a product --</option>
                {products.map(product => (
                  <option key={product.Key} value={product.Record.id}>
                    {product.Record.name} (ID: {product.Record.id})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-yellow-600">
                No eligible products found for distribution. Products must be in 'Processed' or 'QualityVerified' stage.
              </p>
            )}
          </div>
          
          {selectedProduct && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700 mb-2">Product Details</h3>
              <p><strong>Name:</strong> {selectedProduct.name}</p>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
              <p><strong>Current Stage:</strong> {selectedProduct.currentStage}</p>
              {selectedProduct.batchId && (
                <p><strong>Batch ID:</strong> {selectedProduct.batchId}</p>
              )}
              <p><strong>Owner:</strong> {selectedProduct.owner}</p>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="distributorId">
              Distributor ID*
            </label>
            <input
              type="text"
              id="distributorId"
              name="distributorId"
              value={formData.distributorId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your distributor ID"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="destinationId">
              Destination (Retailer)*
            </label>
            {retailers.length > 0 ? (
              <select
                id="destinationId"
                name="destinationId"
                value={formData.destinationId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Select a retailer --</option>
                {retailers.map(retailer => (
                  <option key={retailer.Key} value={retailer.Record.id}>
                    {retailer.Record.name} ({retailer.Record.location})
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center">
                <input
                  type="text"
                  id="destinationId"
                  name="destinationId"
                  value={formData.destinationId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter retailer ID"
                />
                <div className="ml-2 text-yellow-600 text-sm">
                  No retailers found. Enter ID manually.
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-green-700 mb-3">Distribution Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="distributionDetails.distributionDate">
                  Distribution Date*
                </label>
                <input
                  type="date"
                  id="distributionDetails.distributionDate"
                  name="distributionDetails.distributionDate"
                  value={formData.distributionDetails.distributionDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="distributionDetails.estimatedArrival">
                  Estimated Arrival*
                </label>
                <input
                  type="date"
                  id="distributionDetails.estimatedArrival"
                  name="distributionDetails.estimatedArrival"
                  value={formData.distributionDetails.estimatedArrival}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="distributionDetails.transportMethod">
                Transport Method*
              </label>
              <select
                id="distributionDetails.transportMethod"
                name="distributionDetails.transportMethod"
                value={formData.distributionDetails.transportMethod}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Select transport method --</option>
                <option value="Truck">Truck</option>
                <option value="Rail">Rail</option>
                <option value="Ship">Ship</option>
                <option value="Air">Air</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="distributionDetails.temperature">
                Transport Temperature
              </label>
              <input
                type="text"
                id="distributionDetails.temperature"
                name="distributionDetails.temperature"
                value={formData.distributionDetails.temperature}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="E.g. Ambient, 4°C, -18°C"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={submitting || products.length === 0}
            className={`w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 ${
              (submitting || products.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? 'Processing...' : 'Record Distribution'}
          </button>
        </form>
      )}
    </div>
  );
};

export default RecordDistribution;