// src/pages/farmer/RegisterProduct.jsx
import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/api';

const RegisterProduct = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    farmerId: '', // This should come from auth context in a real app
    quantity: '',
    cropDetails: {
      variety: '',
      organic: false,
      fertilizers: '',
      pesticides: ''
    }
  });
  
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (cropDetails)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      // Handle top-level properties
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      // Format fertilizers as array
      const cropDetails = {
        ...formData.cropDetails,
        fertilizers: formData.cropDetails.fertilizers.split(',').map(item => item.trim())
      };
      
      const productData = {
        ...formData,
        cropDetails
      };
      
      const response = await productService.registerProduct(productData);
      setMessage({ 
        text: response.message || 'Product registered successfully!', 
        type: 'success' 
      });
      
      // Reset form
      setFormData({
        id: '',
        name: '',
        description: '',
        farmerId: formData.farmerId, // Keep the farmer ID
        quantity: '',
        cropDetails: {
          variety: '',
          organic: false,
          fertilizers: '',
          pesticides: ''
        }
      });
    } catch (error) {
      setMessage({ 
        text: error.message || 'Failed to register product.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-green-600 hover:text-green-800">
          ← Back to Dashboard
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold text-green-800 mb-6">Register New Agricultural Product</h1>
      
      {message.text && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="id">
              Product ID*
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter unique product ID"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
              Product Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter product name"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter product description"
            ></textarea>
          </div>
          
          <div>
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
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="quantity">
              Quantity*
            </label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="E.g. 100kg, 50 bushels"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-green-700 mb-3">Crop Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="cropDetails.variety">
                Variety
              </label>
              <input
                type="text"
                id="cropDetails.variety"
                name="cropDetails.variety"
                value={formData.cropDetails.variety}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="E.g. Roma tomatoes, Russet potatoes"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="cropDetails.organic"
                name="cropDetails.organic"
                checked={formData.cropDetails.organic}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-gray-700" htmlFor="cropDetails.organic">
                Organic
              </label>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="cropDetails.fertilizers">
                Fertilizers Used
              </label>
              <input
                type="text"
                id="cropDetails.fertilizers"
                name="cropDetails.fertilizers"
                value={formData.cropDetails.fertilizers}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter comma-separated list"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="cropDetails.pesticides">
                Pesticides Used
              </label>
              <input
                type="text"
                id="cropDetails.pesticides"
                name="cropDetails.pesticides"
                value={formData.cropDetails.pesticides}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter pesticides used, if any"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Registering...' : 'Register Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterProduct;