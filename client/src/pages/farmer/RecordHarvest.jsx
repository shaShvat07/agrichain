// src/pages/farmer/RecordHarvest.jsx
import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, supplyChainService } from '../../services/api';

const RecordHarvest = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    productId: '',
    farmerId: '', // This should come from auth context in a real app
    harvestDate: '',
    harvestQuantity: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In a real app, we would fetch only this farmer's products
        const response = await productService.getAllProducts();

        // Filter for products that are in 'Growing' stage
        const eligibleProducts = response.data.filter(
          product => product.Record.currentStage === 'Growing' ||
            product.Record.currentStage === 'Planted'
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
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      // Validate form data before submission
      if (!formData.productId || !formData.farmerId || !formData.harvestDate || !formData.harvestQuantity) {
        throw new Error('Please fill in all required fields');
      }

      console.log('Submitting harvest data:', formData);

      // Send the entire formData object - our API service can now handle this structure
      console.log(formData.harvestDate, formData.harvestQuantity);
      const response = await supplyChainService.recordHarvest(
        formData.productId,
        formData.farmerId,
        formData.harvestDate,
        formData.harvestQuantity
      );

      setMessage({
        text: 'Harvest recorded successfully!',
        type: 'success'
      });

      // Reset form except for farmerId
      setFormData({
        productId: '',
        farmerId: formData.farmerId,
        harvestDate: '',
        harvestQuantity: ''
      });

      // Optionally refresh the product list to show updated status
      const refreshedProducts = await productService.getAllProducts();
      const eligibleProducts = refreshedProducts.data.filter(
        product => product.Record.currentStage === 'Growing' ||
          product.Record.currentStage === 'Planted'
      );
      setProducts(eligibleProducts);

    } catch (error) {
      console.error('Error recording harvest:', error);
      setMessage({
        text: error.message || 'Failed to record harvest. Please try again.',
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

      <h1 className="text-2xl font-bold text-green-800 mb-6">Record Harvest</h1>

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
                    {product.Record.name || product.Record.type || product.Record.id}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-yellow-600">
                No eligible products found for harvest. Products must be in 'Growing' or 'Planted' stage.
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="farmerId">
              Farmer ID*
            </label>
            <input
              type="text"
              id="farmerId"
              name="farmerId"
              value={formData.farmerId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your farmer ID"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="harvestDate">
              Harvest Date*
            </label>
            <input
              type="date"
              id="harvestDate"
              name="harvestDate"
              value={formData.harvestDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="harvestQuantity">
              Harvest Quantity*
            </label>
            <input
              type="text"
              id="harvestQuantity"
              name="harvestQuantity"
              value={formData.harvestQuantity}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="E.g. 100kg, 50 bushels"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || products.length === 0}
            className={`w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 ${(submitting || products.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {submitting ? 'Recording...' : 'Record Harvest'}
          </button>
        </form>
      )}
    </div>
  );
};

export default RecordHarvest;