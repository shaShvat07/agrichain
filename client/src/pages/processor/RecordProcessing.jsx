// src/pages/processor/RecordProcessing.jsx
import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, supplyChainService } from '../../services/api';

const RecordProcessing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    productId: '',
    processorId: '', // Should come from auth context in a real app
    batchId: '',
    processingDetails: {
      processingDate: '',
      processingMethod: '',
      outputQuantity: '',
    }
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In a real app, we would filter products ready for processing
        const response = await productService.getAllProducts();

        // Filter for products that are in the appropriate stage for processing
        const eligibleProducts = response.data.filter(
          product => product.Record.currentStage === 'Harvested' ||
            product.Record.currentStage === 'QualityVerified'
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
      // Handle nested properties (processingDetails)
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

  const generateBatchId = () => {
    const prefix = 'BAT';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const batchId = `${prefix}${timestamp}${random}`;

    setFormData({
      ...formData,
      batchId
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await supplyChainService.recordProcessing(formData.productId, formData.processorId, formData.batchId, formData.processingDetails);

      setMessage({
        text: response.message || 'Processing recorded successfully!',
        type: 'success'
      });

      // Reset form
      setFormData({
        productId: '',
        processorId: formData.processorId,
        batchId: '',
        processingDetails: {
          processingDate: '',
          processingMethod: '',
          outputQuantity: '',
        }
      });
      setSelectedProduct(null);
    } catch (error) {
      setMessage({
        text: error.message || 'Failed to record processing.',
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

      <h1 className="text-2xl font-bold text-green-800 mb-6">Record Processing</h1>

      {message.text && (
        <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                No eligible products found for processing. Products must be in 'Harvested' or 'QualityVerified' stage.
              </p>
            )}
          </div>

          {selectedProduct && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700 mb-2">Product Details</h3>
              <p><strong>Name:</strong> {selectedProduct.name}</p>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
              <p><strong>Current Stage:</strong> {selectedProduct.currentStage}</p>
              <p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
              <p><strong>Owner:</strong> {selectedProduct.owner}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="processorId">
              Processor ID*
            </label>
            <input
              type="text"
              id="processorId"
              name="processorId"
              value={formData.processorId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your processor ID"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="batchId">
              Batch ID*
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="batchId"
                name="batchId"
                value={formData.batchId}
                onChange={handleChange}
                required
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter batch ID"
              />
              <button
                type="button"
                onClick={generateBatchId}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                Generate
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-green-700 mb-3">Processing Details</h3>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="processingDetails.processingDate">
                Processing Date*
              </label>
              <input
                type="date"
                id="processingDetails.processingDate"
                name="processingDetails.processingDate"
                value={formData.processingDetails.processingDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="processingDetails.processingMethod">
                Processing Method*
              </label>
              <select
                id="processingDetails.processingMethod"
                name="processingDetails.processingMethod"
                value={formData.processingDetails.processingMethod}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Select processing method --</option>
                <option value="Washing">Washing</option>
                <option value="Sorting">Sorting</option>
                <option value="Drying">Drying</option>
                <option value="Grinding">Grinding</option>
                <option value="Packaging">Packaging</option>
                <option value="Freezing">Freezing</option>
                <option value="Canning">Canning</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="processingDetails.outputQuantity">
                Output Quantity*
              </label>
              <input
                type="text"
                id="processingDetails.outputQuantity"
                name="processingDetails.outputQuantity"
                value={formData.processingDetails.outputQuantity}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="E.g. 80kg, 40 packages"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || products.length === 0}
            className={`w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 ${(submitting || products.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {submitting ? 'Processing...' : 'Record Processing'}
          </button>
        </form>
      )}
    </div>
  );
};

export default RecordProcessing;