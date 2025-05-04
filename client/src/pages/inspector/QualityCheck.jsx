// src/pages/inspector/QualityCheck.jsx
import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, supplyChainService } from '../../services/api';

const QualityCheck = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    productId: '',
    inspectorId: '', // Should come from auth context in a real app
    status: '',
    checkDetails: {
      temperature: '',
      moisture: '',
      appearance: '',
    }
  });
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In a real app, we would filter products ready for quality check
        const response = await productService.getAllProducts();
        
        // Filter for products that are in the appropriate stage for quality check
        const eligibleProducts = response.data.filter(
          product => product.Record.currentStage === 'Processed' || 
                     product.Record.currentStage === 'Harvested'
        );
        
        setProducts(eligibleProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setMessage({
          text: 'Failed to load products. Please try again.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (checkDetails)
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
      const response = await supplyChainService.recordQualityCheck(formData.productId, formData.inspectorId, formData.status, formData.checkDetails);
      
      setMessage({
        text: response.message || 'Quality check recorded successfully!',
        type: 'success'
      });
      
      // Reset form
      setFormData({
        productId: '',
        inspectorId: formData.inspectorId,
        status: '',
        checkDetails: {
          temperature: '',
          moisture: '',
          appearance: '',
        }
      });
      setSelectedProduct(null);
    } catch (error) {
      setMessage({
        text: error.message || 'Failed to record quality check.',
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
      
      <h1 className="text-2xl font-bold text-green-800 mb-6">Perform Quality Check</h1>
      
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
          <p className="mt-2 text-gray-600">Loading products...</p>
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
                No eligible products found for quality check. Products must be in 'Processed' or 'Harvested' stage.
              </p>
            )}
          </div>
          
          {selectedProduct && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700 mb-2">Product Details</h3>
              <p><strong>Name:</strong> {selectedProduct.name}</p>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
              <p><strong>Current Stage:</strong> {selectedProduct.currentStage}</p>
              <p><strong>Owner:</strong> {selectedProduct.owner}</p>
              {selectedProduct.batchId && (
                <p><strong>Batch ID:</strong> {selectedProduct.batchId}</p>
              )}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="inspectorId">
              Inspector ID*
            </label>
            <input
              type="text"
              id="inspectorId"
              name="inspectorId"
              value={formData.inspectorId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your inspector ID"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="status">
              Check Result*
            </label>
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="statusPassed"
                  name="status"
                  value="Passed"
                  checked={formData.status === 'Passed'}
                  onChange={handleChange}
                  required
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <label className="ml-2 block text-gray-700" htmlFor="statusPassed">
                  Passed
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="statusFailed"
                  name="status"
                  value="Failed"
                  checked={formData.status === 'Failed'}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <label className="ml-2 block text-gray-700" htmlFor="statusFailed">
                  Failed
                </label>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-green-700 mb-3">Check Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="checkDetails.temperature">
                  Temperature
                </label>
                <input
                  type="text"
                  id="checkDetails.temperature"
                  name="checkDetails.temperature"
                  value={formData.checkDetails.temperature}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="E.g. 20°C"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="checkDetails.moisture">
                  Moisture
                </label>
                <input
                  type="text"
                  id="checkDetails.moisture"
                  name="checkDetails.moisture"
                  value={formData.checkDetails.moisture}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="E.g. 15%"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="checkDetails.appearance">
                Appearance
              </label>
              <select
                id="checkDetails.appearance"
                name="checkDetails.appearance"
                value={formData.checkDetails.appearance}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Select appearance rating --</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
                <option value="Unacceptable">Unacceptable</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={submitting || products.length === 0}
            className={`w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 ${
              (submitting || products.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? 'Submitting...' : 'Submit Quality Check'}
          </button>
        </form>
      )}
    </div>
  );
};

export default QualityCheck;