// src/pages/ProductDetails.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService, supplyChainService } from '../services/api';
import QRCode from '../components/QRCode';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrCode, setQRCode] = useState('');
  const [generating, setGenerating] = useState(false);
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await productService.getProductById(id);
        setProduct(response.data);
        
        // Get product history
        const historyResponse = await supplyChainService.getProductHistory(id);
        setHistory(historyResponse.data);
        
        setError('');
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);
  
  const generateQRCode = async () => {
    setGenerating(true);
    try {
      const response = await supplyChainService.generateQRCode(id);
      setQRCode(response.data || '');
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setGenerating(false);
    }
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
  
  const getNextActions = () => {
    if (!product) return [];
    
    const stage = product.currentStage;
    const actions = [];
    
    switch (stage) {
      case 'Registered':
        actions.push({
          name: 'Record Planting',
          path: `/record-planting?productId=${product.id}&type=planting`,
          role: 'Farmer'
        });
        break;
      case 'Planted':
      case 'Growing':
        actions.push({
          name: 'Record Growth',
          path: `/record-growth?productId=${product.id}&type=growth`,
          role: 'Farmer'
        });
        actions.push({
          name: 'Record Harvest',
          path: `/record-harvest?productId=${product.id}`,
          role: 'Farmer'
        });
        break;
      case 'Harvested':
        actions.push({
          name: 'Record Processing',
          path: `/record-processing?productId=${product.id}`,
          role: 'Processor'
        });
        actions.push({
          name: 'Perform Quality Check',
          path: `/quality-check?productId=${product.id}`,
          role: 'Quality Inspector'
        });
        break;
      case 'Processed':
        actions.push({
          name: 'Perform Quality Check',
          path: `/quality-check?productId=${product.id}`,
          role: 'Quality Inspector'
        });
        break;
      case 'QualityVerified':
        actions.push({
          name: 'Record Distribution',
          path: `/record-distribution?productId=${product.id}`,
          role: 'Distributor'
        });
        break;
      case 'Distributed':
        actions.push({
          name: 'Record Sale',
          path: `/record-sale?productId=${product.id}`,
          role: 'Retailer'
        });
        break;
      default:
        break;
    }
    
    return actions;
  };
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link to="/products" className="text-green-600 hover:text-green-800">
          ← Back to Products
        </Link>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Product not found
        </div>
        <Link to="/products" className="text-green-600 hover:text-green-800">
          ← Back to Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/products" className="text-green-600 hover:text-green-800">
          ← Back to Products
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.currentStage)} bg-opacity-80`}>
            {product.currentStage}
          </span>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Details</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600"><span className="font-medium">ID:</span> {product.id}</p>
                  <p className="text-gray-600"><span className="font-medium">Description:</span> {product.description}</p>
                  <p className="text-gray-600"><span className="font-medium">Owner:</span> {product.owner}</p>
                  <p className="text-gray-600"><span className="font-medium">Created:</span> {formatDate(product.createdAt)}</p>
                </div>
                
                <div>
                  <p className="text-gray-600"><span className="font-medium">Quantity:</span> {product.quantity || 'N/A'}</p>
                  {product.plantingDate && (
                    <p className="text-gray-600"><span className="font-medium">Planting Date:</span> {formatDate(product.plantingDate)}</p>
                  )}
                  {product.harvestDate && (
                    <p className="text-gray-600"><span className="font-medium">Harvest Date:</span> {formatDate(product.harvestDate)}</p>
                  )}
                  {product.batchId && (
                    <p className="text-gray-600"><span className="font-medium">Batch ID:</span> {product.batchId}</p>
                  )}
                </div>
              </div>
              
              {product.cropDetails && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Crop Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600"><span className="font-medium">Variety:</span> {product.cropDetails.variety || 'N/A'}</p>
                    <p className="text-gray-600"><span className="font-medium">Organic:</span> {product.cropDetails.organic ? 'Yes' : 'No'}</p>
                    {product.cropDetails.fertilizers && (
                      <p className="text-gray-600">
                        <span className="font-medium">Fertilizers:</span> {Array.isArray(product.cropDetails.fertilizers) 
                          ? product.cropDetails.fertilizers.join(', ') 
                          : product.cropDetails.fertilizers || 'N/A'}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {product.qualityChecks && product.qualityChecks.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Quality Checks</h3>
                  <div className="space-y-3">
                    {product.qualityChecks.map((check, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between">
                          <p className="font-medium text-gray-700">
                            Status: <span className={check.status === 'Passed' ? 'text-green-600' : 'text-red-600'}>
                              {check.status}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(check.timestamp)}</p>
                        </div>
                        <p className="text-gray-600">Inspector: {check.inspector}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Next Actions</h3>
                <div className="flex flex-wrap gap-2">
                  {getNextActions().map((action, index) => (
                    <Link
                      key={index}
                      to={`${action.path}?productId=${product.id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                    >
                      {action.name} ({action.role})
                    </Link>
                  ))}
                  
                  {getNextActions().length === 0 && (
                    <p className="text-gray-500">No further actions available for this product.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">QR Code</h3>
                
                {qrCode ? (
                  <div className="text-center">
                    <QRCode value={qrCode} size={200} />
                    <p className="mt-2 text-sm text-gray-600">Scan to view product history</p>
                    <button
                      onClick={() => window.print()}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 w-full"
                    >
                      Print QR Code
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg mb-4">
                      <p className="text-gray-500">No QR code generated yet</p>
                    </div>
                    <button
                      onClick={generateQRCode}
                      disabled={generating}
                      className={`w-full bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 ${
                        generating ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {generating ? 'Generating...' : 'Generate QR Code'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {history && history.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
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

export default ProductDetails;