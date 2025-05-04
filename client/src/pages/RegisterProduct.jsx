// src/pages/RegisterProduct.jsx
import React from 'react'
import { useState } from 'react';
import { productService } from '../services/api';

const RegisterProduct = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    owner: ''
  });
  
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const response = await productService.registerProduct(formData);
      setMessage({ 
        text: response.message || 'Product registered successfully!', 
        type: 'success' 
      });
      setFormData({ id: '', name: '', description: '', owner: '' });
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Register New Product</h1>
      
      {message.text && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="id">
            Product ID
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
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
            Product Name
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
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
            Description
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
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="owner">
            Owner
          </label>
          <input
            type="text"
            id="owner"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter owner name"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Registering...' : 'Register Product'}
        </button>
      </form>
    </div>
  );
};

export default RegisterProduct;