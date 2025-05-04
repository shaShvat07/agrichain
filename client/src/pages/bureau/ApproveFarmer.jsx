// src/pages/bureau/ApproveFarmer.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { stakeholderService } from '../../services/api';

const ApproveFarmer = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    bureauId: '', // Should come from auth context in a real app
    farmerId: ''
  });
  
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        // Fetch farmers
        const response = await stakeholderService.getStakeholdersByRole('Farmer');
        
        // Filter for farmers that have not been approved yet
        const unapprovedFarmers = response.data.filter(farmer => 
          !farmer.Record.approvedBy || farmer.Record.approvedBy === ''
        );
        
        setFarmers(unapprovedFarmers);
      } catch (error) {
        console.error('Failed to fetch farmers:', error);
        setMessage({
          text: 'Failed to load farmers. Please try again.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFarmers();
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
      const response = await stakeholderService.approveFarmer(formData);
      
      setMessage({
        text: response.message || 'Farmer approved successfully!',
        type: 'success'
      });
      
      // Update the farmers list by removing the approved farmer
      setFarmers(farmers.filter(farmer => farmer.Record.id !== formData.farmerId));
      
      // Reset the form
      setFormData({
        bureauId: formData.bureauId,
        farmerId: ''
      });
    } catch (error) {
      setMessage({
        text: error.message || 'Failed to approve farmer.',
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
      
      <h1 className="text-2xl font-bold text-green-800 mb-6">Approve Farmer</h1>
      
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
          <p className="mt-2 text-gray-600">Loading farmers...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="bureauId">
              Bureau ID*
            </label>
            <input
              type="text"
              id="bureauId"
              name="bureauId"
              value={formData.bureauId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your bureau ID"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="farmerId">
              Select Farmer to Approve*
            </label>
            {farmers.length > 0 ? (
              <select
                id="farmerId"
                name="farmerId"
                value={formData.farmerId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Select a farmer --</option>
                {farmers.map(farmer => (
                  <option key={farmer.Key} value={farmer.Record.id}>
                    {farmer.Record.name} (ID: {farmer.Record.id}, Location: {farmer.Record.location})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-green-600 bg-green-50 p-4 rounded">
                No farmers pending approval. All farmers have been approved.
              </p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={submitting || farmers.length === 0 || !formData.farmerId}
            className={`w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 ${
              (submitting || farmers.length === 0 || !formData.farmerId) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? 'Processing...' : 'Approve Farmer'}
          </button>
        </form>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Approve a New Farmer</h2>
        <p className="text-gray-600 mb-4">
          If the farmer is not registered yet, direct them to register first:
        </p>
        <Link 
          to="/register-stakeholder" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Register New Stakeholder
        </Link>
      </div>
    </div>
  );
};

export default ApproveFarmer;