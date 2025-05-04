import React from "react";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { stakeholderService } from '../../services/api';

const RegisterStakeholder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    role: '',
    location: ''
  });
  
  const roles = [
    { id: 'farmer', name: 'Farmer' },
    { id: 'processor', name: 'Processor' },
    { id: 'bureau', name: 'Agricultural Bureau' },
    { id: 'inspector', name: 'Quality Inspector' },
    { id: 'distributor', name: 'Distributor' },
    { id: 'retailer', name: 'Retailer' }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const generateId = () => {
    const rolePrefix = formData.role 
      ? formData.role.substring(0, 3).toUpperCase()
      : 'STK';
    
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    setFormData({
      ...formData,
      id: `${rolePrefix}${timestamp}${random}`
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      let response;
      // Ensure we only send 4 parameters consistently for both paths
      const stakeholderData = {
        id: formData.id,
        name: formData.name,
        role: formData.role,
        location: formData.location
      };
      
      if (formData.role === 'Agricultural Bureau') {
        // Register as bureau - still send all 4 parameters to maintain consistency
        console.log('Registering as Bureau:', stakeholderData);
        response = await stakeholderService.registerBureau(stakeholderData);
      } else {
        // Register as other stakeholder - same 4 parameters
        console.log('Registering as normal user:', stakeholderData);
        response = await stakeholderService.registerStakeholder(stakeholderData);
      }
      
      setMessage({
        text: response.message || 'Registration successful!',
        type: 'success'
      });
      
      // Redirect to appropriate page after successful registration
      setTimeout(() => {
        if (formData.role === 'Farmer') {
          navigate('/register-product');
        } else {
          navigate('/dashboard');
        }
      }, 2000);
      
    } catch (error) {
      setMessage({
        text: error.message || 'Registration failed. Please try again.',
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
          ← Back to Home
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold text-green-800 mb-6">Register as a Stakeholder</h1>
      
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
            Stakeholder ID*
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter unique stakeholder ID"
            />
            <button
              type="button"
              onClick={generateId}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Generate
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
            Full Name / Organization Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your name or organization name"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="role">
            Role*
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">-- Select your role --</option>
            {roles.map(role => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="location">
            Location*
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="City, State, Country"
          />
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Registering...' : 'Register Stakeholder'}
          </button>
        </div>
      </form>
      
      <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-800 mb-3">What happens next?</h2>
        <p className="text-gray-700 mb-4">
          After registration, your account will be created and you'll gain access to:
        </p>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Role-specific dashboard</li>
          <li>Supply chain management tools</li>
          <li>Agricultural product traceability features</li>
        </ul>
        <p className="text-gray-700 mt-4">
          <strong>Note for Farmers:</strong> After registration, you'll need approval from an Agricultural Bureau before you can register products.
        </p>
      </div>
    </div>
  );
};

export default RegisterStakeholder;