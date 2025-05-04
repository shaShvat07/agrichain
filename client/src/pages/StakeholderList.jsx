// src/pages/StakeholderList.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { stakeholderService } from '../services/api';

const StakeholderList = () => {
  const [stakeholders, setStakeholders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    role: '',
    search: ''
  });
  
  useEffect(() => {
    const fetchStakeholders = async () => {
      try {
        const response = await stakeholderService.getAllStakeholders();
        setStakeholders(response.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to load stakeholders. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStakeholders();
  }, []);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  // Filter stakeholders based on search term and role
  const filteredStakeholders = stakeholders.filter(stakeholder => {
    const matchesSearch = filters.search === '' ||
      stakeholder.Record.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      stakeholder.Record.id.toLowerCase().includes(filters.search.toLowerCase()) ||
      stakeholder.Record.location.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesRole = filters.role === '' || stakeholder.Record.role === filters.role;
    
    return matchesSearch && matchesRole;
  });
  
  // Get all unique roles
  const roles = [...new Set(stakeholders.map(stakeholder => stakeholder.Record.role))].filter(Boolean);
  
  // Function to get badge color based on role
  const getRoleBadgeColor = (role) => {
    const roleColors = {
      'Farmer': 'bg-green-500',
      'Processor': 'bg-orange-500',
      'Agricultural Bureau': 'bg-blue-500',
      'Quality Inspector': 'bg-purple-500',
      'Distributor': 'bg-indigo-500',
      'Retailer': 'bg-red-500'
    };
    
    return roleColors[role] || 'bg-gray-400';
  };
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">Loading stakeholders...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">Supply Chain Stakeholders</h1>
        <Link to="/register-stakeholder" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Register as Stakeholder
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="md:w-2/3">
            <label htmlFor="search" className="sr-only">Search stakeholders</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Search by name, ID, or location"
                type="search"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          
          <div className="md:w-1/3">
            <label htmlFor="role" className="sr-only">Filter by role</label>
            <select
              id="role"
              name="role"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              value={filters.role}
              onChange={handleFilterChange}
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {filteredStakeholders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-gray-900 text-lg font-medium">No stakeholders found</h3>
          <p className="mt-1 text-gray-500">
            {filters.search || filters.role
              ? 'Try changing your search criteria or clearing filters.'
              : 'Start by registering as a stakeholder in the supply chain.'
            }
          </p>
          <div className="mt-6">
            <Link to="/register-stakeholder" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Register as Stakeholder
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStakeholders.map(stakeholder => (
            <div key={stakeholder.Key} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-green-700 mb-2">
                    {stakeholder.Record.name}
                  </h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getRoleBadgeColor(stakeholder.Record.role)}`}>
                    {stakeholder.Record.role}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3 text-sm">
                  ID: {stakeholder.Record.id}
                </p>
                
                <div className="space-y-2 mb-4">
                  <p className="text-gray-700">
                    <span className="font-medium">Location:</span> {stakeholder.Record.location}
                  </p>
                  
                  {stakeholder.Record.role === 'Farmer' && (
                    <p className="text-gray-700">
                      <span className="font-medium">Approved:</span> {stakeholder.Record.approvedBy ? 'Yes' : 'No'}
                    </p>
                  )}
                  
                  {stakeholder.Record.registrationDate && (
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Registered:</span> {new Date(stakeholder.Record.registrationDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                {stakeholder.Record.role === 'Farmer' && !stakeholder.Record.approvedBy && (
                  <div className="mt-3">
                    <Link 
                      to={`/approve-farmer?farmerId=${stakeholder.Record.id}`}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                    >
                      Approve Farmer
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6">
        <p className="text-gray-500 text-sm">
          Showing {filteredStakeholders.length} of {stakeholders.length} stakeholders
        </p>
      </div>
    </div>
  );
};

export default StakeholderList;