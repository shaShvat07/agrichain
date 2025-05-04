// src/pages/retailer/RecordSale.jsx
import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, supplyChainService } from '../../services/api';
import QRCode from '../../components/QRCode';

const RecordSale = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qrCode, setQRCode] = useState('');
  
  const [formData, setFormData] = useState({
    productId: '',
    retailerId: '', // Should come from auth context in a real app
    quantity: '',
    saleDetails: {
      saleDate: '',
      customerType: 'Individual',
      price: '',
      paymentMethod: '',
    }
  });
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In a real app, we would filter products in the retailer's inventory
        const response = await productService.getAllProducts();
        
        // Filter for products in the appropriate stage
        const eligibleProducts = response.data.filter(
          product => product.Record.currentStage === 'Distributed'
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
      // Handle nested properties (saleDetails)
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
        setQRCode(''); // Reset QR code
      }
    }
  };
  
  const generateQRCode = async () => {
    if (!formData.productId) return;
    
    setGenerating(true);
    try {
      const response = await supplyChainService.generateQRCode(formData.productId);
      setQRCode(response.data || '');
      
      setMessage({
        text: 'QR code generated successfully!',
        type: 'success'
      });
    } catch (error) {
      setMessage({
        text: error.message || 'Failed to generate QR code.',
        type: 'error'
      });
    } finally {
      setGenerating(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });
    
    try {
      const response = await supplyChainService.recordRetailSale(formData.productId, formData.retailerId, formData.quantity, formData.saleDetails);
      
      setMessage({
        text: response.message || 'Sale recorded successfully!',
        type: 'success'
      });
      
      // Generate QR code after successful sale
      if (!qrCode) {
        await generateQRCode();
      }
      
      // Reset form but keep the product and QR code
      const productId = formData.productId;
      const selectedProd = selectedProduct;
      const qr = qrCode;
      
      setFormData({
        productId,
        retailerId: formData.retailerId,
        quantity: '',
        saleDetails: {
          saleDate: '',
          customerType: 'Individual',
          price: '',
          paymentMethod: '',
        }
      });
      
      setSelectedProduct(selectedProd);
      setQRCode(qr);
    } catch (error) {
      setMessage({
        text: error.message || 'Failed to record sale.',
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
      
      <h1 className="text-2xl font-bold text-green-800 mb-6">Record Retail Sale</h1>
      
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
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
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
                    No products found in inventory. Products must be in 'Distributed' stage.
                  </p>
                )}
              </div>
              
              {selectedProduct && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-700 mb-2">Product Details</h3>
                  <p><strong>Name:</strong> {selectedProduct.name}</p>
                  <p><strong>Description:</strong> {selectedProduct.description}</p>
                  {selectedProduct.batchId && (
                    <p><strong>Batch ID:</strong> {selectedProduct.batchId}</p>
                  )}
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="retailerId">
                  Retailer ID*
                </label>
                <input
                  type="text"
                  id="retailerId"
                  name="retailerId"
                  value={formData.retailerId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your retailer ID"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="quantity">
                  Quantity Sold*
                </label>
                <input
                  type="text"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="E.g. 5kg, 10 units"
                />
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-green-700 mb-3">Sale Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="saleDetails.saleDate">
                      Sale Date*
                    </label>
                    <input
                      type="date"
                      id="saleDetails.saleDate"
                      name="saleDetails.saleDate"
                      value={formData.saleDetails.saleDate}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="saleDetails.customerType">
                      Customer Type*
                    </label>
                    <select
                      id="saleDetails.customerType"
                      name="saleDetails.customerType"
                      value={formData.saleDetails.customerType}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Individual">Individual</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Institution">Institution</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="saleDetails.price">
                      Price
                    </label>
                    <input
                      type="text"
                      id="saleDetails.price"
                      name="saleDetails.price"
                      value={formData.saleDetails.price}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="E.g. $25.99"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="saleDetails.paymentMethod">
                      Payment Method
                    </label>
                    <select
                      id="saleDetails.paymentMethod"
                      name="saleDetails.paymentMethod"
                      value={formData.saleDetails.paymentMethod}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">-- Select payment method --</option>
                      <option value="Cash">Cash</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Mobile Payment">Mobile Payment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={submitting || products.length === 0}
                className={`w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 ${
                  (submitting || products.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? 'Processing...' : 'Record Sale'}
              </button>
            </form>
          </div>
          
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-green-700 mb-3">Product QR Code</h3>
              
              {qrCode ? (
                <div className="text-center">
                  <QRCode value={qrCode} size={200} />
                  <p className="mt-2 text-sm text-gray-600">Scan to view product history</p>
                  <button
                    onClick={() => window.print()}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    Print QR Code
                  </button>
                </div>
              ) : (
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">
                    Select a product and record a sale to generate a QR code
                  </p>
                  
                  {selectedProduct && (
                    <button
                      onClick={generateQRCode}
                      disabled={generating || !selectedProduct}
                      className={`bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 ${
                        (generating || !selectedProduct) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {generating ? 'Generating...' : 'Generate QR Code'}
                    </button>
                  )}
                </div>
              )}
              
              {selectedProduct && qrCode && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">QR Code URL:</h4>
                  <p className="text-sm break-all">{qrCode}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordSale;