// src/pages/consumer/ScanQR.jsx
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/api';

const ScanQR = () => {
  const [productId, setProductId] = useState('');
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const canvasRef = useRef(null);
  
  // In a real app, this would use a QR code scanning library
  const mockScanQRCode = () => {
    setShowCamera(true);
  
  };
  
  const handleInputChange = (e) => {
    setProductId(e.target.value);
  };
  
  const handleSearch = async (id = null) => {
    const searchId = id || productId;
    if (!searchId) {
      setError('Please enter a product ID');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await productService.traceProduct(searchId);
      
      if (response.status === 'success') {
        setProduct(response.data.product);
        setHistory(response.data.history);
      } else {
        setError('Failed to find product');
        setProduct(null);
        setHistory([]);
      }
    } catch (error) {
      console.error('Error tracing product:', error);
      setError(error.message || 'Failed to trace product');
      setProduct(null);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status color for timeline
  const getStatusColor = (stage) => {
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
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-green-600 hover:text-green-800">
          ← Back to Dashboard
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold text-green-800 mb-6">Product Traceability</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold text-green-700 mb-4">Scan or Enter Product ID</h2>
        
        <div className="flex flex-col md:flex-row md:space-x-4">
          {/* <div className="mb-4 md:mb-0 md:w-1/2">
            <button
              onClick={mockScanQRCode}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Scan QR Code
            </button>
            
            {showCamera && (
              <div className="mt-2 relative bg-black rounded-lg overflow-hidden aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white rounded-lg"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  Scanning...
                </div>
                <canvas ref={canvasRef} className="hidden"></canvas>
              </div>
            )}
          </div> */}
          
          <div className="md:w-1/2">
            <form onSubmit={handleSubmit}>
              <div className="flex">
                <input
                  type="text"
                  value={productId}
                  onChange={handleInputChange}
                  placeholder="Enter product ID"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-3 rounded-r-lg hover:bg-green-700"
                >
                  Trace
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">Tracing product...</p>
        </div>
      )}
      
      {product && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-green-700 text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Product Information</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Basic Details</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><span className="font-medium">Product ID:</span> {product.id}</li>
                  <li><span className="font-medium">Name:</span> {product.name}</li>
                  <li><span className="font-medium">Description:</span> {product.description}</li>
                  <li><span className="font-medium">Current Stage:</span> {product.currentStage}</li>
                  <li><span className="font-medium">Current Owner:</span> {product.owner}</li>
                  <li><span className="font-medium">Created:</span> {formatDate(product.createdAt)}</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Agricultural Details</h3>
                <ul className="space-y-2 text-gray-600">
                  {product.cropDetails && (
                    <>
                      <li><span className="font-medium">Variety:</span> {product.cropDetails.variety || 'N/A'}</li>
                      <li><span className="font-medium">Organic:</span> {product.cropDetails.organic ? 'Yes' : 'No'}</li>
                      <li>
                        <span className="font-medium">Fertilizers Used:</span>&nbsp;
                        {product.cropDetails.fertilizers && product.cropDetails.fertilizers.length > 0 
                          ? product.cropDetails.fertilizers.join(', ') 
                          : 'N/A'
                        }
                      </li>
                    </>
                  )}
                  <li><span className="font-medium">Planting Date:</span> {product.plantingDate ? formatDate(product.plantingDate) : 'N/A'}</li>
                  <li><span className="font-medium">Harvest Date:</span> {product.harvestDate ? formatDate(product.harvestDate) : 'N/A'}</li>
                  <li><span className="font-medium">Quantity:</span> {product.quantity || 'N/A'}</li>
                </ul>
              </div>
            </div>
            
            {product.batchId && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Processing Information</h3>
                <p className="text-gray-600"><span className="font-medium">Batch ID:</span> {product.batchId}</p>
              </div>
            )}
            
            {product.qualityChecks && product.qualityChecks.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Quality Checks</h3>
                <div className="space-y-3">
                  {product.qualityChecks.map((check, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <p className="font-medium text-gray-700">
                        Check #{index + 1}: {check.status}
                        <span className="ml-2 text-sm text-gray-500">
                          ({formatDate(check.timestamp)})
                        </span>
                      </p>
                      <p className="text-gray-600">Inspector: {check.inspector}</p>
                      {check.details && (
                        <div className="mt-1 text-sm text-gray-500">
                          {Object.entries(check.details).map(([key, value]) => (
                            <p key={key}>{key}: {value}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {history && history.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-700 text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Supply Chain Journey</h2>
          </div>
          
          <div className="p-6">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-200"></div>
              
              {/* Timeline events */}
              <ul className="space-y-6 relative">
                {history.map((event, index) => (
                  <li key={index} className="ml-12 relative">
                    {/* Timeline dot */}
                    <div className={`absolute -left-12 mt-1.5 w-5 h-5 rounded-full border-4 border-white ${getStatusColor(event.stage)}`}></div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-800">
                          {event.stage}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatDate(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">
                        {event.notes}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        By Stakeholder: {event.stakeholderId}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanQR;