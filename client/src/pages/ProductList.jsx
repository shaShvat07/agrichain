// src/pages/ProductList.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    stage: '',
    search: ''
  });
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        setProducts(response.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  // Filter products based on search term and stage
  const filteredProducts = products.filter(product => {
    const matchesSearch = filters.search === '' ||
      product.Record.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.Record.id.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.Record.owner.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStage = filters.stage === '' || product.Record.currentStage === filters.stage;
    
    return matchesSearch && matchesStage;
  });
  
  // Get all unique stages
  const stages = [...new Set(products.map(product => product.Record.currentStage))].filter(Boolean);
  
  // Function to get badge color based on stage
  const getStageBadgeColor = (stage) => {
    const stageColors = {
      'Registered': 'bg-gray-500',
      'Planted': 'bg-green-500',
      'Growing': 'bg-green-600',
      'Harvested': 'bg-yellow-500',
      'Processed': 'bg-orange-500',
      'QualityVerified': 'bg-blue-500',
      'QualityRejected': 'bg-red-500',
      'Distributed': 'bg-purple-500',
      'Sold': 'bg-indigo-500'
    };
    
    return stageColors[stage] || 'bg-gray-400';
  };
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">Agricultural Products</h1>
        <Link to="/register-product" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Register New Product
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
            <label htmlFor="search" className="sr-only">Search products</label>
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
                placeholder="Search by name, ID, or owner"
                type="search"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          
          <div className="md:w-1/3">
            <label htmlFor="stage" className="sr-only">Filter by stage</label>
            <select
              id="stage"
              name="stage"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              value={filters.stage}
              onChange={handleFilterChange}
            >
              <option value="">All Stages</option>
              {stages.map(stage => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="mt-2 text-gray-900 text-lg font-medium">No products found</h3>
          <p className="mt-1 text-gray-500">
            {filters.search || filters.stage
              ? 'Try changing your search criteria or clearing filters.'
              : 'Start by registering a new agricultural product.'
            }
          </p>
          <div className="mt-6">
            <Link to="/register-product" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Register Product
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.Key} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-green-700 mb-2">
                    {product.Record.name}
                  </h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStageBadgeColor(product.Record.currentStage)}`}>
                    {product.Record.currentStage}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3 text-sm">
                  ID: {product.Record.id}
                </p>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {product.Record.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Owner: {product.Record.owner}
                  </span>
                  <Link 
                    to={`/products/${product.Record.id}`}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6">
        <p className="text-gray-500 text-sm">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>
    </div>
  );
};

export default ProductList;